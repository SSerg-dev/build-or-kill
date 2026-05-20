import { REQUIRED_ROLES } from "./schemas.js";

export function analyzeWithMock({ input, clarificationAnswers = [], forceFinal = false }) {
  if (!forceFinal && isWeakInput(input)) {
    return clarificationResult(input);
  }

  const combinedContext = [
    input.description,
    input.audience,
    input.problem,
    input.notes,
    ...clarificationAnswers
  ].join(" ");
  const verdict = chooseVerdict(combinedContext, input);

  return finalResult(input, clarificationAnswers, verdict);
}

function isWeakInput(input) {
  const text = [input.description, input.audience, input.problem].join(" ").toLowerCase();
  const shortFields = [input.description, input.audience, input.problem].filter((value) => value.length < 28);
  const broadAudience = /\b(everyone|all people|businesses|companies|users|creators|consumers)\b/.test(input.audience.toLowerCase());
  const genericProblem = /\b(productivity|automation|ai tool|platform|dashboard|manage everything|save time)\b/.test(text);
  return shortFields.length > 0 || broadAudience || genericProblem;
}

function clarificationResult(input) {
  const questions = [
    `Which narrow user segment has this problem most painfully: "${input.problem || "the stated problem"}"?`,
    "What manual workaround or existing tool do these users use today?",
    "What is the smallest paid or usage-based test you could run in one week?"
  ];

  return {
    result_type: "clarification_needed",
    questions,
    reason: "The idea needs a narrower audience, sharper pain, or a smaller validation path before a useful verdict.",
    verdict: null,
    confidence_score: null,
    verdict_reason: "",
    role_analyses: [],
    key_strengths: [],
    key_risks: [],
    mvp_scope: [],
    validation_experiments: [],
    recommended_next_actions: [],
    advisory_disclaimer: ""
  };
}

function finalResult(input, clarificationAnswers, verdict) {
  const audience = input.audience;
  const problem = input.problem;
  const idea = input.ideaName || "the idea";
  const clarified = clarificationAnswers.length > 0 ? ` Clarification context: ${clarificationAnswers.join(" ")}` : "";

  return {
    result_type: "final_result",
    questions: [],
    reason: "",
    verdict,
    confidence_score: verdict === "BUILD" ? 74 : verdict === "PIVOT" ? 63 : 48,
    verdict_reason: verdictReason(verdict, input),
    role_analyses: REQUIRED_ROLES.map((role) => roleAnalysis(role, idea, audience, problem)),
    key_strengths: [
      `Targets ${audience} instead of a fully generic audience.`,
      `Anchors the product around the stated pain: ${problem}.`,
      "Can be validated with a narrow MVP before broader build-out."
    ],
    key_risks: [
      "The pain may not be urgent enough to trigger payment or repeated use.",
      "The MVP could expand into a broad platform if the first test is not constrained.",
      "Positioning must prove why the target audience changes behavior."
    ],
    mvp_scope: [
      "Build the smallest workflow that solves the stated pain for one narrow audience.",
      "Avoid accounts, analytics, dashboards, and broad automation until demand is proven.",
      "Use a manual or semi-manual backend where possible during validation."
    ],
    validation_experiments: [
      `Interview 5-8 ${audience} users about the exact moment they experience the pain.`,
      "Create a clickable or concierge demo and ask users to complete one realistic task.",
      "Offer a simple paid pilot or waitlist commitment tied to the specific outcome."
    ],
    recommended_next_actions: [
      "Write a one-sentence promise that names the audience, pain, and outcome.",
      "Define the smallest success metric for a one-week validation test.",
      "Run the validation experiment before building secondary features."
    ],
    advisory_disclaimer: `This is an advisory validation brief based only on the provided input.${clarified} It is not a guarantee of business success and does not replace real customer validation.`
  };
}

function chooseVerdict(text, input) {
  const lower = text.toLowerCase();
  if (/\b(no audience|unclear|everyone|all businesses|huge platform|social network|marketplace for everything)\b/.test(lower)) {
    return "KILL";
  }
  if (/\b(broad|many features|platform|dashboard|crm|analytics|automation suite)\b/.test(lower)) {
    return "PIVOT";
  }
  if (input.description.length > 80 && input.audience.length > 35 && input.problem.length > 35) {
    return "BUILD";
  }
  return "PIVOT";
}

function verdictReason(verdict, input) {
  if (verdict === "BUILD") {
    return `The idea has a clear enough audience (${input.audience}) and pain (${input.problem}) to justify a small validation build.`;
  }
  if (verdict === "PIVOT") {
    return "The idea has potential, but the MVP or positioning should be narrowed before serious build time.";
  }
  return "The provided information does not show a clear enough problem, audience, or validation path to justify building now.";
}

function roleAnalysis(role, idea, audience, problem) {
  const map = {
    "Product Strategist": {
      focus: `Narrow ${idea} around one painful workflow for ${audience}.`,
      bullets: [
        `The strongest product angle is the explicit pain: ${problem}.`,
        "The MVP should prove one repeated use case before expanding."
      ]
    },
    CTO: {
      focus: "Keep the technical build small enough for a fast validation cycle.",
      bullets: [
        "Avoid complex platform architecture until demand is proven.",
        "Use simple data flows and manual operations where they reduce build time."
      ]
    },
    "Growth Marketer": {
      focus: `Reach ${audience} through the context where the pain already appears.`,
      bullets: [
        "Position around the painful moment, not the implementation technology.",
        "Test messaging with direct outreach before investing in broad channels."
      ]
    },
    Skeptic: {
      focus: "The riskiest assumption is that the pain is urgent enough to change behavior.",
      bullets: [
        "Do not treat interest as validation unless users commit time, data, or money.",
        "Watch for vague praise that does not map to a concrete workflow."
      ]
    },
    "Investor / Business Reviewer": {
      focus: "Commercial potential depends on repeatable demand and willingness to pay.",
      bullets: [
        "A narrow paid pilot is stronger evidence than a broad free waitlist.",
        "Scalability should wait until the first segment shows retention signals."
      ]
    }
  };

  return {
    role,
    focus: map[role].focus,
    bullets: map[role].bullets
  };
}
