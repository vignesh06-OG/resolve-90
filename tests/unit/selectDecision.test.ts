import { describe, expect, it } from "vitest";

import { selectDecision } from "../../src/domain/services/selectDecision";
import { buildCandidate, buildIncident } from "../fixtures/builders";

describe("selectDecision", () => {
  it("selects an eligible plan ahead of a higher-throughput rejected plan", () => {
    const inaccessible = buildCandidate({
      id: "fast-but-inaccessible",
      title: "Close the step-free route",
      impact: {
        ...buildCandidate().impact,
        peakPressureRatio: 0.7,
        accessibleRoutePercent: 42,
      },
    });
    const balanced = buildCandidate({ id: "balanced" });

    const result = selectDecision([inaccessible, balanced], buildIncident());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.selected.id).toBe("balanced");
      expect(result.value.alternatives[0]?.disposition).toBe("rejected");
    }
  });

  it("returns a typed error when no candidate passes hard constraints", () => {
    const unsafe = buildCandidate({
      impact: { ...buildCandidate().impact, peakPressureRatio: 1.1 },
    });

    const result = selectDecision([unsafe], buildIncident());

    expect(result).toMatchObject({
      ok: false,
      error: { code: "NO_SAFE_PLAN" },
    });
  });
});
