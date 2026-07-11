import { describe, expect, it } from "vitest";

import { approveDecision } from "../../src/domain/services/approveDecision";
import { buildCompiledDecision } from "../fixtures/builders";

const metadata = {
  approvedAt: "2026-07-11T18:43:10.000Z",
  auditEventId: "audit-1",
};

describe("approveDecision", () => {
  it("blocks approval until both safety acknowledgements are explicit", () => {
    const result = approveDecision(
      buildCompiledDecision(),
      {
        understandsModeledImpact: true,
        reviewedAccessibility: false,
      },
      metadata,
    );

    expect(result).toMatchObject({
      ok: false,
      error: { code: "ACKNOWLEDGEMENT_REQUIRED" },
    });
  });

  it("creates an immutable approval receipt for a reviewed decision", () => {
    const result = approveDecision(
      buildCompiledDecision(),
      {
        understandsModeledImpact: true,
        reviewedAccessibility: true,
      },
      metadata,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.state).toBe("approved");
      expect(result.value.auditEvent).toEqual(
        expect.objectContaining({
          id: "audit-1",
          type: "decision-approved",
          decisionId: "decision-1",
        }),
      );
    }
  });
});
