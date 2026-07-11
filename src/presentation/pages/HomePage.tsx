import "../styles/home.css";

import {
  DecisionContent,
  WorkflowAnnouncement,
} from "../components/HomeDecisionContent";
import { IncidentBrief } from "../components/IncidentBrief";
import { OperationalFlow } from "../components/OperationalFlow";
import { useDecisionWorkflow } from "../hooks/useDecisionWorkflow";

export default function HomePage(): React.JSX.Element {
  const workflow = useDecisionWorkflow();
  return (
    <>
      <div className="home-hero-wrap">
        <div className="shell-width">
          <IncidentBrief
            incident={workflow.incident}
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
        <WorkflowAnnouncement workflow={workflow} />
        <DecisionContent workflow={workflow} />
      </div>
    </>
  );
}
