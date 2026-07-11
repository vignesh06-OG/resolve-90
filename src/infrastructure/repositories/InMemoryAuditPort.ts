import type { AuditPort } from "../../application/ports/AuditPort";
import type { AuditEvent } from "../../domain/entities/decision";
import type { Result } from "../../shared/types/result";
import { success } from "../../shared/types/result";

export class InMemoryAuditPort implements AuditPort {
  readonly events: AuditEvent[] = [];

  append(event: AuditEvent): Promise<Result<void, never>> {
    this.events.push(event);
    return Promise.resolve(success(undefined));
  }
}
