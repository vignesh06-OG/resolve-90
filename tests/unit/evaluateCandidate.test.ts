import { describe, expect, it } from "vitest";

import { evaluateCandidate } from "../../src/domain/services/evaluateCandidate";
import { buildCandidate, buildIncident } from "../fixtures/builders";

describe("evaluateCandidate", () => {
  it("accepts a complete, grounded plan inside hard constraints", () => {
    const result = evaluateCandidate(buildCandidate(), buildIncident());

    expect(result.disposition).toBe("eligible");
    expect(result.checks).toHaveLength(5);
    expect(result.checks.every(({ status }) => status !== "fail")).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  it("rejects pressure above the operating envelope", () => {
    const candidate = buildCandidate({
      impact: { ...buildCandidate().impact, peakPressureRatio: 1.02 },
    });

    const result = evaluateCandidate(candidate, buildIncident());

    expect(result.disposition).toBe("rejected");
    expect(result.checks).toContainEqual(
      expect.objectContaining({ id: "safe-pressure", status: "fail" }),
    );
  });

  it("uses accessibility as a veto instead of a weighted preference", () => {
    const candidate = buildCandidate({
      impact: { ...buildCandidate().impact, accessibleRoutePercent: 89 },
    });

    const result = evaluateCandidate(candidate, buildIncident());

    expect(result.disposition).toBe("rejected");
    expect(result.rejectionReason).toContain("accessibility floor");
  });

  it("warns between the accessibility floor and target", () => {
    const candidate = buildCandidate({
      impact: { ...buildCandidate().impact, accessibleRoutePercent: 92 },
    });

    const result = evaluateCandidate(candidate, buildIncident());

    expect(result.disposition).toBe("eligible");
    expect(result.checks).toContainEqual(
      expect.objectContaining({ id: "protected-access", status: "warn" }),
    );
  });

  it("prohibits high confidence when transport evidence is stale", () => {
    const incident = buildIncident({
      evidence: buildIncident().evidence.map((item) =>
        item.id === "ev-transport" ? { ...item, freshness: "stale" } : item,
      ),
    });

    const result = evaluateCandidate(
      buildCandidate({ confidence: "high" }),
      incident,
    );

    expect(result.disposition).toBe("rejected");
    expect(result.rejectionReason).toContain("High confidence is prohibited");
  });

  it("warns rather than fabricating freshness for a medium-confidence plan", () => {
    const incident = buildIncident({
      evidence: buildIncident().evidence.map((item) =>
        item.id === "ev-transport" ? { ...item, freshness: "stale" } : item,
      ),
    });

    const result = evaluateCandidate(buildCandidate(), incident);

    expect(result.disposition).toBe("eligible");
    expect(result.checks).toContainEqual(
      expect.objectContaining({ id: "transport-freshness", status: "warn" }),
    );
  });

  it("rejects unsupported model-supplied evidence identifiers", () => {
    const result = evaluateCandidate(
      buildCandidate({ evidenceIds: ["invented-evidence"] }),
      buildIncident(),
    );

    expect(result.disposition).toBe("rejected");
    expect(result.rejectionReason).toContain("unsupported evidence");
  });

  it("removes latency score when a plan misses the decision target", () => {
    const incident = buildIncident();
    const onTime = evaluateCandidate(buildCandidate(), incident);
    const late = evaluateCandidate(
      buildCandidate({
        impact: {
          ...buildCandidate().impact,
          decisionLatencySeconds:
            incident.constraints.maximumDecisionLatencySeconds + 1,
        },
      }),
      incident,
    );

    expect(late.score).toBe(onTime.score - 10);
  });

  it("rejects incomplete language coverage", () => {
    const candidate = buildCandidate();
    const result = evaluateCandidate(
      buildCandidate({
        messages: candidate.messages.filter(({ locale }) => locale !== "fr"),
      }),
      buildIncident(),
    );

    expect(result.disposition).toBe("rejected");
    expect(result.rejectionReason).toContain("priority language variants");
  });
});
