# Testing Strategy

## Test pyramid

| Layer         | Scope                                                           | Tool               | Gate       |
| ------------- | --------------------------------------------------------------- | ------------------ | ---------- |
| Unit          | Pure pressure, accessibility, impact, and packet invariants     | Vitest             | Every push |
| Integration   | Compile → validate → compare → approve use case with fake ports | Vitest             | Every push |
| Component     | Decision controls, error states, evidence semantics             | Testing Library    | Every push |
| Accessibility | axe-core plus semantic assertions                               | Vitest + axe-core  | Every push |
| End-to-end    | Keyboard-complete critical path and route smoke tests           | Playwright         | CI         |
| Performance   | Compressed JS/CSS budgets and chunk count                       | Node budget script | Every push |
| Security      | Schema abuse cases and dependency advisories                    | Vitest + npm audit | Every push |

## Coverage policy

Coverage is evidence, not the goal. The configured gate requires at least:

- 80% lines;
- 80% functions;
- 75% branches;
- 80% statements.

The latest local report exceeds the evaluation target: **99.33% lines, 98.75% statements, 97.22% functions, and 97.74% branches**. It contains **66 Vitest checks across 15 files plus 11 Playwright checks**. Counts are regenerated into `public/quality/latest.json`; remote CI status is reported independently from local evidence.

Pure safety-critical domain services are expected to exceed the repository threshold. Presentation pages with static evidence content are excluded from percentage calculations but still receive route smoke and accessibility coverage.

## High-value properties

- Accessibility veto always outranks aggregate throughput gains.
- Sustainability never overrides safety.
- A packet with a missing owner, fallback, evidence reference, or deadline is rejected.
- Stale transport evidence prevents high confidence.
- Relay cannot occur before an explicit human approval event.
- Model-supplied evidence identifiers must exist in the grounded context.
- Replay and live provenance cannot be confused.

## Commands

```bash
npm test                 # all Vitest suites
npm run test:coverage    # suite + coverage thresholds
npm run test:e2e         # Playwright critical path
npm run test:performance # requires a production build in dist/
npm run lighthouse       # 96/98/98/95 score gates and CLS <0.1
npm run quality:report    # regenerate visible machine-readable evidence
npm run quality           # complete local/CI quality gate
```

## Browser and boundary coverage

Playwright verifies Replay mode, incomplete-approval rejection, keyboard flow, mobile reflow, evidence navigation, Gemini unavailability, request validation, request-size enforcement, rate limiting, missing server credentials, and the final audit receipt.

## Test-data policy

All included incident data is synthetic and intentionally contains no person-level information. Fixtures are immutable. Times are ISO 8601 strings; modeled values carry units and provenance.

## CI evidence

The workflow uploads coverage and Playwright reports even when a test fails. The in-product `/testing` route reports the last verified repository snapshot and labels deployment-only checks honestly.
