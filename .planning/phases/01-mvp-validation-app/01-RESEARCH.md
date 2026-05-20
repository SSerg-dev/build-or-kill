# Phase 1: MVP Validation App - Research

**Status:** Complete
**Source docs:** `docs/specs/SPEC.md`, `.planning/phases/01-mvp-validation-app/01-CONTEXT.md`, `.planning/phases/01-mvp-validation-app/01-AI-SPEC.md`

## Summary

Phase 1 should be implemented as a small vertical MVP, not as a framework-heavy frontend app. The UI decision is native HTML/CSS/JavaScript. The AI decision is OpenAI Responses API with Structured Outputs JSON schema. Because OpenAI API keys must not be exposed in browser code, the native frontend still needs a minimal server-side endpoint for live AI calls.

## Recommended Implementation Shape

- Static one-page UI in `src/index.html`, `src/styles.css`, and `src/app.js`.
- Minimal Node server in `server/index.js` to serve static files and expose `/api/analyze`.
- AI adapter files under `src/ai/` or `server/ai/` for schema, prompt, OpenAI client, and mock fallback.
- Markdown export helper under `src/export/`.
- Lightweight npm scripts for `dev`, `start`, and checks.

## Key Constraints

- Do not use Angular in Phase 1.
- Do not create auth, payments, accounts, dashboards, admin panels, scraping, or generic chatbot behavior.
- Do not call OpenAI directly from browser code.
- Do not invent market data or competitor research.
- Preserve one-page flow, inline clarification, stale result marking, localStorage last-result persistence, verdict-first result layout, compact role cards, and brief scannable output.

## Implementation Risks

1. Browser API key exposure if OpenAI is called directly from frontend code.
2. Schema drift between mock output, live output, renderer, and Markdown export.
3. Weak input flow accidentally producing final verdicts instead of clarification questions.
4. Result rendering becoming too verbose or business-plan-like.
5. LocalStorage turning into full history/dashboard behavior.

## Plan Split

- `01-01-PLAN.md`: Native one-page UI shell, validation, state, localStorage.
- `01-02-PLAN.md`: AI schema, prompt, OpenAI server endpoint, mock fallback.
- `01-03-PLAN.md`: Result rendering, Markdown export, eval fixtures, final verification.

## Research Complete

The plan should proceed with a lightweight native web app plus minimal server adapter.
