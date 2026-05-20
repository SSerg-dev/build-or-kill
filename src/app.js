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
  stale: false
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

function renderResult() {
  if (!state.lastResult) {
    resultContent.innerHTML = "";
    resultPanel.hidden = true;
    return;
  }

  resultContent.innerHTML = `
    <p class="placeholder-result">${escapeHtml(state.lastResult.summary)}</p>
  `;
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

function showClarificationPlaceholder() {
  clarificationReason.textContent = "The analysis needs a little more context before it can give a useful verdict.";
  clarificationQuestions.innerHTML = "";
  setStatus("clarification");
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = readInput();
  const missing = validateInput(input);

  if (missing.length > 0) {
    showValidation(`Fill required fields: ${missing.join(", ")}.`);
    return;
  }

  validationMessage.hidden = true;
  showClarificationPlaceholder();

  const demoResult = {
    summary: "Plan 01-01 UI shell is ready. AI analysis will be connected in Plan 01-02."
  };
  state.lastResult = demoResult;
  state.resultInputSnapshot = input;
  state.stale = false;
  persistLastResult(demoResult, input);
  renderResult();
  setStatus("result");
});

restoreLastResult();
