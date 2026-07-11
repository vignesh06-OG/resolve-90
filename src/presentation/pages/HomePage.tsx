import "../styles/home.css";

import { AIExplainabilityPanel } from "../components/AIExplainabilityPanel";
import { ActionTimeline } from "../components/ActionTimeline";
import { ApprovalPanel } from "../components/ApprovalPanel";
import { ImpactProof } from "../components/ImpactProof";
import { IncidentBrief } from "../components/IncidentBrief";
import { OperationalFlow } from "../components/OperationalFlow";
import { RelayPanel } from "../components/RelayPanel";
import { useDecisionWorkflow } from "../hooks/useDecisionWorkflow";

export default function HomePage(): React.JSX.Element {
  const workflow = useDecisionWorkflow();
  const decision =
    workflow.state.status === "compiled" || workflow.state.status === "approved"
      ? workflow.state.decision
      : null;

  return (
    <>
      <div className="home-hero-wrap">
        <div className="shell-width">
          <IncidentBrief
            state={workflow.state}
            onCompile={workflow.compile}
            onReset={workflow.reset}
          />
        </div>
      </div>

      <div className="home-content shell-width">
        <div id="operational-flow">
          <OperationalFlow state={workflow.state} />
        </div>

        <p className="visually-hidden" role="status" aria-live="polite">
          {workflow.state.status === "compiling"
            ? "Compiling and validating three incident response candidates."
            : workflow.state.status === "compiled"
              ? "A guarded response is ready for human review."
              : workflow.state.status === "approved"
                ? "The response is approved and the audit receipt is ready."
                : ""}
        </p>

        {decision === null ? (
          <section
            className="decision-placeholder"
            aria-labelledby="placeholder-title"
          >
            <div className="decision-placeholder__number">90</div>
            <div>
              <p className="section-kicker">Decision evidence appears here</p>
              <h2 id="placeholder-title">
                Compile the incident to expose the model’s reasoning—and its
                limits.
              </h2>
              <p>
                The stable replay makes every scoring category inspectable
                without credentials or live venue access.
              </p>
            </div>
          </section>
        ) : (
          <div className="decision-evidence">
            <AIExplainabilityPanel decision={decision} />
            <ImpactProof decision={decision} />
            <ActionTimeline actions={decision.selected.actions} />
            {workflow.state.status === "compiled" ? (
              <ApprovalPanel
                decision={workflow.state.decision}
                onApprove={workflow.approve}
              />
            ) : null}
            {workflow.state.status === "approved" ? (
              <RelayPanel decision={workflow.state.decision} />
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
