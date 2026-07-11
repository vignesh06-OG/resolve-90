import type { DecisionWorkflowState } from "../hooks/useDecisionWorkflow";
import { Icon, type IconName } from "../../shared/components/Icon";

interface FlowStage {
  readonly label: string;
  readonly note: string;
  readonly icon: IconName;
}

const stages: readonly FlowStage[] = [
  { label: "Input", note: "5 normalized signals", icon: "evidence" },
  { label: "Analysis", note: "Ground facts + policy", icon: "code" },
  { label: "Risk detection", note: "Cross-domain conflict", icon: "warning" },
  { label: "AI planning", note: "3 structured plans", icon: "spark" },
  { label: "Validation", note: "5 deterministic checks", icon: "shield" },
  { label: "Human approval", note: "Authority retained", icon: "users" },
  { label: "Audit receipt", note: "Decision trace", icon: "evidence" },
];

function completedCount(state: DecisionWorkflowState): number {
  switch (state.status) {
    case "idle":
      return 1;
    case "compiling":
      return 4;
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
  const completed = completedCount(state);

  return (
    <section className="operational-flow" aria-labelledby="flow-title">
      <div className="operational-flow__heading">
        <div>
          <p className="section-kicker">Observable operational flow</p>
          <h2 id="flow-title">From fragmented signal to accountable action</h2>
        </div>
        <p>
          Generation is one bounded stage. Validation and human authority stay
          outside the model.
        </p>
      </div>
      <ol className="flow-track">
        {stages.map(({ label, note, icon }, index) => {
          const stageNumber = index + 1;
          const status =
            stageNumber < completed
              ? "complete"
              : stageNumber === completed
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
