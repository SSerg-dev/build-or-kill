const STORAGE_KEY = "build-or-kill:last-result";

const form = document.querySelector("#idea-form");
const validationMessage = document.querySelector("#validation-message");
const clarificationPanel = document.querySelector("#clarification-panel");
const clarificationReason = document.querySelector("#clarification-reason");
const clarificationQuestions = document.querySelector("#clarification-questions");
const loadingPanel = document.querySelector("#loading-panel");
const resultPanel = document.querySelector("#result-panel");
const resultContent = document.querySelector("#result-content");
const staleBadge = document.querySelector("#stale-badge");

const state = {
  status: "idle",
  lastResult: null,
  resultInputSnapshot: null,
  stale: false,
  activeInput: null,
  clarificationQuestions: [],
  clarificationTimer: null,
  requestInFlight: false
};

const requiredFields = [
  ["description", "Product description"],
  ["audience", "Target audience"],
  ["problem", "Main pain or problem"]
];

function readInput() {
  const data = new FormData(form);
  return {
    ideaName: String(data.get("ideaName") || "").trim(),
    description: String(data.get("description") || "").trim(),
    audience: String(data.get("audience") || "").trim(),
    problem: String(data.get("problem") || "").trim(),
    notes: String(data.get("notes") || "").trim()
  };
}

function validateInput(input) {
  return requiredFields
    .filter(([key]) => !input[key])
    .map(([, label]) => label);
}

function setStatus(status) {
  state.status = status;
  validationMessage.hidden = status !== "validation-error" && status !== "error";
  clarificationPanel.hidden = status !== "clarification";
  loadingPanel.hidden = status !== "analyzing";
  resultPanel.hidden = !state.lastResult;
  staleBadge.hidden = !state.stale;
}

function showValidation(message) {
  validationMessage.textContent = message;
  setStatus("validation-error");
}

function showError(message) {
  validationMessage.textContent = message;
  setStatus("error");
}

function renderResult() {
  if (!state.lastResult) {
    resultContent.innerHTML = "";
    resultPanel.hidden = true;
    return;
  }

  if (state.lastResult.result_type === "final_result") {
    resultContent.innerHTML = `
      <p class="placeholder-result"><strong>${escapeHtml(state.lastResult.verdict)}</strong>
      (${escapeHtml(state.lastResult.confidence_score)}/100): ${escapeHtml(state.lastResult.verdict_reason)}</p>
    `;
  } else {
    resultContent.innerHTML = `
      <p class="placeholder-result">${escapeHtml(state.lastResult.summary || "Previous validation result restored locally.")}</p>
    `;
  }
  resultPanel.hidden = false;
  staleBadge.hidden = !state.stale;
}

function persistLastResult(result, inputSnapshot) {
  const payload = {
    result,
    inputSnapshot,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function restoreLastResult() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const payload = JSON.parse(raw);
    if (!payload || !payload.result || !payload.inputSnapshot) return;
    state.lastResult = payload.result;
    state.resultInputSnapshot = payload.inputSnapshot;
    state.stale = true;
    renderResult();
    setStatus("result");
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function markResultStaleIfNeeded() {
  if (!state.lastResult || state.stale) return;
  const currentInput = readInput();
  const changed = JSON.stringify(currentInput) !== JSON.stringify(state.resultInputSnapshot);
  if (changed) {
    state.stale = true;
    staleBadge.hidden = false;
  }
}

function renderClarification(result) {
  state.clarificationQuestions = result.questions;
  clarificationReason.textContent = result.reason;
  clarificationQuestions.innerHTML = result.questions
    .map((question, index) => `
      <label class="field clarification-field">
        <span>${escapeHtml(question)}</span>
        <input type="text" data-clarification-index="${index}" autocomplete="off">
      </label>
    `)
    .join("");
  setStatus("clarification");
}

function scheduleClarificationSubmit() {
  clearTimeout(state.clarificationTimer);
  state.clarificationTimer = setTimeout(() => {
    const answers = readClarificationAnswers();
    if (answers.some((answer) => !answer)) {
      showValidation("Fill every clarification answer before final analysis.");
      clarificationPanel.hidden = false;
      return;
    }
    submitAnalysis({ input: state.activeInput, clarificationAnswers: answers, mode: "final" });
  }, 500);
}

function readClarificationAnswers() {
  return Array.from(clarificationQuestions.querySelectorAll("[data-clarification-index]"))
    .map((field) => field.value.trim());
}

async function submitAnalysis({ input, clarificationAnswers = [], mode = "initial" }) {
  if (state.requestInFlight) return;
  state.requestInFlight = true;
  validationMessage.hidden = true;
  setStatus("analyzing");

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input, clarificationAnswers, mode })
    });
    const payload = await response.json();

    if (!response.ok || payload.error) {
      throw new Error(payload.error || "Analysis failed.");
    }

    if (payload.result_type === "clarification_needed") {
      renderClarification(payload);
      return;
    }

    state.lastResult = payload;
    state.resultInputSnapshot = input;
    state.stale = false;
    state.clarificationQuestions = [];
    clarificationQuestions.innerHTML = "";
    persistLastResult(payload, input);
    renderResult();
    setStatus("result");
  } catch (error) {
    showError(error.message || "Analysis failed. Try again.");
  } finally {
    state.requestInFlight = false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

form.addEventListener("input", markResultStaleIfNeeded);

clarificationQuestions.addEventListener("input", scheduleClarificationSubmit);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = readInput();
  const missing = validateInput(input);

  if (missing.length > 0) {
    showValidation(`Fill required fields: ${missing.join(", ")}.`);
    return;
  }

  state.activeInput = input;
  clarificationQuestions.innerHTML = "";
  await submitAnalysis({ input });
});

restoreLastResult();
