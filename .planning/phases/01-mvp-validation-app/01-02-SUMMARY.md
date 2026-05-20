---
phase: 01-mvp-validation-app
plan: 02
subsystem: ai
tags: [responses-api, structured-output, mock-mode, clarification-flow]
requires:
  - phase: 01-01
    provides: Native one-page UI shell and intake form
provides:
  - Safe server-side /api/analyze boundary
  - Structured advisory result schema and validation
  - Prompt guardrails for grounded advisory output
  - Deterministic mock fallback for demos and offline use
  - Inline clarification flow connected to the frontend
affects: [phase-01, ai, api, frontend]
tech-stack:
  added: [node-http, fetch-responses-api]
  patterns: [server-side-ai-adapter, discriminated-advisor-result, deterministic-mock-fallback]
key-files:
  created: [server/index.js, server/ai/advisorClient.js, server/ai/mockAdvisor.js, server/ai/prompts.js, server/ai/schemas.js]
  modified: [src/app.js]
key-decisions:
  - "Used a server-side Responses API adapter through fetch so the MVP has no install-time dependency during this phase."
  - "Defaulted to mock mode unless MOCK_AI=false and OPENAI_API_KEY is present, keeping demos reliable and API keys server-only."
patterns-established:
  - "All advisory outputs pass through shared schema validation before reaching the browser."
  - "Weak input returns clarification questions; final analysis runs after clarification answers are filled."
requirements-completed: [CLAR-01, CLAR-02, CLAR-03, AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07, AI-08, AI-09, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, REL-01, REL-02, REL-03]
duration: 13 min
completed: 2026-05-20
---

# Phase 01 Plan 02: AI Adapter, Schema, Clarification, and Mock Fallback Summary

**Server-side advisory endpoint with structured result validation, prompt guardrails, clarification routing, and deterministic mock fallback**

## Performance

- **Duration:** 13 min
- **Started:** 2026-05-20T21:42:05Z
- **Completed:** 2026-05-20T21:55:00Z
- **Tasks:** 5
- **Files modified:** 6

## Accomplishments

- Added a minimal Node server that serves the native app and exposes `POST /api/analyze`.
- Added the shared result schema and runtime validation for clarification and final result modes.
- Added the advisory prompt with all five roles and SPEC restrictions.
- Added mock fallback that returns clarification for weak input and final verdicts for stronger input.
- Connected the frontend to `/api/analyze`, including inline clarification fields and automatic final analysis.

## Task Commits

Plan tasks were implemented in one scoped production commit:

1. **Tasks 1-5: API endpoint, schema, prompt, mock fallback, and frontend connection** - `f79b470` (feat)

**Plan metadata:** committed separately with this summary.

## Files Created/Modified

- `server/index.js` - Serves static app files and handles `/api/analyze`.
- `server/ai/advisorClient.js` - Isolates live Responses API calls and mock fallback.
- `server/ai/mockAdvisor.js` - Provides deterministic demo behavior.
- `server/ai/prompts.js` - Defines role, grounding, and restriction prompt rules.
- `server/ai/schemas.js` - Defines JSON schema, runtime validation, and forbidden-claim detection.
- `src/app.js` - Submits analysis requests and manages clarification flow.

## Decisions Made

- Used direct HTTPS `fetch` for the Responses API instead of adding an SDK dependency before dependency installation is needed.
- Kept mock mode as the default unless explicitly disabled with `MOCK_AI=false`.
- Returned safe generic errors from the API boundary without exposing API keys or internals.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None for mock/demo mode. Live OpenAI mode requires `OPENAI_API_KEY`, optional `OPENAI_MODEL`, and `MOCK_AI=false`.

## Verification

- `node --check server\index.js` - PASS
- `node --check server\ai\schemas.js` - PASS
- `node --check server\ai\prompts.js` - PASS
- `node --check server\ai\mockAdvisor.js` - PASS
- `node --check server\ai\advisorClient.js` - PASS
- `node --check src\app.js` - PASS
- Mock API smoke test: weak input returned `clarification_needed` with 3 questions - PASS
- Mock API smoke test: strong input returned `final_result`, `BUILD`, and 5 role analyses - PASS
- `rg -n "OPENAI_API_KEY|Bearer|apiKey|authorization" src package.json` - PASS, no browser/client matches

## Self-Check: PASSED

Plan 01-02 success criteria are met: `/api/analyze` exists, structured schema is the output contract, clarification flow works end to end in mock mode, demo fallback works, and unsupported research/guarantee claims are guarded.

## Next Phase Readiness

Ready for Plan 01-03: final result rendering, Markdown export, and eval checks.

---
*Phase: 01-mvp-validation-app*
*Completed: 2026-05-20*
