import type {
  ApprovalAcknowledgement,
  ApprovedDecision,
  AuditEvent,
  CompiledDecision,
} from "../entities/decision";
import type { Result } from "../../shared/types/result";
import { failure, success } from "../../shared/types/result";

export type ApprovalError = {
  readonly code: "ACKNOWLEDGEMENT_REQUIRED";
  readonly message: string;
};

export interface ApprovalMetadata {
  readonly approvedAt: string;
  readonly auditEventId: string;
}

export function approveDecision(
  decision: CompiledDecision,
  acknowledgement: ApprovalAcknowledgement,
  metadata: ApprovalMetadata,
): Result<ApprovedDecision, ApprovalError> {
  if (
    !acknowledgement.understandsModeledImpact ||
    !acknowledgement.reviewedAccessibility
  ) {
    return failure({
      code: "ACKNOWLEDGEMENT_REQUIRED",
      message:
        "Review the modeled-impact and accessibility statements before approval.",
    });
  }

  const auditEvent: AuditEvent = {
    id: metadata.auditEventId,
    decisionId: decision.id,
    type: "decision-approved",
    at: metadata.approvedAt,
    summary: `Approved ${decision.selected.title} with ${decision.selected.actions.length} owned actions.`,
  };

  return success({
    ...decision,
    state: "approved",
    approvedAt: metadata.approvedAt,
    auditEvent,
  });
}
