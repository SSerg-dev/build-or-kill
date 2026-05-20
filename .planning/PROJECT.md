# Build or Kill

## What This Is

Build or Kill is an AI advisory board for solo developers, indie hackers, and technical founders with SaaS ideas. It helps users decide whether to build, pivot, or kill an idea before investing significant development time.

## Core Value

Help users answer "Should I build this idea at all?" through fast, structured MVP validation.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Users can submit startup or SaaS ideas with required validation fields.
- [ ] Weak or incomplete input triggers clarification questions before a verdict.
- [ ] Users receive a structured BUILD / PIVOT / KILL advisory result.
- [ ] Users can export the structured result to Markdown.
- [ ] The application supports mock/demo fallback mode for reliability and demos.

### Out of Scope

- Authentication - excluded from MVP.
- Payments - excluded from MVP.
- Team accounts - excluded from MVP.
- Complex dashboards - excluded from MVP.
- Admin panels - excluded from MVP.
- Market scraping and competitor scraping - excluded because output must not pretend to perform real research.
- Multi-language support - excluded from MVP.
- Generic chatbot behavior - excluded because the product must stay validation-focused.

## Context

The source requirements are locked in `docs/specs/SPEC.md`. The MVP must remain fast, lightweight, concise, structured, and focused on validation before implementation.

## Constraints

- **Scope**: MVP validation only - avoid feature overload and premature scaling.
- **AI behavior**: Output must be advisory and based only on provided input.
- **Reliability**: Support safe structured output handling, basic error handling, and mock/demo fallback mode.
- **Exclusions**: Do not add auth, payments, dashboards, scraping, admin systems, team accounts, or generic chatbot behavior.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use `docs/specs/SPEC.md` as the source requirement document | User explicitly selected this file as the only source for bootstrapping planning | - Pending |
| Keep Phase 1 focused on the MVP validation app | The SPEC defines one MVP product surface rather than multiple independent products | - Pending |

---
*Last updated: 2026-05-20 after bootstrapping GSD planning from docs/specs/SPEC.md*
