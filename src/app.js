import { resultToMarkdown } from "./export/markdownExport.js";

const STORAGE_KEY = "build-or-kill:last-result";
const THEME_KEY = "build-or-kill:theme";

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
    if (!isRenderableFinalResult(state.lastResult)) {
      showError("The analysis result was incomplete and cannot be rendered.");
      return;
    }
    resultContent.innerHTML = finalResultHtml(state.lastResult);
  } else {
    resultContent.innerHTML = `
      <p class="placeholder-result">${escapeHtml(state.lastResult.summary || "Previous validation result restored locally.")}</p>
    `;
  }
  resultPanel.hidden = false;
  staleBadge.hidden = !state.stale;
}

function finalResultHtml(result) {
  const sections = [
    ["Key Strengths", result.key_strengths],
    ["Key Risks", result.key_risks],
    ["MVP Scope", result.mvp_scope],
    ["Validation Experiments", result.validation_experiments],
    ["Recommended Next Actions", result.recommended_next_actions]
  ];

  return `
    <article class="final-result">
      <section class="verdict-block verdict-${escapeHtml(result.verdict.toLowerCase())}" aria-label="Verdict">
        <div>
          <p class="verdict-label">Verdict</p>
          <h3>${escapeHtml(result.verdict)}</h3>
        </div>
        <div class="confidence-score">
          <span>${escapeHtml(result.confidence_score)}</span>
          <small>/100 confidence</small>
        </div>
        <p class="verdict-reason">${escapeHtml(result.verdict_reason)}</p>
        <p class="advisory-disclaimer">${escapeHtml(result.advisory_disclaimer)}</p>
      </section>

      <section class="role-grid" aria-label="Role analyses">
        ${result.role_analyses.map(roleCardHtml).join("")}
      </section>

      <div class="ordered-sections">
        ${sections.map(([title, items]) => resultSectionHtml(title, items)).join("")}
      </div>

      <button class="secondary-action" type="button" id="export-markdown">Export Markdown</button>
    </article>
  `;
}

function roleCardHtml(role) {
  return `
    <article class="role-card">
      <h3>${escapeHtml(role.role)}</h3>
      <p>${escapeHtml(role.focus)}</p>
      <ul>${role.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
    </article>
  `;
}

function resultSectionHtml(title, items) {
  return `
    <section class="result-section">
      <h3>${escapeHtml(title)}</h3>
      <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function isRenderableFinalResult(result) {
  return ["BUILD", "PIVOT", "KILL"].includes(result.verdict)
    && Number.isInteger(result.confidence_score)
    && Array.isArray(result.role_analyses)
    && result.role_analyses.length === 5
    && ["key_strengths", "key_risks", "mvp_scope", "validation_experiments", "recommended_next_actions"]
      .every((key) => Array.isArray(result[key]) && result[key].length > 0);
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

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const next = isDark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
}

initTheme();

document.querySelector("#theme-toggle").addEventListener("click", toggleTheme);

form.addEventListener("input", markResultStaleIfNeeded);

clarificationQuestions.addEventListener("input", scheduleClarificationSubmit);

resultContent.addEventListener("click", (event) => {
  if (event.target?.id !== "export-markdown" || !state.lastResult) return;
  const markdown = resultToMarkdown(state.lastResult);
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "build-or-kill-result.md";
  link.click();
  URL.revokeObjectURL(url);
});

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
