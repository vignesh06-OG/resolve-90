import type { ApprovedDecision } from "../../domain/entities/decision";
import { Icon } from "../../shared/components/Icon";
import { Badge } from "../../shared/components/ui";
import { AuditReceipt } from "./relay/AuditReceipt";
import { FanRelay } from "./relay/FanRelay";
import { RoleRelay } from "./relay/RoleRelay";

export function RelayPanel({
  decision,
}: {
  readonly decision: ApprovedDecision;
}): React.JSX.Element | null {
  const hasDefaultLocale = decision.selected.messages.some(
    ({ locale }) => locale === "en",
  );
  if (!hasDefaultLocale) return null;
  return (
    <section className="relay-panel" aria-labelledby="relay-title">
      <header className="relay-panel__header">
        <div>
          <p className="section-kicker">
            <Icon name="check" size={16} /> Approved · relay unlocked
          </p>
          <h2 id="relay-title" tabIndex={-1}>
            One plan, adapted to every role and fan.
          </h2>
        </div>
        <Badge tone="pass">Audit receipt written</Badge>
      </header>
      <div className="relay-grid">
        <RoleRelay actions={decision.selected.actions} />
        <FanRelay messages={decision.selected.messages} />
      </div>
      <AuditReceipt decision={decision} />
    </section>
  );
}
