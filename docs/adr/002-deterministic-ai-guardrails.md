# ADR-002: Treat generated plans as untrusted proposals

- Status: Accepted
- Date: 2026-07-11

## Context

Stadium crowd, accessibility, and transport decisions are safety-relevant. An LLM is useful for synthesis but unsuitable as the source of capacity truth or autonomous authority.

## Decision

Use Gemini for structured synthesis behind a provider port. Validate the schema, evidence references, capacities, accessibility floor, freshness, action completeness, and approval state with deterministic code.

## Consequences

The system can explain and reject attractive but unsafe proposals. Generation remains useful without becoming the safety kernel. Additional implementation and test work is accepted as necessary risk control.
