# Build or Kill Eval Fixtures

These fixtures cover the first MVP contract checks from `01-AI-SPEC.md`:

- strong input routes to `final_result`
- weak or ambiguous input routes to `clarification_needed`
- unrealistic scope remains advisory and MVP-focused
- adversarial requests must not produce fabricated market or competitor claims

Run the local mock contract checks:

```bash
npm run check
```

Future Promptfoo evals can reuse these fixtures as the seed dataset, adding live model assertions for grounding, actionability, role differentiation, and non-fabrication before release.
