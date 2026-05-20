export const REQUIRED_ROLES = [
  "Product Strategist",
  "CTO",
  "Growth Marketer",
  "Skeptic",
  "Investor / Business Reviewer"
];

export const buildOrKillResultSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "result_type",
    "questions",
    "reason",
    "verdict",
    "confidence_score",
    "verdict_reason",
    "role_analyses",
    "key_strengths",
    "key_risks",
    "mvp_scope",
    "validation_experiments",
    "recommended_next_actions",
    "advisory_disclaimer"
  ],
  properties: {
    result_type: { type: "string", enum: ["clarification_needed", "final_result"] },
    questions: { type: "array", minItems: 0, maxItems: 3, items: { type: "string" } },
    reason: { type: "string" },
    verdict: { type: ["string", "null"], enum: ["BUILD", "PIVOT", "KILL", null] },
    confidence_score: { type: ["integer", "null"], minimum: 0, maximum: 100 },
    verdict_reason: { type: "string" },
    role_analyses: {
      type: "array",
      minItems: 0,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "focus", "bullets"],
        properties: {
          role: { type: "string", enum: REQUIRED_ROLES },
          focus: { type: "string" },
          bullets: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            items: { type: "string" }
          }
        }
      }
    },
    key_strengths: { type: "array", items: { type: "string" } },
    key_risks: { type: "array", items: { type: "string" } },
    mvp_scope: { type: "array", items: { type: "string" } },
    validation_experiments: { type: "array", items: { type: "string" } },
    recommended_next_actions: { type: "array", items: { type: "string" } },
    advisory_disclaimer: { type: "string" }
  }
};

const forbiddenClaimPatterns = [
  /\bguarantee[sd]?\s+(success|revenue|growth|traction)\b/i,
  /\bmarket\s+(size|share|data)\s+(is|shows|proves)\b/i,
  /\bcompetitor\s+(research|analysis)\s+(shows|proves|found)\b/i,
  /\bwe\s+(scraped|researched|analyzed)\s+competitors\b/i
];

export function validateIdeaInput(input) {
  if (!input || typeof input !== "object") {
    return { valid: false, message: "Request must include an input object." };
  }

  const normalized = {
    ideaName: cleanText(input.ideaName),
    description: cleanText(input.description),
    audience: cleanText(input.audience),
    problem: cleanText(input.problem),
    notes: cleanText(input.notes)
  };

  const missing = [];
  if (!normalized.description) missing.push("product description");
  if (!normalized.audience) missing.push("target audience");
  if (!normalized.problem) missing.push("main pain/problem");

  if (missing.length > 0) {
    return { valid: false, message: `Missing required fields: ${missing.join(", ")}.` };
  }

  return { valid: true, input: normalized };
}

export function validateAdvisorResult(result) {
  if (!result || typeof result !== "object") {
    return { valid: false, message: "Result must be an object." };
  }

  if (result.result_type === "clarification_needed") {
    return validateClarificationResult(result);
  }

  if (result.result_type === "final_result") {
    return validateFinalResult(result);
  }

  return { valid: false, message: "Unknown result_type." };
}

export function detectForbiddenClaims(result) {
  const text = JSON.stringify(result);
  const match = forbiddenClaimPatterns.find((pattern) => pattern.test(text));
  return match ? `Forbidden unsupported claim matched: ${match}` : null;
}

function validateClarificationResult(result) {
  if (!Array.isArray(result.questions) || result.questions.length < 2 || result.questions.length > 3) {
    return { valid: false, message: "Clarification result must include 2-3 questions." };
  }
  if (result.questions.some((question) => !cleanText(question))) {
    return { valid: false, message: "Clarification questions must be non-empty." };
  }
  if (result.verdict !== null) {
    return { valid: false, message: "Clarification result must not include a verdict." };
  }
  return { valid: true };
}

function validateFinalResult(result) {
  if (!["BUILD", "PIVOT", "KILL"].includes(result.verdict)) {
    return { valid: false, message: "Final result must include exactly one valid verdict." };
  }
  if (!Number.isInteger(result.confidence_score) || result.confidence_score < 0 || result.confidence_score > 100) {
    return { valid: false, message: "Final result confidence_score must be an integer from 0 to 100." };
  }
  if (!cleanText(result.verdict_reason)) {
    return { valid: false, message: "Final result must include a verdict reason." };
  }
  if (!Array.isArray(result.role_analyses) || result.role_analyses.length !== REQUIRED_ROLES.length) {
    return { valid: false, message: "Final result must include all five role analyses." };
  }

  const roles = new Set(result.role_analyses.map((item) => item.role));
  for (const role of REQUIRED_ROLES) {
    if (!roles.has(role)) {
      return { valid: false, message: `Missing role analysis: ${role}.` };
    }
  }

  for (const roleAnalysis of result.role_analyses) {
    if (!cleanText(roleAnalysis.focus)) {
      return { valid: false, message: `Role ${roleAnalysis.role} must include focus.` };
    }
    if (!Array.isArray(roleAnalysis.bullets) || roleAnalysis.bullets.length < 2 || roleAnalysis.bullets.length > 4) {
      return { valid: false, message: `Role ${roleAnalysis.role} must include 2-4 bullets.` };
    }
  }

  for (const key of ["key_strengths", "key_risks", "mvp_scope", "validation_experiments", "recommended_next_actions"]) {
    if (!Array.isArray(result[key]) || result[key].length === 0 || result[key].some((item) => !cleanText(item))) {
      return { valid: false, message: `Final result must include ${key}.` };
    }
  }

  if (!/advisory|customer validation|not a guarantee/i.test(result.advisory_disclaimer || "")) {
    return { valid: false, message: "Final result must include an advisory disclaimer." };
  }

  return { valid: true };
}

function cleanText(value) {
  return String(value || "").trim();
}
