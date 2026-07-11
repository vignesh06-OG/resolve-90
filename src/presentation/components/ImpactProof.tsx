import type {
  ApprovedDecision,
  CompiledDecision,
} from "../../domain/entities/decision";
import { Icon } from "../../shared/components/Icon";
import { Card, SectionHeader } from "../../shared/components/ui";
import { createImpactMetrics, type ImpactMetric } from "./impactMetrics";

function ImpactCard({
  metric,
}: {
  readonly metric: ImpactMetric;
}): React.JSX.Element {
  return (
    <Card className="impact-card">
      <div className="impact-card__heading">
        <span className="impact-card__icon">
          <Icon name={metric.icon} />
        </span>
        <span>{metric.label}</span>
      </div>
      <div className="impact-card__values">
        <span>
          <small>Before</small>
          <s>{metric.before}</s>
        </span>
        <Icon name="arrow" />
        <span>
          <small>Projected</small>
          <strong>{metric.after}</strong>
        </span>
      </div>
      <p>{metric.outcome}</p>
    </Card>
  );
}

export function ImpactProof({
  decision,
}: {
  readonly decision: CompiledDecision | ApprovedDecision;
}): React.JSX.Element {
  const metrics = createImpactMetrics(decision);
  return (
    <section className="impact-proof" aria-labelledby="impact-title">
      <SectionHeader
        kicker="Modeled outcome evidence"
        title="One decision, six observable outcomes"
        titleId="impact-title"
        summary="Projections from synthetic replay inputs. Safety and accessibility pass before carbon can influence ranking."
      />
      <div className="impact-grid">
        {metrics.map((metric) => (
          <ImpactCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}
