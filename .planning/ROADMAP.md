# Roadmap: Build or Kill

## Overview

Build the MVP validation workflow for Build or Kill: users submit a SaaS idea, the system validates input, asks clarification questions when needed, generates a structured AI advisory result, and exports the result to Markdown.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions marked with INSERTED

- [ ] **Phase 1: MVP Validation App** - Build the complete lightweight idea validation workflow from intake through Markdown export.

## Phase Details

### Phase 1: MVP Validation App

**Goal**: Users can submit a SaaS idea and receive a structured advisory BUILD / PIVOT / KILL result with role analysis, risks, MVP scope, validation experiments, next actions, and Markdown export.
**Depends on**: Nothing (first phase)
**Requirements**: INTAKE-01, INTAKE-02, INTAKE-03, INTAKE-04, INTAKE-05, CLAR-01, CLAR-02, CLAR-03, AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07, AI-08, AI-09, QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, UI-01, UI-02, UI-03, UI-04, REL-01, REL-02, REL-03, REL-04
**Canonical refs**: docs/specs/SPEC.md
**Success Criteria** (what must be TRUE):

  1. User can submit an idea with required fields validated.
  2. Weak input triggers 2-3 clarification questions instead of a final verdict.
  3. Result includes exactly one verdict: BUILD, PIVOT, or KILL.
  4. Result includes confidence score, all five AI role analyses, strengths, risks, MVP scope, validation experiments, and recommended next actions.
  5. Markdown export contains all result sections.
  6. Mock/demo fallback mode and basic error handling work.

**Plans**: 3 plans

Plans:
**Wave 1**

- [x] 01-01: Native one-page UI shell

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02: AI adapter, schema, clarification, and mock fallback

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-03: Result rendering, Markdown export, and eval checks

## Progress

**Execution Order:**
Phases execute in numeric order.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. MVP Validation App | 1/3 | In Progress | - |
