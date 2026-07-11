import type {
  GeneratedCandidate,
  GuardrailCategory,
  GuardrailCheck,
  MessageLocale,
  PlanAction,
} from "../entities/decision";
import type { EvidenceItem, IncidentContext } from "../entities/incident";

const REQUIRED_LOCALES = new Set<MessageLocale>(["en", "es", "fr"]);
const BINARY_STATUS = { true: "pass", false: "fail" } as const;

function binaryCheck(input: {
  readonly id: string;
  readonly category: GuardrailCategory;
  readonly label: string;
  readonly passed: boolean;
  readonly passedDetail: string;
  readonly failedDetail: string;
}): GuardrailCheck {
  const key = String(input.passed) as "true" | "false";
  const detail = { true: input.passedDetail, false: input.failedDetail }[key];
  return {
    id: input.id,
    category: input.category,
    label: input.label,
    status: BINARY_STATUS[key],
    detail,
  };
}

export function checkSafety(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const pressure = candidate.impact.peakPressureRatio;
  const limit = incident.constraints.maximumPressureRatio;
  return binaryCheck({
    id: "safe-pressure",
    category: "safety",
    label: "Crowd pressure remains inside the operating envelope",
    passed: pressure <= limit,
    passedDetail: `${pressure.toFixed(2)} projected ratio is at or below the ${limit.toFixed(2)} limit.`,
    failedDetail: `${pressure.toFixed(2)} would exceed the ${limit.toFixed(2)} safe operating limit.`,
  });
}

export function checkAccessibility(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const capacity = candidate.impact.accessibleRoutePercent;
  const {
    minimumAccessibleRoutePercent: minimum,
    targetAccessibleRoutePercent: target,
  } = incident.constraints;
  if (capacity < minimum)
    return {
      id: "protected-access",
      category: "accessibility",
      label: "Protected step-free capacity",
      status: "fail",
      detail: `${capacity}% would breach the ${minimum}% accessibility floor.`,
    };
  const targetMet = capacity >= target;
  return {
    id: "protected-access",
    category: "accessibility",
    label: "Protected step-free capacity",
    status: targetMet ? "pass" : "warn",
    detail: targetMet
      ? `${capacity}% preserves the ${target}% accessibility target.`
      : `${capacity}% passes the floor but remains below the ${target}% target.`,
  };
}

function staleTransportEvidence(incident: IncidentContext): boolean {
  const ids = new Set(
    incident.signals
      .filter(({ category }) => category === "transport")
      .map(({ evidenceId }) => evidenceId),
  );
  function isStale(item: EvidenceItem): boolean {
    return ids.has(item.id) && item.freshness === "stale";
  }
  return incident.evidence.some(isStale);
}

function transportDetail(stale: boolean, fit: number, minimum: number): string {
  const details = {
    true: `${fit}% modeled fit; headway evidence is stale, so the transport liaison must confirm it.`,
    false: `${fit}% modeled fit against a ${minimum}% minimum.`,
  };
  return details[String(stale) as "true" | "false"];
}

function transportStatus(
  stale: boolean,
  fit: number,
  minimum: number,
): "pass" | "warn" {
  if (stale) return "warn";
  return fit >= minimum ? "pass" : "warn";
}

export function checkTransport(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const stale = staleTransportEvidence(incident);
  const fit = candidate.impact.transportFitPercent;
  const minimum = incident.constraints.minimumTransportFitPercent;
  if (stale && candidate.confidence === "high")
    return {
      id: "transport-freshness",
      category: "transport",
      label: "Transport fit and evidence freshness",
      status: "fail",
      detail:
        "High confidence is prohibited while transport headway evidence is stale.",
    };
  return {
    id: "transport-freshness",
    category: "transport",
    label: "Transport fit and evidence freshness",
    status: transportStatus(stale, fit, minimum),
    detail: transportDetail(stale, fit, minimum),
  };
}

function completeAction(action: PlanAction): boolean {
  return (
    [action.owner, action.location, action.instruction, action.fallback].every(
      (value) => value.trim().length > 0,
    ) &&
    action.dueInSeconds > 0 &&
    action.evidenceIds.length > 0
  );
}

export function checkActionability(
  candidate: GeneratedCandidate,
): GuardrailCheck {
  const locales = new Set(candidate.messages.map(({ locale }) => locale));
  const messagesComplete = [...REQUIRED_LOCALES].every((locale) =>
    locales.has(locale),
  );
  const actionsComplete =
    candidate.actions.length > 0 && candidate.actions.every(completeAction);
  return binaryCheck({
    id: "action-completeness",
    category: "actionability",
    label: "Owners, fallbacks, deadlines, and language variants",
    passed: actionsComplete && messagesComplete,
    passedDetail: `${candidate.actions.length} owned actions and all 3 priority language variants are complete.`,
    failedDetail:
      "Every action needs an owner, place, deadline, fallback, evidence, and all priority language variants.",
  });
}

export function checkEvidence(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): GuardrailCheck {
  const valid = new Set(incident.evidence.map(({ id }) => id));
  const referenced = new Set([
    ...candidate.evidenceIds,
    ...candidate.actions.flatMap(({ evidenceIds }) => evidenceIds),
  ]);
  const invalid = [...referenced].filter((id) => !valid.has(id));
  const suffix = invalid.length === 1 ? "" : "s";
  return binaryCheck({
    id: "grounded-evidence",
    category: "evidence",
    label: "Evidence references exist in the grounded context",
    passed: referenced.size > 0 && invalid.length === 0,
    passedDetail: `${referenced.size} grounded evidence references verified.`,
    failedDetail: `${invalid.length} unsupported evidence reference${suffix} detected.`,
  });
}
