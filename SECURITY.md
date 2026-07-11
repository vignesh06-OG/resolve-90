# Security and Responsible AI

## Security posture

Resolve 90 follows OWASP ASVS-inspired controls for a public decision-support interface. It is a prototype, not a certified emergency-control system. The highest-risk architectural decision is explicit: **the model may propose; deterministic rules and an accountable human decide.**

## Threat model

| Asset               | Threat                                   | Control                                                                                           | Residual risk                                                          |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Provider credential | Secret extraction from browser/bundle    | `GEMINI_API_KEY` exists only in server environment; client calls same-origin gateway              | Host administrators can access runtime secrets                         |
| Decision integrity  | Prompt injection in incoming signal text | Bounded typed fields, length limits, instruction/data separation, policy allowlist, output schema | Novel indirect injection requires ongoing red-team tests               |
| Crowd safety        | Hallucinated capacity or route facts     | Model cannot create evidence IDs; deterministic thresholds and route graph check output           | Source data itself may be wrong/stale                                  |
| Accessibility       | Optimization sacrifices disabled fans    | Accessibility is a hard constraint/veto, not a weighted preference                                | Venue configuration may omit a real-world barrier                      |
| API availability    | Generation spam / cost abuse             | Same-origin policy, body limit, per-instance token bucket, timeout, no raw proxy                  | Production needs a distributed limiter and authenticated operator role |
| Operator browser    | XSS via model/user content               | React text escaping, no `dangerouslySetInnerHTML`, strict CSP, typed rendering                    | Browser extensions remain outside control                              |
| Audit evidence      | Approval repudiation/tampering           | Correlation IDs and append-only audit port contract; production path calls for signed storage     | Demo uses browser-local evidence only                                  |
| Personal privacy    | Fan surveillance                         | Aggregated counts only; no biometrics, device IDs, or individual profiles                         | Upstream systems must enforce the same policy                          |
| Cross-tenant data   | Venue data leakage                       | Venue IDs in port contracts; production requires tenant authorization                             | Demo is single-venue and has no auth system                            |

## Implemented controls

- Strict schema validation at external boundaries.
- 32 KiB request-body limit and bounded string/array schemas.
- Server-side provider secret and model allowlist.
- Request timeout and generic external error responses.
- Rate-limit response with `Retry-After`.
- Explicit allowed-origin check.
- Security headers: CSP, HSTS, frame denial, nosniff, strict referrer policy, permissions policy, cross-origin opener/resource isolation, DNS-prefetch denial, and cross-domain policy denial.
- React rendering without HTML injection.
- No local storage of personal data.
- Correlation ID returned without leaking provider internals.
- High-risk approval state machine and visible replay/live mode.
- Machine-readable dependency audit in `reports/security-audit.json`; current total advisories: **0**.
- Playwright boundary checks cover unsupported methods, malformed input, body limits, rate limiting, missing credentials, and provider unavailability.
- `npm audit --audit-level=high` in CI.
- Dependabot weekly dependency updates.
- `scripts/verify-response-headers.mjs` verifies ten controls against a supplied HTTPS deployment URL: CSP, HSTS, Permissions Policy, frame protection, nosniff, Referrer Policy, COOP, CORP, DNS-prefetch denial, and cross-domain policy denial.

## Content Security Policy

Production headers allow resources from the same origin, data-URI images for embedded assets, same-origin API connections, and no plugins/frames. No inline runtime scripts are required by the application build.

## Rate limiting

The included gateway limiter is intentionally small and per-instance, suitable for abuse resistance in a single warm function. A production multi-region deployment must replace it with a durable provider (for example, a managed Redis-compatible token bucket) keyed by authenticated operator and venue—not raw IP alone.

## Data lifecycle

The demo contains synthetic aggregate data. Production guidance:

- raw sensor events: minimum operational retention;
- decision packets: policy-defined incident retention;
- approval receipts: immutable, access-controlled audit retention;
- generated text: same classification as source incident;
- no model training on venue data without an explicit data-processing agreement.

## Vulnerability reporting

Do not open a public issue for a suspected vulnerability. Follow the private reporting guidance in [CONTRIBUTING.md](CONTRIBUTING.md). Never include credentials, sensitive venue layouts, or exploit payloads in a report.

## Known limitations

- Authentication and role-based authorization are adapter contracts, not implemented in the public single-venue demo.
- The bundled limiter is not distributed.
- Browser-rendered audit history is demonstration evidence, not a signed system of record.
- Security headers require the provided host configuration; the Vite development server is not production hardening.
- No public deployment URL or credential is available in the current workspace, so hosted response-header verification remains explicitly unverified.
