# Phase 1: MVP Validation App - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the complete lightweight Build or Kill MVP validation workflow: users submit a SaaS idea, required fields are validated, weak input triggers clarification questions, the system produces a structured advisory BUILD / PIVOT / KILL result, and the result can be exported to Markdown.

</domain>

<decisions>
## Implementation Decisions

### User Flow Shape
- **D-01:** Use a one-page flow. The form, clarification questions, loading state, and result all live in one continuous interface.
- **D-02:** After analysis, keep the form visible above the result so users can see and edit the original input.
- **D-03:** If the user edits input after receiving a result, keep the old result visible but mark it stale.
- **D-04:** Use `localStorage` only for local preservation of the old/last result. Do not expand this into account storage, dashboard behavior, or a full result history feature.
- **D-05:** On first load, show a short validation-focused explanation above an immediately available form. Do not build a separate marketing landing page.

### Clarification Behavior
- **D-06:** When input is weak or incomplete, show 2-3 clarification questions inline below the form.
- **D-07:** Each clarification question gets its own short text field.
- **D-08:** After all clarification answers are filled, immediately run the final analysis using those answers as additional context.
- **D-09:** If any clarification answer is empty, do not run analysis. Show inline validation.

### Result Presentation
- **D-10:** Put a dominant verdict block at the top of the result with BUILD / PIVOT / KILL, confidence score, and a short verdict reason.
- **D-11:** Show the five AI role analyses as compact role cards below the verdict block. Each card includes role name, a short focus/insight, and 2-4 bullets.
- **D-12:** Order the remaining result sections as Key Strengths, Key Risks, MVP Scope, Validation Experiments, and Recommended Next Actions.
- **D-13:** Keep result text brief and scannable with short sections and bullets. Avoid long report-style prose.

### UI Stack
- **D-14:** Build the MVP UI with native HTML, CSS, and JavaScript. Do not use Angular for Phase 1.
- **D-15:** Keep the UI implementation lightweight and framework-free unless a later phase adds routing, accounts, dashboards, or long-lived frontend complexity.

### the agent's Discretion
No areas were delegated to the agent. User selected explicit choices for each discussed decision.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Requirements
- `docs/specs/SPEC.md` — Source requirements for Build or Kill, including MVP scope, input/output rules, AI restrictions, acceptance criteria, and excluded features.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None found. The `src` directory is currently empty.

### Established Patterns
- No application code patterns exist yet.

### Integration Points
- New implementation will be the first app surface and should follow the locked requirements in `docs/specs/SPEC.md`.

</code_context>

<specifics>
## Specific Ideas

- The MVP should optimize for fast validation and live demo clarity.
- The first screen should prioritize immediate idea entry over marketing content.
- Result persistence is local-only via `localStorage` and must not become a dashboard or analytics/history system.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 1-MVP Validation App*
*Context gathered: 2026-05-20*
