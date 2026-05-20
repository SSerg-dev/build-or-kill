import { analyzeWithMock } from "./mockAdvisor.js";
import { buildAdvisorSystemPrompt, buildAdvisorUserPayload } from "./prompts.js";
import {
  buildOrKillResultSchema,
  detectForbiddenClaims,
  validateAdvisorResult
} from "./schemas.js";

export async function analyzeIdea({ input, clarificationAnswers = [], forceFinal = false, env = process.env }) {
  const useMock = env.MOCK_AI !== "false" || !env.OPENAI_API_KEY;

  if (useMock) {
    return checkedResult(analyzeWithMock({ input, clarificationAnswers, forceFinal }));
  }

  try {
    const liveResult = await callOpenAI({ input, clarificationAnswers, forceFinal, env });
    return checkedResult(liveResult);
  } catch {
    return checkedResult(analyzeWithMock({ input, clarificationAnswers, forceFinal }));
  }
}

async function callOpenAI({ input, clarificationAnswers, forceFinal, env }) {
  const payload = {
    model: env.OPENAI_MODEL || "gpt-5.2",
    input: [
      { role: "system", content: buildAdvisorSystemPrompt() },
      { role: "user", content: buildAdvisorUserPayload({ input, clarificationAnswers, forceFinal }) }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "build_or_kill_result",
        strict: true,
        schema: buildOrKillResultSchema
      }
    }
  };

  const first = await requestOpenAI(payload, env.OPENAI_API_KEY);
  const firstParsed = parseOpenAIJson(first);
  const firstValidation = validateAdvisorResult(firstParsed);
  const firstForbidden = detectForbiddenClaims(firstParsed);

  if (firstValidation.valid && !firstForbidden) {
    return firstParsed;
  }

  const retry = await requestOpenAI(payload, env.OPENAI_API_KEY);
  const retryParsed = parseOpenAIJson(retry);
  const retryValidation = validateAdvisorResult(retryParsed);
  const retryForbidden = detectForbiddenClaims(retryParsed);

  if (!retryValidation.valid) {
    throw new Error(retryValidation.message);
  }
  if (retryForbidden) {
    throw new Error(retryForbidden);
  }

  return retryParsed;
}

async function requestOpenAI(payload, apiKey) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  return response.json();
}

function parseOpenAIJson(response) {
  if (typeof response.output_text === "string") {
    return JSON.parse(response.output_text);
  }

  const text = response.output
    ?.flatMap((item) => item.content || [])
    ?.map((content) => content.text || "")
    ?.join("");

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return JSON.parse(text);
}

function checkedResult(result) {
  const validation = validateAdvisorResult(result);
  if (!validation.valid) {
    return {
      error: "Advisor result failed schema validation.",
      detail: validation.message
    };
  }

  const forbidden = detectForbiddenClaims(result);
  if (forbidden) {
    return {
      error: "Advisor result contained an unsupported research or guarantee claim."
    };
  }

  return result;
}
