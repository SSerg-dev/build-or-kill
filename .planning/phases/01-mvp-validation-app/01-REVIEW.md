---
status: issues_found
phase: 01-mvp-validation-app
depth: standard
files_reviewed: 11
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
created: 2026-05-20
---

# Code Review: Phase 01 MVP Validation App

## Scope

Reviewed source files changed in Phase 1:

- `package.json`
- `src/index.html`
- `src/styles.css`
- `src/app.js`
- `src/export/markdownExport.js`
- `server/index.js`
- `server/ai/advisorClient.js`
- `server/ai/mockAdvisor.js`
- `server/ai/prompts.js`
- `server/ai/schemas.js`
- `server/ai/contractChecks.js`

## Findings

### WR-01: Static file path guard can allow sibling-prefix traversal

**Severity:** Warning  
**File:** `server/index.js`  
**Lines:** 68-80  

`serveStatic()` builds a normalized path and checks `filePath.startsWith(publicRoot)`. This is not a reliable containment check because sibling paths with the same prefix can pass string-prefix validation, for example a path resolving beside `src` whose absolute path starts with the same characters as the `src` directory. If such a sibling file exists, the static server may read outside the intended public root.

Use `resolve(publicRoot, "." + url.pathname)` or equivalent, then compare `relative(publicRoot, filePath)` and reject paths that start with `..`, are absolute, or equal an invalid traversal. Also prefer decoding and normalizing URL paths through a single safe helper.

### WR-02: Invalid JSON and oversized request bodies become generic 500 responses

**Severity:** Warning  
**File:** `server/index.js`  
**Lines:** 17-31, 39-40, 91-108  

`readJsonBody()` rejects on malformed JSON or oversized bodies, but the top-level server catch maps every thrown error to `500 Unexpected server error`. These are client input errors and should return `400 Invalid JSON` or `413 Request body too large`. The current behavior makes basic error handling less accurate and can make client-side diagnostics misleading during demos.

Handle parse/body-size errors inside `handleAnalyze()` or use custom error types/status codes from `readJsonBody()`.

### WR-03: Live OpenAI failures are silently replaced by mock output

**Severity:** Warning  
**File:** `server/ai/advisorClient.js`  
**Lines:** 16-20, 99-113  

When `MOCK_AI=false` and a live OpenAI request fails, the adapter catches every error and returns mock output with no signal to the caller. That makes demos resilient, but it also hides live integration failures and can make users believe they saw a real AI result. The same issue applies after schema/forbidden-claim failures because `checkedResult()` can produce an error object that is later sent with HTTP 200 by `server/index.js`.

Return metadata such as `source: "mock_fallback"` or use a non-200 error for live-mode failures when mock fallback is disabled. At minimum, distinguish intentional demo fallback from unexpected live failure so the UI can show a clear notice.

## Positive Notes

- Browser rendering escapes AI-provided strings before inserting HTML.
- The API key is not referenced from browser assets.
- Mock contract checks cover strong, weak, ambiguous, unrealistic, and adversarial fixture categories.
- The result renderer validates final-result shape before rendering a success state.

## Verification Run

- `npm run check` - PASS, 5 mock contract fixtures.

## Recommendation

Fix the warning findings before shipping beyond local demo. The static path containment issue is the highest priority because it affects the server boundary.
