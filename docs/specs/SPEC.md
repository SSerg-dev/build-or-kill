# SPEC.md — Build or Kill

Status: Requirements v1  
Phase: Requirements  
Next document: DESIGN.md

---

# Product Definition

Build or Kill is an AI advisory board that helps solo developers, indie hackers, and technical founders decide whether to build, pivot, or kill a SaaS idea before investing significant development time.

The product focuses on fast structured validation instead of generic brainstorming.

---

# Primary Goal

Help users answer:

> “Should I build this idea at all?”

before spending time building the wrong product.

---

# Primary User

The MVP is designed for:

- Solo developers
- Indie hackers
- Technical founders with SaaS ideas

---

# Killer Feature

Within 2–3 minutes, the system provides:

- BUILD / PIVOT / KILL verdict
- Confidence score
- Key risks
- MVP scope
- Validation experiments
- Recommended next actions

---

# Core Workflow

```text
User submits idea
        ↓
System validates input
        ↓
AI advisory board analyzes idea
        ↓
System generates structured result
        ↓
User reviews verdict and recommendations
```

---

# AI Expert Roles

## Product Strategist

Focus:
- Problem clarity
- Target audience clarity
- MVP scope

---

## CTO

Focus:
- Technical feasibility
- MVP simplicity
- Technical risks

---

## Growth Marketer

Focus:
- User acquisition
- Positioning
- Validation channels

---

## Skeptic

Focus:
- Weak assumptions
- Failure risks
- Validation gaps

---

## Investor / Business Reviewer

Focus:
- Monetization
- Market attractiveness
- Scalability

---

# Evaluation Principles

The system must use structured reasoning instead of generic brainstorming.

The verdict is advisory, not deterministic.

---

## BUILD

Recommend BUILD when:
- Problem is clear
- Audience is specific
- MVP is realistic
- Validation is possible
- Risks are manageable

---

## PIVOT

Recommend PIVOT when:
- Idea has potential
- Important assumptions are weak
- Positioning is unclear
- MVP scope is too large
- Validation strategy is weak

---

## KILL

Recommend KILL when:
- No clear problem exists
- No clear audience exists
- Scope is unrealistic
- Differentiation is weak
- Validation path is unclear

---

# Confidence Score Rules

The confidence score represents how strongly the AI board supports the verdict based on the provided information.

Range:
- 0–100

The score is NOT a prediction of business success.

---

# Input Validation Requirements

## Required Fields

The system must require:
- Product description
- Target audience
- Main pain/problem

---

## Optional Fields

The system may allow:
- Idea name
- Additional notes

---

## Clarification Rules

If the input is weak or incomplete, the system must not generate a final verdict immediately.

The system must ask 2–3 clarification questions first.

Examples of weak input:
- Missing target audience
- Generic problem description
- Ambiguous idea
- Unrealistic MVP scope

After clarification, the system may generate a final verdict.

---

# Functional Requirements

The system must allow users to:
- Submit startup or SaaS ideas
- Receive BUILD / PIVOT / KILL verdict
- Receive confidence score
- Receive role-based analysis
- Receive MVP recommendations
- Receive risks and validation experiments
- Export results to Markdown

---

# AI Output Requirements

The AI result must contain:
- Verdict
- Confidence score
- Verdict reason
- Role analyses
- Key strengths
- Key risks
- MVP scope
- Validation experiments
- Recommended next actions

---

# Result Quality Requirements

The result must be:
- Specific
- Actionable
- Concise
- Structured
- Non-generic
- Based only on provided input

---

# AI Output Restrictions

The AI must not:
- Guarantee business success
- Invent market data
- Pretend to perform real competitor research
- Produce final verdicts for extremely weak input
- Replace real customer validation

The AI output must remain advisory.

---

# Non-Functional Requirements

The application must:
- Feel fast and responsive
- Remain lightweight
- Support mock/demo mode
- Support live demos
- Produce structured readable output
- Remain focused on MVP validation

---

# MVP Scope

## Required MVP Features

### Landing Section

- Product explanation
- Validation-focused messaging

---

### Product Form

- Idea name (optional)
- Product description
- Target audience
- Main pain/problem
- Optional notes

---

### AI Analysis Result

- Loading state
- AI role cards
- Final verdict
- Confidence score
- MVP recommendations
- Risks
- Validation recommendations

---

### Export

- Markdown export

---

### Reliability

- Basic error handling
- Safe structured output handling
- Demo/mock fallback mode

---

# Features Excluded From MVP

The MVP must NOT include:
- Authentication
- Payments
- Team accounts
- Complex dashboards
- Admin panels
- Market scraping
- Competitor scraping
- Multi-language support
- Generic chatbot behavior

---

# Anti-Features

The product must not become:
- Generic chatbot
- Business plan generator
- Startup CRM
- Project management system
- Analytics platform

The MVP must remain:
- Fast
- Focused
- Lightweight
- Validation-oriented

---

# Success Metrics

The MVP is successful when:
- Users can submit ideas quickly
- Users receive clear verdicts
- Risks are identified clearly
- MVP recommendations are actionable
- Validation experiments are meaningful
- Markdown export works correctly

---

# Measurable Acceptance Criteria

The product is complete when:
- Users can submit ideas
- Required fields are validated
- Weak input triggers clarification questions
- Result includes exactly one verdict:
  - BUILD
  - PIVOT
  - KILL
- Result includes confidence score from 0–100
- Result includes all five AI role analyses
- Result includes strengths and risks
- Result includes MVP scope
- Result includes validation experiments
- Markdown export contains all result sections

---

# Requirements Definition of Done

Requirements phase is complete when:
- Product purpose is defined
- Primary user is defined
- Core workflow is defined
- MVP scope is defined
- Input/output requirements are defined
- AI restrictions are defined
- Acceptance criteria are measurable
- No implementation details remain

---

# Product Philosophy

The workflow should encourage:
- Validation before implementation
- MVP-first thinking
- Small iterative execution
- Structured decision-making

The workflow should discourage:
- Feature overload
- Premature scaling
- Undefined target users
- Overengineered MVPs
- Unvalidated assumptions

---

# Execution Philosophy

```text
Clarify
    ↓
Define constraints
    ↓
Validate assumptions
    ↓
Design MVP
    ↓
Build in small verified steps
```
