import type {
  ApprovedDecision,
  CompiledDecision,
} from "../../domain/entities/decision";
import { AIExplainabilityPanel } from "./AIExplainabilityPanel";
import { ActionTimeline } from "./ActionTimeline";
import { ApprovalPanel } from "./ApprovalPanel";
import { ImpactProof } from "./ImpactProof";
import { RelayPanel } from "./RelayPanel";
import type { DecisionWorkflow } from "../hooks/useDecisionWorkflow";

const ANNOUNCEMENT: Record<DecisionWorkflow["state"]["status"], string> = {
  idle: "",
  compiling: "Compiling and validating three incident response candidates.",
  compiled: "A guarded response is ready for human review.",
  approved: "The response is approved and the audit receipt is ready.",
  error: "The response could not be compiled.",
};

export function WorkflowAnnouncement({
  workflow,
}: {
  readonly workflow: DecisionWorkflow;
}): React.JSX.Element {
  return (
    <p className="visually-hidden" role="status" aria-live="polite">
      {ANNOUNCEMENT[workflow.state.status]}
    </p>
  );
}

function DecisionPlaceholder(): React.JSX.Element {
  return (
    <section
      className="decision-placeholder"
      aria-labelledby="placeholder-title"
    >
      <div className="decision-placeholder__number">90</div>
      <div>
        <p className="section-kicker">Decision evidence appears here</p>
        <h2 id="placeholder-title">
          Compile the incident to expose the model’s reasoning—and its limits.
        </h2>
        <p>
          The stable replay makes every scoring category inspectable without
          credentials or live venue access.
        </p>
      </div>
    </section>
  );
}

function DecisionEvidence({
  decision,
  tail,
}: {
  readonly decision: CompiledDecision | ApprovedDecision;
  readonly tail: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="decision-evidence">
      <AIExplainabilityPanel decision={decision} />
      <ImpactProof decision={decision} />
      <ActionTimeline actions={decision.selected.actions} />
      {tail}
    </div>
  );
}

export function DecisionContent({
  workflow,
}: {
  readonly workflow: DecisionWorkflow;
}): React.JSX.Element {
  if (workflow.state.status === "compiled")
    return (
      <DecisionEvidence
        decision={workflow.state.decision}
        tail={
          <ApprovalPanel
            decision={workflow.state.decision}
            onApprove={workflow.approve}
          />
        }
      />
    );
  if (workflow.state.status === "approved")
    return (
      <DecisionEvidence
        decision={workflow.state.decision}
        tail={<RelayPanel decision={workflow.state.decision} />}
      />
    );
  return <DecisionPlaceholder />;
}
