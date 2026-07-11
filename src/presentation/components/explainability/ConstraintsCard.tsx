import type { EvaluatedCandidate } from "../../../domain/entities/decision";
import type { IncidentContext } from "../../../domain/entities/incident";
import { Icon } from "../../../shared/components/Icon";

function ConstraintList({
  incident,
}: {
  readonly incident: IncidentContext;
}): React.JSX.Element {
  const constraints = incident.constraints;
  return (
    <dl className="constraint-list">
      <div>
        <dt>Peak pressure</dt>
        <dd>≤ {constraints.maximumPressureRatio.toFixed(2)}</dd>
      </div>
      <div>
        <dt>Step-free capacity floor</dt>
        <dd>≥ {constraints.minimumAccessibleRoutePercent}%</dd>
      </div>
      <div>
        <dt>Accessibility target</dt>
        <dd>≥ {constraints.targetAccessibleRoutePercent}%</dd>
      </div>
      <div>
        <dt>Decision latency</dt>
        <dd>≤ {constraints.maximumDecisionLatencySeconds}s</dd>
      </div>
    </dl>
  );
}

function ValidationHighlight({
  icon,
  label,
  detail,
}: {
  readonly icon: "access" | "shield";
  readonly label: string;
  readonly detail: string | undefined;
}): React.JSX.Element {
  return (
    <div>
      <Icon name={icon} />
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </div>
  );
}

function ValidationHighlights({
  candidate,
}: {
  readonly candidate: EvaluatedCandidate;
}): React.JSX.Element {
  const accessibility = candidate.checks.find(
    ({ category }) => category === "accessibility",
  );
  const safety = candidate.checks.find(({ category }) => category === "safety");
  return (
    <div className="validation-highlight">
      <ValidationHighlight
        detail={accessibility?.detail}
        icon="access"
        label="Accessibility validation"
      />
      <ValidationHighlight
        detail={safety?.detail}
        icon="shield"
        label="Safety validation"
      />
    </div>
  );
}

export function ConstraintsCard({
  incident,
  candidate,
}: {
  readonly incident: IncidentContext;
  readonly candidate: EvaluatedCandidate;
}): React.JSX.Element {
  return (
    <article className="constraints-card">
      <p className="panel-label">Hard constraints outside the model</p>
      <h3>Non-negotiable operating envelope</h3>
      <ConstraintList incident={incident} />
      <ValidationHighlights candidate={candidate} />
    </article>
  );
}
