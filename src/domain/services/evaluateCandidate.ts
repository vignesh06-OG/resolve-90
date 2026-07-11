import type {
  EvaluatedCandidate,
  GeneratedCandidate,
  GuardrailCheck,
  MessageLocale,
} from "../entities/decision";
import type { IncidentContext } from "../entities/incident";

const REQUIRED_LOCALES = new Set<MessageLocale>(["en", "es", "fr"]);

function checkSafety(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const { peakPressureRatio } = candidate.impact;
  const limit = incident.constraints.maximumPressureRatio;
  const passed = peakPressureRatio <= limit;

  return {
    id: "safe-pressure",
    category: "safety",
    label: "Crowd pressure remains inside the operating envelope",
    status: passed ? "pass" : "fail",
    detail: passed
      ? `${peakPressureRatio.toFixed(2)} projected ratio is at or below the ${limit.toFixed(2)} limit.`
      : `${peakPressureRatio.toFixed(2)} would exceed the ${limit.toFixed(2)} safe operating limit.`,
  };
}

function checkAccessibility(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const capacity = candidate.impact.accessibleRoutePercent;
  const minimum = incident.constraints.minimumAccessibleRoutePercent;
  const target = incident.constraints.targetAccessibleRoutePercent;

  if (capacity < minimum) {
    return {
      id: "protected-access",
      category: "accessibility",
      label: "Protected step-free capacity",
      status: "fail",
      detail: `${capacity}% would breach the ${minimum}% accessibility floor.`,
    };
  }

  return {
    id: "protected-access",
    category: "accessibility",
    label: "Protected step-free capacity",
    status: capacity >= target ? "pass" : "warn",
    detail:
      capacity >= target
        ? `${capacity}% preserves the ${target}% accessibility target.`
        : `${capacity}% passes the floor but remains below the ${target}% target.`,
  };
}

function checkTransport(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const transportEvidenceIds = new Set(
    incident.signals
      .filter(({ category }) => category === "transport")
      .map(({ evidenceId }) => evidenceId),
  );
  const hasStaleTransportEvidence = incident.evidence.some(
    ({ id, freshness }) =>
      transportEvidenceIds.has(id) && freshness === "stale",
  );
  const fit = candidate.impact.transportFitPercent;
  const minimum = incident.constraints.minimumTransportFitPercent;

  if (hasStaleTransportEvidence && candidate.confidence === "high") {
    return {
      id: "transport-freshness",
      category: "transport",
      label: "Transport fit and evidence freshness",
      status: "fail",
      detail:
        "High confidence is prohibited while transport headway evidence is stale.",
    };
  }

  return {
    id: "transport-freshness",
    category: "transport",
    label: "Transport fit and evidence freshness",
    status: fit >= minimum && !hasStaleTransportEvidence ? "pass" : "warn",
    detail: hasStaleTransportEvidence
      ? `${fit}% modeled fit; headway evidence is stale, so the transport liaison must confirm it.`
      : `${fit}% modeled fit against a ${minimum}% minimum.`,
  };
}

function isCompleteAction(candidate: GeneratedCandidate): boolean {
  return candidate.actions.every(
    ({ owner, location, instruction, dueInSeconds, fallback, evidenceIds }) =>
      owner.trim().length > 0 &&
      location.trim().length > 0 &&
      instruction.trim().length > 0 &&
      dueInSeconds > 0 &&
      fallback.trim().length > 0 &&
      evidenceIds.length > 0,
  );
}

function checkActionability(candidate: GeneratedCandidate): GuardrailCheck {
  const messageLocales = new Set(
    candidate.messages.map(({ locale }) => locale),
  );
  const messagesAreComplete = [...REQUIRED_LOCALES].every((locale) =>
    messageLocales.has(locale),
  );
  const actionsAreComplete =
    candidate.actions.length > 0 && isCompleteAction(candidate);
  const passed = actionsAreComplete && messagesAreComplete;

  return {
    id: "action-completeness",
    category: "actionability",
    label: "Owners, fallbacks, deadlines, and language variants",
    status: passed ? "pass" : "fail",
    detail: passed
      ? `${candidate.actions.length} owned actions and all 3 priority language variants are complete.`
      : "Every action needs an owner, place, deadline, fallback, evidence, and all priority language variants.",
  };
}

function checkEvidence(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const validEvidenceIds = new Set(incident.evidence.map(({ id }) => id));
  const referencedEvidenceIds = new Set([
    ...candidate.evidenceIds,
    ...candidate.actions.flatMap(({ evidenceIds }) => evidenceIds),
  ]);
  const invalid = [...referencedEvidenceIds].filter(
    (id) => !validEvidenceIds.has(id),
  );
  const passed = referencedEvidenceIds.size > 0 && invalid.length === 0;

  return {
    id: "grounded-evidence",
    category: "evidence",
    label: "Evidence references exist in the grounded context",
    status: passed ? "pass" : "fail",
    detail: passed
      ? `${referencedEvidenceIds.size} grounded evidence references verified.`
      : `${invalid.length} unsupported evidence reference${invalid.length === 1 ? "" : "s"} detected.`,
  };
}

function calculateScore(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): number {
  const pressureImprovement =
    (incident.baseline.peakPressureRatio - candidate.impact.peakPressureRatio) /
    (incident.baseline.peakPressureRatio -
      incident.constraints.maximumPressureRatio);
  const pressureScore = Math.max(0, Math.min(35, pressureImprovement * 35));
  const accessibilityScore = Math.min(
    25,
    (candidate.impact.accessibleRoutePercent / 100) * 25,
  );
  const transportScore = Math.min(
    15,
    (candidate.impact.transportFitPercent / 100) * 15,
  );
  const clarityScore = Math.min(
    10,
    (candidate.impact.instructionClarityPercent / 100) * 10,
  );
  const latencyScore =
    candidate.impact.decisionLatencySeconds <=
    incident.constraints.maximumDecisionLatencySeconds
      ? 10
      : 0;
  const carbonImprovement = Math.max(
    0,
    incident.baseline.operationalCarbonKg -
      candidate.impact.operationalCarbonKg,
  );
  const sustainabilityScore = Math.min(
    5,
    (carbonImprovement / incident.baseline.operationalCarbonKg) * 20,
  );

  return Math.round(
    pressureScore +
      accessibilityScore +
      transportScore +
      clarityScore +
      latencyScore +
      sustainabilityScore,
  );
}

export function evaluateCandidate(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): EvaluatedCandidate {
  const checks = [
    checkSafety(candidate, incident),
    checkAccessibility(candidate, incident),
    checkTransport(candidate, incident),
    checkActionability(candidate),
    checkEvidence(candidate, incident),
  ];
  const failed = checks.find(({ status }) => status === "fail");

  return {
    ...candidate,
    checks,
    score: calculateScore(candidate, incident),
    disposition: failed === undefined ? "eligible" : "rejected",
    rejectionReason: failed?.detail ?? null,
  };
}
