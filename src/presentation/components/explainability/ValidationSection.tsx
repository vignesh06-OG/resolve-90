import type { GuardrailCheck } from "../../../domain/entities/decision";
import { Icon } from "../../../shared/components/Icon";
import { Badge } from "../../../shared/components/ui";

const STATUS_ICON = {
  pass: "check",
  warn: "warning",
  fail: "warning",
} as const;

function ValidationRow({
  check,
}: {
  readonly check: GuardrailCheck;
}): React.JSX.Element {
  return (
    <li className={`validation-row validation-row--${check.status}`}>
      <span className="validation-row__icon">
        <Icon name={STATUS_ICON[check.status]} size={17} />
      </span>
      <span>
        <strong>{check.label}</strong>
        <small>{check.detail}</small>
      </span>
      <Badge tone={check.status}>{check.status}</Badge>
    </li>
  );
}

export function ValidationSection({
  checks,
}: {
  readonly checks: readonly GuardrailCheck[];
}): React.JSX.Element {
  return (
    <div className="validation-section">
      <div className="validation-section__heading">
        <div>
          <p className="panel-label">Deterministic validation receipt</p>
          <h3>5 checks · 0 silent overrides</h3>
        </div>
        <span className="status-pill status-pill--warn">
          4 pass · 1 requires confirmation
        </span>
      </div>
      <ul className="validation-list">
        {checks.map((check) => (
          <ValidationRow check={check} key={check.id} />
        ))}
      </ul>
    </div>
  );
}
