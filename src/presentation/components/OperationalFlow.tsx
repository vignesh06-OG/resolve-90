import type { DecisionWorkflowState } from "../hooks/useDecisionWorkflow";
import { Icon, type IconName } from "../../shared/components/Icon";

interface FlowStage {
  readonly label: string;
  readonly note: string;
  readonly icon: IconName;
}

const stages: readonly FlowStage[] = [
  { label: "Incident", note: "5 normalized signals", icon: "evidence" },
  { label: "Analysis", note: "Ground facts + policy", icon: "code" },
  {
    label: "Safety validation",
    note: "Pressure envelope",
    icon: "shield",
  },
  {
    label: "Accessibility validation",
    note: "Step-free veto",
    icon: "access",
  },
  { label: "Risk scoring", note: "3 alternatives ranked", icon: "warning" },
  { label: "Human approval", note: "Authority retained", icon: "users" },
  { label: "Command packet", note: "Owned actions + receipt", icon: "spark" },
];

function activeStage(state: DecisionWorkflowState): number {
  switch (state.status) {
    case "idle":
      return 1;
    case "compiling":
      return 2;
    case "compiled":
      return 6;
    case "approved":
      return 8;
    case "error":
      return 0;
  }
}

interface OperationalFlowProps {
  readonly state: DecisionWorkflowState;
}

export function OperationalFlow({
  state,
}: OperationalFlowProps): React.JSX.Element {
  const active = activeStage(state);

  return (
    <section className="operational-flow" aria-labelledby="flow-title">
      <div className="operational-flow__heading">
        <div>
          <p className="section-kicker">Live AI reasoning pipeline</p>
          <h2 id="flow-title">From incident signal to accountable command</h2>
        </div>
        <p>
          Each transition exposes a real decision boundary. Generation cannot
          bypass safety, accessibility, or human authority.
        </p>
      </div>
      <ol className="flow-track" aria-label="AI incident reasoning stages">
        {stages.map(({ label, note, icon }, index) => {
          const stageNumber = index + 1;
          const status =
            stageNumber < active
              ? "complete"
              : stageNumber === active
                ? "current"
                : "pending";
          return (
            <li className={`flow-step flow-step--${status}`} key={label}>
              <div className="flow-step__icon">
                {status === "complete" ? (
                  <Icon name="check" size={18} />
                ) : (
                  <Icon name={icon} size={18} />
                )}
              </div>
              <div>
                <span>{label}</span>
                <small>{note}</small>
              </div>
              <span className="visually-hidden">{status}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
