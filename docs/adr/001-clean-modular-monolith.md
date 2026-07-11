# ADR-001: Use a clean modular monolith

- Status: Accepted
- Date: 2026-07-11

## Context

The product needs explicit domain, application, provider, and presentation boundaries, but does not yet have independent service scaling or ownership needs.

## Decision

Use one deployable web application and one serverless provider gateway with inward-pointing TypeScript module boundaries.

## Consequences

The repository is easy to run and inspect. Ports preserve a path to split ingestion, generation, or audit services when measured load justifies it. We avoid premature distributed-system failure modes.
