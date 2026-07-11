import type { AuditPort } from "../ports/AuditPort";
import type { Clock, IdGenerator } from "../ports/SystemPorts";
import type {
  ApprovalAcknowledgement,
  ApprovedDecision,
  CompiledDecision,
} from "../../domain/entities/decision";
import { approveDecision } from "../../domain/services/approveDecision";
import type { Result } from "../../shared/types/result";
import { failure, success } from "../../shared/types/result";

export type ApproveCompiledDecisionError = {
  readonly code: "ACKNOWLEDGEMENT_REQUIRED" | "AUDIT_FAILURE";
  readonly message: string;
};

export interface ApproveCompiledDecision {
  execute(
    decision: CompiledDecision,
    acknowledgement: ApprovalAcknowledgement,
  ): Promise<Result<ApprovedDecision, ApproveCompiledDecisionError>>;
}

export interface ApproveCompiledDecisionDependencies {
  readonly audit: AuditPort;
  readonly clock: Clock;
  readonly ids: IdGenerator;
}

export function createApproveCompiledDecision(
  dependencies: ApproveCompiledDecisionDependencies,
): ApproveCompiledDecision {
  return {
    async execute(decision, acknowledgement) {
      const approval = approveDecision(decision, acknowledgement, {
        approvedAt: dependencies.clock.now(),
        auditEventId: dependencies.ids.next("audit"),
      });

      if (!approval.ok) {
        return failure(approval.error);
      }

      const appendResult = await dependencies.audit.append(
        approval.value.auditEvent,
      );
      if (!appendResult.ok) {
        return failure({
          code: "AUDIT_FAILURE",
          message:
            "Approval was not committed because the audit receipt could not be stored.",
        });
      }

      return success(approval.value);
    },
  };
}
