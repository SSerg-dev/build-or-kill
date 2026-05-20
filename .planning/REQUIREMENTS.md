# Requirements: Build or Kill

**Defined:** 2026-05-20
**Core Value:** Help users answer "Should I build this idea at all?" through fast, structured MVP validation.

## v1 Requirements

### Idea Intake

- [x] **INTAKE-01**: User can submit a startup or SaaS idea.
- [x] **INTAKE-02**: System requires product description.
- [x] **INTAKE-03**: System requires target audience.
- [x] **INTAKE-04**: System requires main pain/problem.
- [x] **INTAKE-05**: System may allow optional idea name and additional notes.

### Clarification

- [x] **CLAR-01**: Weak or incomplete input does not immediately produce a final verdict.
- [x] **CLAR-02**: Weak or incomplete input triggers 2-3 clarification questions.
- [x] **CLAR-03**: After clarification, the system may generate a final verdict.

### AI Advisory Result

- [x] **AI-01**: Result includes exactly one verdict: BUILD, PIVOT, or KILL.
- [x] **AI-02**: Result includes confidence score from 0-100.
- [x] **AI-03**: Result includes verdict reason.
- [x] **AI-04**: Result includes all five role analyses: Product Strategist, CTO, Growth Marketer, Skeptic, and Investor / Business Reviewer.
- [x] **AI-05**: Result includes key strengths.
- [x] **AI-06**: Result includes key risks.
- [x] **AI-07**: Result includes MVP scope.
- [x] **AI-08**: Result includes validation experiments.
- [x] **AI-09**: Result includes recommended next actions.

### Quality And Safety

- [x] **QUAL-01**: Result is specific, actionable, concise, structured, and non-generic.
- [x] **QUAL-02**: Result is based only on provided input.
- [x] **QUAL-03**: AI does not guarantee business success.
- [x] **QUAL-04**: AI does not invent market data or pretend to perform competitor research.
- [x] **QUAL-05**: AI output remains advisory and does not replace real customer validation.

### MVP Interface

- [x] **UI-01**: Landing section explains the product with validation-focused messaging.
- [x] **UI-02**: Product form contains optional idea name, product description, target audience, main pain/problem, and optional notes.
- [ ] **UI-03**: Result UI includes loading state, role cards, final verdict, confidence score, MVP recommendations, risks, and validation recommendations.
- [ ] **UI-04**: User can export results to Markdown.

### Reliability

- [x] **REL-01**: Application has basic error handling.
- [x] **REL-02**: Application handles structured AI output safely.
- [x] **REL-03**: Application supports mock/demo fallback mode.
- [x] **REL-04**: Application feels fast, responsive, and lightweight.

## v2 Requirements

(None defined in the source SPEC.)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Authentication | Excluded from MVP |
| Payments | Excluded from MVP |
| Team accounts | Excluded from MVP |
| Complex dashboards | Excluded from MVP |
| Admin panels | Excluded from MVP |
| Market scraping | Excluded from MVP and conflicts with output restrictions |
| Competitor scraping | Excluded from MVP and conflicts with output restrictions |
| Multi-language support | Excluded from MVP |
| Generic chatbot behavior | Anti-feature; product must stay structured and validation-focused |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INTAKE-01 | Phase 1 | Complete |
| INTAKE-02 | Phase 1 | Complete |
| INTAKE-03 | Phase 1 | Complete |
| INTAKE-04 | Phase 1 | Complete |
| INTAKE-05 | Phase 1 | Complete |
| CLAR-01 | Phase 1 | Complete |
| CLAR-02 | Phase 1 | Complete |
| CLAR-03 | Phase 1 | Complete |
| AI-01 | Phase 1 | Complete |
| AI-02 | Phase 1 | Complete |
| AI-03 | Phase 1 | Complete |
| AI-04 | Phase 1 | Complete |
| AI-05 | Phase 1 | Complete |
| AI-06 | Phase 1 | Complete |
| AI-07 | Phase 1 | Complete |
| AI-08 | Phase 1 | Complete |
| AI-09 | Phase 1 | Complete |
| QUAL-01 | Phase 1 | Complete |
| QUAL-02 | Phase 1 | Complete |
| QUAL-03 | Phase 1 | Complete |
| QUAL-04 | Phase 1 | Complete |
| QUAL-05 | Phase 1 | Complete |
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 1 | Pending |
| UI-04 | Phase 1 | Pending |
| REL-01 | Phase 1 | Complete |
| REL-02 | Phase 1 | Complete |
| REL-03 | Phase 1 | Complete |
| REL-04 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2026-05-20*
*Last updated: 2026-05-20 after bootstrapping from docs/specs/SPEC.md*
