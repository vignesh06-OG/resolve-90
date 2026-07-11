import { describe, expect, it } from "vitest";

import type { DecisionProvider } from "../../src/application/ports/DecisionProvider";
import type { IncidentRepository } from "../../src/application/ports/IncidentRepository";
import { createApproveCompiledDecision } from "../../src/application/use-cases/approveCompiledDecision";
import { createCompileIncident } from "../../src/application/use-cases/compileIncident";
import { ReplayDecisionProvider } from "../../src/infrastructure/ai/ReplayDecisionProvider";
import { InMemoryAuditPort } from "../../src/infrastructure/repositories/InMemoryAuditPort";
import { ReplayIncidentRepository } from "../../src/infrastructure/repositories/ReplayIncidentRepository";
import { EAST_CONCOURSE_INCIDENT } from "../../src/infrastructure/repositories/replayScenario";
import { failure, success } from "../../src/shared/types/result";
import { buildCandidate } from "../fixtures/builders";

const clock = { now: () => "2026-06-19T18:42:36.000Z" };
const ids = {
  next: (prefix: "audit" | "decision") => `${prefix}-stable`,
};

describe("decision workflow", () => {
  it("compiles provider candidates, challenges them, and selects the safe plan", async () => {
    const compile = createCompileIncident({
      incidents: new ReplayIncidentRepository(),
      provider: new ReplayDecisionProvider(),
      clock,
      ids,
    });

    const result = await compile.execute(EAST_CONCOURSE_INCIDENT.id);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.selected.id).toBe("plan-protected-pulse");
      expect(result.value.selected.score).toBeGreaterThanOrEqual(90);
      expect(result.value.selected.checks).toContainEqual(
        expect.objectContaining({
          id: "transport-freshness",
          status: "warn",
        }),
      );
      expect(result.value.alternatives).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "plan-close-east",
            disposition: "rejected",
          }),
          expect.objectContaining({
            id: "plan-broadcast-only",
            disposition: "rejected",
          }),
        ]),
      );
      expect(result.value.receipt.mode).toBe("replay");
    }
  });

  it("returns a typed not-found error", async () => {
    const compile = createCompileIncident({
      incidents: new ReplayIncidentRepository(),
      provider: new ReplayDecisionProvider(),
      clock,
      ids,
    });

    await expect(compile.execute("missing")).resolves.toMatchObject({
      ok: false,
      error: { code: "INCIDENT_NOT_FOUND" },
    });
  });

  it("does not blur a provider outage into an unsafe fallback", async () => {
    const unavailableProvider: DecisionProvider = {
      generate: () =>
        Promise.resolve(
          failure({
            code: "PROVIDER_UNAVAILABLE",
            message: "Provider unavailable.",
          }),
        ),
    };
    const compile = createCompileIncident({
      incidents: new ReplayIncidentRepository(),
      provider: unavailableProvider,
      clock,
      ids,
    });

    await expect(
      compile.execute(EAST_CONCOURSE_INCIDENT.id),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "PROVIDER_FAILURE" },
    });
  });

  it("rejects a generation response when every candidate is unsafe", async () => {
    const incidents: IncidentRepository = {
      findById: () => Promise.resolve(EAST_CONCOURSE_INCIDENT),
    };
    const provider: DecisionProvider = {
      generate: () =>
        Promise.resolve(
          success({
            candidates: [
              buildCandidate({
                impact: {
                  ...buildCandidate().impact,
                  peakPressureRatio: 1.3,
                },
              }),
            ],
            receipt: {
              mode: "replay",
              provider: "Unsafe fixture",
              model: "test",
              promptVersion: "test-v1",
              generatedAt: "2026-06-19T18:42:35.000Z",
              note: "Test only",
            },
          }),
        ),
    };
    const compile = createCompileIncident({
      incidents,
      provider,
      clock,
      ids,
    });

    await expect(
      compile.execute(EAST_CONCOURSE_INCIDENT.id),
    ).resolves.toMatchObject({
      ok: false,
      error: { code: "NO_SAFE_PLAN" },
    });
  });

  it("persists the approval receipt before returning a relay-ready decision", async () => {
    const audit = new InMemoryAuditPort();
    const compile = createCompileIncident({
      incidents: new ReplayIncidentRepository(),
      provider: new ReplayDecisionProvider(),
      clock,
      ids,
    });
    const compiled = await compile.execute(EAST_CONCOURSE_INCIDENT.id);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const approve = createApproveCompiledDecision({ audit, clock, ids });
    const approved = await approve.execute(compiled.value, {
      understandsModeledImpact: true,
      reviewedAccessibility: true,
    });

    expect(approved.ok).toBe(true);
    expect(audit.events).toHaveLength(1);
    expect(audit.events[0]?.decisionId).toBe(compiled.value.id);
  });
});
