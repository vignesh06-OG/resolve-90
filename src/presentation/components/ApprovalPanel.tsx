import { useState, type SyntheticEvent } from "react";

import type {
  ApprovalAcknowledgement,
  CompiledDecision,
} from "../../domain/entities/decision";
import {
  ApprovalFieldset,
  ApprovalSubmit,
  ApprovalSummary,
} from "./ApprovalSections";

interface ApprovalPanelProps {
  readonly decision: CompiledDecision;
  readonly onApprove: (
    acknowledgement: ApprovalAcknowledgement,
  ) => Promise<boolean>;
}

function focusRelay(): void {
  document.querySelector<HTMLElement>("#relay-title")?.focus();
}

function ApprovalForm({
  onApprove,
}: Pick<ApprovalPanelProps, "onApprove">): React.JSX.Element {
  const [modeledImpact, setModeledImpact] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: SyntheticEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitting(true);
    const approved = await onApprove({
      understandsModeledImpact: modeledImpact,
      reviewedAccessibility: accessibility,
    });
    setSubmitting(false);
    if (approved) window.requestAnimationFrame(focusRelay);
  }
  return (
    <form className="approval-form" onSubmit={(event) => void submit(event)}>
      <ApprovalFieldset
        modeledImpact={modeledImpact}
        accessibility={accessibility}
        setModeledImpact={setModeledImpact}
        setAccessibility={setAccessibility}
      />
      <ApprovalSubmit submitting={submitting} />
    </form>
  );
}

export function ApprovalPanel({
  decision,
  onApprove,
}: ApprovalPanelProps): React.JSX.Element {
  return (
    <section className="approval-panel" aria-labelledby="approval-title">
      <ApprovalSummary decision={decision} />
      <ApprovalForm onApprove={onApprove} />
    </section>
  );
}
