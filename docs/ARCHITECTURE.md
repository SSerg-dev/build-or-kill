# Architecture: Build or Kill

## Purpose

Build or Kill is a lightweight MVP validation app. A user submits a SaaS idea, the app validates required fields, asks clarification questions for weak input, and returns a structured BUILD / PIVOT / KILL advisory result.

The system is intentionally small: native browser UI, a minimal Node server, a server-side AI adapter, deterministic mock mode, and local-only result persistence.

## Runtime Components

### Browser UI

Files:
- `src/index.html`
- `src/styles.css`
- `src/app.js`
- `src/export/markdownExport.js`

Responsibilities:
- Render the one-page validation flow.
- Validate required intake fields before API calls.
- Render clarification questions inline.
- Render final results verdict-first.
- Export final results to Markdown.
- Store only the last result snapshot in `localStorage`.
- Mark restored or edited-result output as stale.

The browser never receives `OPENAI_API_KEY`.

### Node Server

File:
- `server/index.js`

Responsibilities:
- Serve static files from `src/`.
- Expose `POST /api/analyze`.
- Validate request input.
- Keep AI provider access server-side.
- Return JSON responses to the browser.

Default port is `5173`. It can be overridden with `PORT`.

### AI Adapter

Files:
- `server/ai/advisorClient.js`
- `server/ai/prompts.js`
- `server/ai/schemas.js`
- `server/ai/mockAdvisor.js`

Responsibilities:
- Isolate OpenAI Responses API usage behind one adapter.
- Define the advisory prompt and output restrictions.
- Validate all advisor outputs against the structured result contract.
- Detect unsupported research or guarantee claims.
- Provide deterministic mock/demo fallback.

Mock mode is used by default unless `MOCK_AI=false` and `OPENAI_API_KEY` is present.

### Eval Checks

Files:
- `evals/fixtures.json`
- `evals/README.md`
- `server/ai/contractChecks.js`

Responsibilities:
- Verify mock routing for strong, weak, unrealistic, ambiguous, and adversarial inputs.
- Check schema validity.
- Check forbidden-claim guardrails.

Run with:

```bash
npm run check
```

## Main Data Flow

1. User enters idea details in the browser form.
2. `src/app.js` validates required fields.
3. Browser sends `POST /api/analyze` with structured input.
4. `server/index.js` validates and normalizes input.
5. `advisorClient.js` chooses mock mode or live OpenAI mode.
6. The result is validated by `schemas.js`.
7. Browser receives either:
   - `clarification_needed`
   - `final_result`
8. Browser renders clarification fields or final result.
9. Final result can be exported to Markdown.
10. Last result and input snapshot are saved in `localStorage`.

## Result Contract

The result has two modes:

- `clarification_needed`: includes 2-3 questions and no verdict.
- `final_result`: includes exactly one verdict, confidence score, verdict reason, five role analyses, strengths, risks, MVP scope, validation experiments, next actions, and advisory disclaimer.

The five required roles are:
- Product Strategist
- CTO
- Growth Marketer
- Skeptic
- Investor / Business Reviewer

## State Boundaries

Stored locally:
- Last result snapshot.
- Input snapshot used for that result.

Not stored:
- Multi-result history.
- Accounts.
- Server-side history.
- Analytics.
- Dashboard data.

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Optional server port. Defaults to `5173`. |
| `MOCK_AI` | Set to `false` to use live OpenAI mode. Defaults to mock behavior. |
| `OPENAI_API_KEY` | Required for live OpenAI mode. Server-side only. |
| `OPENAI_MODEL` | Optional live model override. |

## Known Review Items

See `.planning/phases/01-mvp-validation-app/01-REVIEW.md` for current review findings:
- Harden static file path containment.
- Return better client errors for invalid JSON and oversized bodies.
- Make live OpenAI fallback state explicit.
