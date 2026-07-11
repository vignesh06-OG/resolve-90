import type { ReactNode } from "react";

import type { CompiledDecision } from "../../domain/entities/decision";
import { Icon } from "../../shared/components/Icon";
import { Button } from "../../shared/components/ui";

function ApprovalMetadata({
  decision,
}: {
  readonly decision: CompiledDecision;
}): React.JSX.Element {
  return (
    <dl>
      <div>
        <dt>Decision</dt>
        <dd>{decision.id.slice(0, 18)}…</dd>
      </div>
      <div>
        <dt>State</dt>
        <dd>Awaiting approval</dd>
      </div>
      <div>
        <dt>Authority</dt>
        <dd>Venue commander</dd>
      </div>
    </dl>
  );
}

export function ApprovalSummary({
  decision,
}: {
  readonly decision: CompiledDecision;
}): React.JSX.Element {
  return (
    <div className="approval-panel__summary">
      <p className="section-kicker">
        <Icon name="users" size={16} /> Human authority boundary
      </p>
      <h2 id="approval-title">The model cannot press this button.</h2>
      <p>
        Approval records the selected plan, guardrail results, generation
        provenance, acknowledgements, and timestamp before role relays unlock.
      </p>
      <ApprovalMetadata decision={decision} />
    </div>
  );
}

function Acknowledgement({
  checked,
  onChange,
  children,
}: {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <label className="approval-check">
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}

interface ApprovalFieldsetProps {
  readonly modeledImpact: boolean;
  readonly accessibility: boolean;
  readonly setModeledImpact: (checked: boolean) => void;
  readonly setAccessibility: (checked: boolean) => void;
}

export function ApprovalFieldset({
  modeledImpact,
  accessibility,
  setModeledImpact,
  setAccessibility,
}: ApprovalFieldsetProps): React.JSX.Element {
  return (
    <fieldset>
      <legend>Required review acknowledgements</legend>
      <Acknowledgement checked={modeledImpact} onChange={setModeledImpact}>
        <strong>Modeled impact reviewed</strong>
        <small>
          These values are projections from synthetic data, not measured
          real-world outcomes.
        </small>
      </Acknowledgement>
      <Acknowledgement checked={accessibility} onChange={setAccessibility}>
        <strong>Accessibility validation reviewed</strong>
        <small>
          The protected North Loop and N-L1 fallback remain viable before relay.
        </small>
      </Acknowledgement>
    </fieldset>
  );
}

export function ApprovalSubmit({
  submitting,
}: {
  readonly submitting: boolean;
}): React.JSX.Element {
  const label = submitting
    ? "Writing audit receipt…"
    : "Approve plan and unlock relay";
  return (
    <>
      <Button
        className="approval-button"
        type="submit"
        busy={submitting}
        disabled={submitting}
      >
        <Icon name="shield" />
        {label}
      </Button>
      <p className="approval-form__note">
        No gate, route, security, medical, or evacuation control is automated.
      </p>
    </>
  );
}
