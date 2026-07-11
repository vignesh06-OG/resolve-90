import { useState, type SyntheticEvent } from "react";

import type { CompiledDecision } from "../../domain/entities/decision";
import { Icon } from "../../shared/components/Icon";
import { Button } from "../../shared/components/ui/Button";

interface ApprovalPanelProps {
  readonly decision: CompiledDecision;
  readonly onApprove: (acknowledgement: {
    readonly understandsModeledImpact: boolean;
    readonly reviewedAccessibility: boolean;
  }) => Promise<boolean>;
}

export function ApprovalPanel({
  decision,
  onApprove,
}: ApprovalPanelProps): React.JSX.Element {
  const [modeledImpact, setModeledImpact] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setSubmitting(true);
    const approved = await onApprove({
      understandsModeledImpact: modeledImpact,
      reviewedAccessibility: accessibility,
    });
    setSubmitting(false);

    if (approved) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("#relay-title")?.focus();
      });
    }
  }

  return (
    <section className="approval-panel" aria-labelledby="approval-title">
      <div className="approval-panel__summary">
        <p className="section-kicker">
          <Icon name="users" size={16} /> Human authority boundary
        </p>
        <h2 id="approval-title">The model cannot press this button.</h2>
        <p>
          Approval records the selected plan, guardrail results, generation
          provenance, acknowledgements, and timestamp before role relays unlock.
        </p>
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
      </div>
      <form
        className="approval-form"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <fieldset>
          <legend>Required review acknowledgements</legend>
          <label className="approval-check">
            <input
              type="checkbox"
              required
              checked={modeledImpact}
              onChange={(event) => setModeledImpact(event.target.checked)}
            />
            <span>
              <strong>Modeled impact reviewed</strong>
              <small>
                These values are projections from synthetic data, not measured
                real-world outcomes.
              </small>
            </span>
          </label>
          <label className="approval-check">
            <input
              type="checkbox"
              required
              checked={accessibility}
              onChange={(event) => setAccessibility(event.target.checked)}
            />
            <span>
              <strong>Accessibility validation reviewed</strong>
              <small>
                The protected North Loop and N-L1 fallback remain viable before
                relay.
              </small>
            </span>
          </label>
        </fieldset>
        <Button
          className="approval-button"
          type="submit"
          busy={submitting}
          disabled={submitting}
        >
          <Icon name="shield" />
          {submitting
            ? "Writing audit receipt…"
            : "Approve plan and unlock relay"}
        </Button>
        <p className="approval-form__note">
          No gate, route, security, medical, or evacuation control is automated.
        </p>
      </form>
    </section>
  );
}
