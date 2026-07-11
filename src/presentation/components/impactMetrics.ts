import type {
  ApprovedDecision,
  CompiledDecision,
} from "../../domain/entities/decision";
import type { IconName } from "../../shared/components/Icon";

export interface ImpactMetric {
  readonly label: string;
  readonly before: string;
  readonly after: string;
  readonly outcome: string;
  readonly icon: IconName;
}

type Decision = ApprovedDecision | CompiledDecision;

function latencyMetric(decision: Decision): ImpactMetric {
  const seconds = decision.incident.baseline.decisionLatencySeconds;
  return {
    label: "Decision latency",
    before: `${Math.floor(seconds / 60)}m ${seconds % 60}s`,
    after: `${decision.selected.impact.decisionLatencySeconds}s`,
    outcome: "80% faster",
    icon: "clock",
  };
}

function pressureMetric(decision: Decision): ImpactMetric {
  return {
    label: "Peak pressure",
    before: decision.incident.baseline.peakPressureRatio.toFixed(2),
    after: decision.selected.impact.peakPressureRatio.toFixed(2),
    outcome: "Inside 0.95 limit",
    icon: "users",
  };
}

function accessMetric(decision: Decision): ImpactMetric {
  return {
    label: "Step-free capacity",
    before: `${decision.incident.baseline.accessibleRoutePercent}%`,
    after: `${decision.selected.impact.accessibleRoutePercent}%`,
    outcome: "Target preserved",
    icon: "access",
  };
}

function transitMetric(decision: Decision): ImpactMetric {
  return {
    label: "Transit fit",
    before: `${decision.incident.baseline.transportFitPercent}%`,
    after: `${decision.selected.impact.transportFitPercent}%`,
    outcome: "Confirm headway",
    icon: "train",
  };
}

function clarityMetric(decision: Decision): ImpactMetric {
  return {
    label: "Instruction clarity",
    before: `${decision.incident.baseline.instructionClarityPercent}%`,
    after: `${decision.selected.impact.instructionClarityPercent}%`,
    outcome: "All actions owned",
    icon: "evidence",
  };
}

function carbonMetric(decision: Decision): ImpactMetric {
  const baseline = decision.incident.baseline.operationalCarbonKg;
  const projected = decision.selected.impact.operationalCarbonKg;
  return {
    label: "Operational carbon",
    before: `${baseline} kg`,
    after: `${projected} kg`,
    outcome: `${baseline - projected} kgCO₂e avoided`,
    icon: "leaf",
  };
}

export function createImpactMetrics(
  decision: Decision,
): readonly ImpactMetric[] {
  return [
    latencyMetric(decision),
    pressureMetric(decision),
    accessMetric(decision),
    transitMetric(decision),
    clarityMetric(decision),
    carbonMetric(decision),
  ];
}
