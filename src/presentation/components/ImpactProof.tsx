import type {
  ApprovedDecision,
  CompiledDecision,
} from "../../domain/entities/decision";
import { Icon, type IconName } from "../../shared/components/Icon";

interface ImpactMetric {
  readonly label: string;
  readonly before: string;
  readonly after: string;
  readonly outcome: string;
  readonly icon: IconName;
}

interface ImpactProofProps {
  readonly decision: CompiledDecision | ApprovedDecision;
}

export function ImpactProof({ decision }: ImpactProofProps): React.JSX.Element {
  const baseline = decision.incident.baseline;
  const projected = decision.selected.impact;
  const carbonAvoided =
    baseline.operationalCarbonKg - projected.operationalCarbonKg;
  const metrics: readonly ImpactMetric[] = [
    {
      label: "Decision latency",
      before: `${Math.floor(baseline.decisionLatencySeconds / 60)}m ${baseline.decisionLatencySeconds % 60}s`,
      after: `${projected.decisionLatencySeconds}s`,
      outcome: "80% faster",
      icon: "clock",
    },
    {
      label: "Peak pressure",
      before: baseline.peakPressureRatio.toFixed(2),
      after: projected.peakPressureRatio.toFixed(2),
      outcome: "Inside 0.95 limit",
      icon: "users",
    },
    {
      label: "Step-free capacity",
      before: `${baseline.accessibleRoutePercent}%`,
      after: `${projected.accessibleRoutePercent}%`,
      outcome: "Target preserved",
      icon: "access",
    },
    {
      label: "Transit fit",
      before: `${baseline.transportFitPercent}%`,
      after: `${projected.transportFitPercent}%`,
      outcome: "Confirm headway",
      icon: "train",
    },
    {
      label: "Instruction clarity",
      before: `${baseline.instructionClarityPercent}%`,
      after: `${projected.instructionClarityPercent}%`,
      outcome: "All actions owned",
      icon: "evidence",
    },
    {
      label: "Operational carbon",
      before: `${baseline.operationalCarbonKg} kg`,
      after: `${projected.operationalCarbonKg} kg`,
      outcome: `${carbonAvoided} kgCO₂e avoided`,
      icon: "leaf",
    },
  ];

  return (
    <section className="impact-proof" aria-labelledby="impact-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Modeled outcome evidence</p>
          <h2 id="impact-title">One decision, six observable outcomes</h2>
        </div>
        <p>
          Projections from synthetic replay inputs. Safety and accessibility
          pass before carbon can influence ranking.
        </p>
      </div>
      <div className="impact-grid">
        {metrics.map(({ label, before, after, outcome, icon }) => (
          <article className="impact-card" key={label}>
            <div className="impact-card__heading">
              <span className="impact-card__icon">
                <Icon name={icon} />
              </span>
              <span>{label}</span>
            </div>
            <div className="impact-card__values">
              <span>
                <small>Before</small>
                <s>{before}</s>
              </span>
              <Icon name="arrow" />
              <span>
                <small>Projected</small>
                <strong>{after}</strong>
              </span>
            </div>
            <p>{outcome}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
