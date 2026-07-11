import type { AuditEvent } from "../../domain/entities/decision";
import type { Result } from "../../shared/types/result";

export type AuditError = {
  readonly code: "AUDIT_UNAVAILABLE";
  readonly message: string;
};

export interface AuditPort {
  append(event: AuditEvent): Promise<Result<void, AuditError>>;
}
