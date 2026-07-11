import type { ApprovedDecision } from "../../../domain/entities/decision";
import { Icon } from "../../../shared/components/Icon";

function ReceiptMetadata({
  decision,
  approvedTime,
}: {
  readonly decision: ApprovedDecision;
  readonly approvedTime: string;
}): React.JSX.Element {
  return (
    <dl>
      <div>
        <dt>Receipt</dt>
        <dd>{decision.auditEvent.id.slice(0, 18)}…</dd>
      </div>
      <div>
        <dt>Approved</dt>
        <dd>
          <time dateTime={decision.approvedAt}>{approvedTime}</time>
        </dd>
      </div>
      <div>
        <dt>Provenance</dt>
        <dd>{decision.receipt.mode} · human-approved</dd>
      </div>
    </dl>
  );
}

export function AuditReceipt({
  decision,
}: {
  readonly decision: ApprovedDecision;
}): React.JSX.Element {
  const approvedTime = new Date(decision.approvedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <aside className="audit-receipt" aria-label="Approval audit receipt">
      <span className="audit-receipt__icon">
        <Icon name="evidence" />
      </span>
      <div>
        <p className="panel-label">Immutable audit-port receipt</p>
        <strong>{decision.auditEvent.summary}</strong>
      </div>
      <ReceiptMetadata approvedTime={approvedTime} decision={decision} />
    </aside>
  );
}
