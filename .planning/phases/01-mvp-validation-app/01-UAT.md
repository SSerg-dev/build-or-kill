---
status: testing
phase: 01-mvp-validation-app
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md]
started: 2026-05-20T21:55:32Z
updated: 2026-05-20T23:21:25Z
---

## Current Test

number: 4
name: Weak Input Clarification
expected: |
  Submitting weak or generic input keeps the user on the same page and renders 2-3 clarification questions inline below the form, with no final verdict yet.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Start the application from scratch in mock/demo mode. The server boots without errors, the homepage loads, and a basic analysis request can return live JSON.
result: pass

### 2. First Screen And Intake Form
expected: Opening the app shows a short validation-focused explanation and an immediately usable form with optional idea name, required product description, required target audience, required main pain/problem, and optional notes.
result: pass

### 3. Required Field Validation
expected: Submitting the form with missing required fields does not run analysis and shows inline validation listing the missing fields.
result: pass

### 4. Weak Input Clarification
expected: Submitting weak or generic input keeps the user on the same page and renders 2-3 clarification questions inline below the form, with no final verdict yet.
result: [pending]

### 5. Clarification Auto Final Analysis
expected: Each clarification question has its own short text field. When every answer is filled, the app automatically runs final analysis; empty answers block final analysis with inline validation.
result: [pending]

### 6. Strong Input Final Result
expected: Submitting a strong idea shows a final result that starts with a dominant BUILD, PIVOT, or KILL verdict block, confidence score, verdict reason, and advisory disclaimer.
result: [pending]

### 7. Role Cards And Section Order
expected: The final result shows all five role cards, then sections in this exact order: Key Strengths, Key Risks, MVP Scope, Validation Experiments, Recommended Next Actions.
result: [pending]

### 8. Stale Result And Local Restore
expected: After a result exists, editing any form input keeps the old result visible and marks it stale. Refreshing the page restores only the last local result, not a history or dashboard.
result: [pending]

### 9. Markdown Export
expected: Clicking Export Markdown creates a Markdown result containing verdict, confidence score, verdict reason, role analyses, key strengths, key risks, MVP scope, validation experiments, recommended next actions, and advisory disclaimer.
result: [pending]

### 10. Mock Contract Checks
expected: Running npm run check passes the mock fixture contract checks for strong, weak, unrealistic, ambiguous, and adversarial inputs.
result: [pending]

### 11. Excluded Feature Boundary
expected: The MVP does not expose authentication, payments, team accounts, admin panels, complex dashboards, scraping, multi-language support, or generic chatbot behavior.
result: [pending]

## Summary

total: 11
passed: 3
issues: 0
pending: 8
skipped: 0
blocked: 0

## Gaps

[none yet]
