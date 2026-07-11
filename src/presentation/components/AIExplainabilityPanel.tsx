import type {
  ApprovedDecision,
  CompiledDecision,
} from "../../domain/entities/decision";
import { ConstraintsCard } from "./explainability/ConstraintsCard";
import {
  ExplainabilityHeader,
  GenerationReceiptView,
} from "./explainability/PanelFrame";
import { RecommendationCard } from "./explainability/RecommendationCard";
import { RejectedSection } from "./explainability/RejectedSection";
import { ValidationSection } from "./explainability/ValidationSection";

export function AIExplainabilityPanel({
  decision,
}: {
  readonly decision: CompiledDecision | ApprovedDecision;
}): React.JSX.Element {
  return (
    <section
      className="explainability-panel"
      aria-labelledby="explainability-title"
    >
      <ExplainabilityHeader candidate={decision.selected} />
      <div className="explainability-grid">
        <RecommendationCard candidate={decision.selected} />
        <ConstraintsCard
          candidate={decision.selected}
          incident={decision.incident}
        />
      </div>
      <ValidationSection checks={decision.selected.checks} />
      <RejectedSection alternatives={decision.alternatives} />
      <GenerationReceiptView receipt={decision.receipt} />
    </section>
  );
}
