import type { EvidenceId, IncidentContext } from "./incident";

export type OperationalRole =
  | "Accessibility lead"
  | "Crowd lead"
  | "Gate supervisor"
  | "Mobility lead"
  | "Transport liaison"
  | "Volunteer captain";

export type MessageLocale = "en" | "es" | "fr";
export type DecisionConfidence = "high" | "medium" | "low";
export type GenerationMode = "live" | "replay";

export interface PlanAction {
  readonly id: string;
  readonly sequence: number;
  readonly owner: OperationalRole;
  readonly location: string;
  readonly instruction: string;
  readonly dueInSeconds: number;
  readonly fallback: string;
  readonly evidenceIds: readonly EvidenceId[];
}

export interface FanMessage {
  readonly locale: MessageLocale;
  readonly localeLabel: string;
  readonly headline: string;
  readonly body: string;
  readonly accessibleAlternative: string;
  readonly humanReviewRequired: boolean;
}

export interface ImpactProjection {
  readonly decisionLatencySeconds: number;
  readonly peakPressureRatio: number;
  readonly accessibleRoutePercent: number;
  readonly transportFitPercent: number;
  readonly instructionClarityPercent: number;
  readonly operationalCarbonKg: number;
}

export interface GeneratedCandidate {
  readonly id: string;
  readonly title: string;
  readonly strategy: string;
  readonly confidence: DecisionConfidence;
  readonly rationale: string;
  readonly actions: readonly PlanAction[];
  readonly messages: readonly FanMessage[];
  readonly impact: ImpactProjection;
  readonly evidenceIds: readonly EvidenceId[];
}

export interface GenerationReceipt {
  readonly mode: GenerationMode;
  readonly provider: string;
  readonly model: string;
  readonly promptVersion: string;
  readonly generatedAt: string;
  readonly note: string;
}

export interface GeneratedResponse {
  readonly candidates: readonly GeneratedCandidate[];
  readonly receipt: GenerationReceipt;
}

export type GuardrailCategory =
  "accessibility" | "actionability" | "evidence" | "safety" | "transport";

export interface GuardrailCheck {
  readonly id: string;
  readonly category: GuardrailCategory;
  readonly label: string;
  readonly status: "pass" | "warn" | "fail";
  readonly detail: string;
}

export interface EvaluatedCandidate extends GeneratedCandidate {
  readonly checks: readonly GuardrailCheck[];
  readonly score: number;
  readonly disposition: "eligible" | "rejected";
  readonly rejectionReason: string | null;
}

export interface CompiledDecision {
  readonly id: string;
  readonly incident: IncidentContext;
  readonly selected: EvaluatedCandidate;
  readonly alternatives: readonly EvaluatedCandidate[];
  readonly receipt: GenerationReceipt;
  readonly compiledAt: string;
  readonly state: "awaiting-approval";
}

export interface ApprovalAcknowledgement {
  readonly understandsModeledImpact: boolean;
  readonly reviewedAccessibility: boolean;
}

export interface AuditEvent {
  readonly id: string;
  readonly decisionId: string;
  readonly type: "decision-approved";
  readonly at: string;
  readonly summary: string;
}

export interface ApprovedDecision extends Omit<CompiledDecision, "state"> {
  readonly state: "approved";
  readonly approvedAt: string;
  readonly auditEvent: AuditEvent;
}
