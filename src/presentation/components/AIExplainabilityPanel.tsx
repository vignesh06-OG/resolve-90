import type {
  ApprovedDecision,
  CompiledDecision,
  GuardrailCheck,
} from "../../domain/entities/decision";
import { Icon } from "../../shared/components/Icon";
import { Badge } from "../../shared/components/ui/Badge";

function ValidationRow({
  check,
}: {
  readonly check: GuardrailCheck;
}): React.JSX.Element {
  const icon = check.status === "pass" ? "check" : "warning";
  return (
    <li className={`validation-row validation-row--${check.status}`}>
      <span className="validation-row__icon">
        <Icon name={icon} size={17} />
      </span>
      <span>
        <strong>{check.label}</strong>
        <small>{check.detail}</small>
      </span>
      <Badge tone={check.status}>{check.status}</Badge>
    </li>
  );
}

interface AIExplainabilityPanelProps {
  readonly decision: CompiledDecision | ApprovedDecision;
}

const CONFIDENCE_PERCENT = {
  low: 34,
  medium: 67,
  high: 100,
} as const;

export function AIExplainabilityPanel({
  decision,
}: AIExplainabilityPanelProps): React.JSX.Element {
  const { selected, incident, alternatives, receipt } = decision;
  const accessibilityCheck = selected.checks.find(
    ({ category }) => category === "accessibility",
  );
  const safetyCheck = selected.checks.find(
    ({ category }) => category === "safety",
  );

  return (
    <section
      className="explainability-panel"
      aria-labelledby="explainability-title"
    >
      <header className="explainability-panel__header">
        <div>
          <p className="section-kicker">
            <Icon name="spark" size={16} /> AI explainability panel
          </p>
          <h2 id="explainability-title">
            What the model proposed. What code allowed.
          </h2>
        </div>
        <div className="explainability-score">
          <span>{selected.score}</span>
          <small>/ 100 guarded plan score</small>
        </div>
      </header>

      <div className="explainability-grid">
        <article className="reasoning-card">
          <p className="panel-label">Recommendation</p>
          <h3>{selected.title}</h3>
          <p>{selected.strategy}</p>
          <div className="reasoning-block">
            <p className="panel-label">Reasoning</p>
            <p>{selected.rationale}</p>
          </div>
          <dl className="explainability-meta">
            <div>
              <dt>Confidence</dt>
              <dd className="text-amber">{selected.confidence}</dd>
            </div>
            <div>
              <dt>Grounded sources</dt>
              <dd>{selected.evidenceIds.length}</dd>
            </div>
            <div>
              <dt>Owned actions</dt>
              <dd>{selected.actions.length}</dd>
            </div>
          </dl>
          <div className="confidence-visual">
            <div className="confidence-visual__label">
              <span>Calibrated confidence</span>
              <strong>{CONFIDENCE_PERCENT[selected.confidence]}%</strong>
            </div>
            <div
              className="confidence-meter"
              role="progressbar"
              aria-label="AI recommendation confidence"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={CONFIDENCE_PERCENT[selected.confidence]}
              aria-valuetext={`${selected.confidence} confidence`}
            >
              <span
                className={`confidence-meter__fill confidence-meter__fill--${selected.confidence}`}
              />
            </div>
          </div>
          <p className="confidence-note">
            <Icon name="warning" size={17} /> Confidence cannot be “high” until
            the stale Blue Line headway is reconfirmed.
          </p>
        </article>

        <article className="constraints-card">
          <p className="panel-label">Hard constraints outside the model</p>
          <h3>Non-negotiable operating envelope</h3>
          <dl className="constraint-list">
            <div>
              <dt>Peak pressure</dt>
              <dd>≤ {incident.constraints.maximumPressureRatio.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Step-free capacity floor</dt>
              <dd>≥ {incident.constraints.minimumAccessibleRoutePercent}%</dd>
            </div>
            <div>
              <dt>Accessibility target</dt>
              <dd>≥ {incident.constraints.targetAccessibleRoutePercent}%</dd>
            </div>
            <div>
              <dt>Decision latency</dt>
              <dd>≤ {incident.constraints.maximumDecisionLatencySeconds}s</dd>
            </div>
          </dl>
          <div className="validation-highlight">
            <div>
              <Icon name="access" />
              <span>
                <strong>Accessibility validation</strong>
                <small>{accessibilityCheck?.detail}</small>
              </span>
            </div>
            <div>
              <Icon name="shield" />
              <span>
                <strong>Safety validation</strong>
                <small>{safetyCheck?.detail}</small>
              </span>
            </div>
          </div>
        </article>
      </div>

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
          {selected.checks.map((check) => (
            <ValidationRow check={check} key={check.id} />
          ))}
        </ul>
      </div>

      <div className="rejected-section">
        <div className="rejected-section__heading">
          <div>
            <p className="panel-label">Rejected alternatives</p>
            <h3>Useful generation, unsafe decision</h3>
          </div>
          <p>
            High throughput cannot compensate for an accessibility or safety
            breach.
          </p>
        </div>
        <div className="rejected-grid">
          {alternatives.map((alternative) => (
            <article className="rejected-card" key={alternative.id}>
              <div className="rejected-card__top">
                <span className="status-pill status-pill--fail">Rejected</span>
                <span>{alternative.score}/100 before veto</span>
              </div>
              <h4>{alternative.title}</h4>
              <p>{alternative.strategy}</p>
              <div className="veto-reason">
                <Icon name="warning" size={18} />
                <span>
                  <strong>Guardrail veto</strong>
                  {alternative.rejectionReason}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className="generation-receipt">
        <Icon name="evidence" />
        <div>
          <strong>Generation provenance</strong>
          <span>
            {receipt.mode} · {receipt.model} · prompt {receipt.promptVersion}
          </span>
        </div>
        <span>{receipt.note}</span>
      </footer>
    </section>
  );
}
