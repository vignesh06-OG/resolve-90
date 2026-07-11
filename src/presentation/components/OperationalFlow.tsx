import type { DecisionWorkflowState } from "../hooks/useDecisionWorkflow";
import { Icon, type IconName } from "../../shared/components/Icon";

interface FlowStage {
  readonly label: string;
  readonly note: string;
  readonly icon: IconName;
}

const STAGES: readonly FlowStage[] = [
  { label: "Incident", note: "5 normalized signals", icon: "evidence" },
  { label: "Analysis", note: "Ground facts + policy", icon: "code" },
  { label: "Safety validation", note: "Pressure envelope", icon: "shield" },
  { label: "Accessibility validation", note: "Step-free veto", icon: "access" },
  { label: "Risk scoring", note: "3 alternatives ranked", icon: "warning" },
  { label: "Human approval", note: "Authority retained", icon: "users" },
  { label: "Command packet", note: "Owned actions + receipt", icon: "spark" },
];

const ACTIVE_STAGE: Record<DecisionWorkflowState["status"], number> = {
  idle: 1,
  compiling: 2,
  compiled: 6,
  approved: 8,
  error: 0,
};

function FlowStep({
  stage,
  index,
  active,
}: {
  readonly stage: FlowStage;
  readonly index: number;
  readonly active: number;
}): React.JSX.Element {
  const stageNumber = index + 1;
  const status =
    stageNumber < active
      ? "complete"
      : stageNumber === active
        ? "current"
        : "pending";
  return (
    <li className={`flow-step flow-step--${status}`}>
      <div className="flow-step__icon">
        <Icon name={status === "complete" ? "check" : stage.icon} size={18} />
      </div>
      <div>
        <span>{stage.label}</span>
        <small>{stage.note}</small>
      </div>
      <span className="visually-hidden">{status}</span>
    </li>
  );
}

function FlowHeading(): React.JSX.Element {
  return (
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
  );
}

export function OperationalFlow({
  state,
}: {
  readonly state: DecisionWorkflowState;
}): React.JSX.Element {
  const active = ACTIVE_STAGE[state.status];
  return (
    <section className="operational-flow" aria-labelledby="flow-title">
      <FlowHeading />
      <ol className="flow-track" aria-label="AI incident reasoning stages">
        {STAGES.map((stage, index) => (
          <FlowStep
            active={active}
            index={index}
            key={stage.label}
            stage={stage}
          />
        ))}
      </ol>
    </section>
  );
}
