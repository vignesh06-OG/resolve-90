export type IncidentId = string;
export type EvidenceId = string;

export type EvidenceFreshness = "fresh" | "stale";
export type SignalCategory =
  "accessibility" | "crowd" | "operations" | "sustainability" | "transport";

export interface EvidenceItem {
  readonly id: EvidenceId;
  readonly title: string;
  readonly source: string;
  readonly observedAt: string;
  readonly freshness: EvidenceFreshness;
  readonly excerpt: string;
}

export interface IncidentSignal {
  readonly id: string;
  readonly category: SignalCategory;
  readonly label: string;
  readonly value: string;
  readonly severity: "critical" | "elevated" | "watch";
  readonly evidenceId: EvidenceId;
}

export interface OperationalConstraints {
  readonly maximumPressureRatio: number;
  readonly minimumAccessibleRoutePercent: number;
  readonly targetAccessibleRoutePercent: number;
  readonly minimumTransportFitPercent: number;
  readonly maximumDecisionLatencySeconds: number;
}

export interface BaselineImpact {
  readonly decisionLatencySeconds: number;
  readonly peakPressureRatio: number;
  readonly accessibleRoutePercent: number;
  readonly transportFitPercent: number;
  readonly instructionClarityPercent: number;
  readonly operationalCarbonKg: number;
}

export interface IncidentContext {
  readonly id: IncidentId;
  readonly code: string;
  readonly title: string;
  readonly summary: string;
  readonly venue: string;
  readonly event: string;
  readonly receivedAt: string;
  readonly zone: string;
  readonly affectedPeople: number;
  readonly signals: readonly IncidentSignal[];
  readonly evidence: readonly EvidenceItem[];
  readonly constraints: OperationalConstraints;
  readonly baseline: BaselineImpact;
}
