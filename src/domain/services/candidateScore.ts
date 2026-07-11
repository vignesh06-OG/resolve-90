import type { GeneratedCandidate } from "../entities/decision";
import type { IncidentContext } from "../entities/incident";

const SCORE_WEIGHT = {
  pressure: 35,
  accessibility: 25,
  transport: 15,
  clarity: 10,
  latency: 10,
  sustainability: 5,
} as const;
const PERCENT = 100;

function capped(value: number, maximum: number): number {
  return Math.max(0, Math.min(maximum, value));
}

function percentageScore(value: number, weight: number): number {
  return Math.min(weight, (value / PERCENT) * weight);
}

function pressureScore(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): number {
  const improvement =
    (incident.baseline.peakPressureRatio - candidate.impact.peakPressureRatio) /
    (incident.baseline.peakPressureRatio -
      incident.constraints.maximumPressureRatio);
  return capped(improvement * SCORE_WEIGHT.pressure, SCORE_WEIGHT.pressure);
}

function sustainabilityScore(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): number {
  const improvement = Math.max(
    0,
    incident.baseline.operationalCarbonKg -
      candidate.impact.operationalCarbonKg,
  );
  const weighted = (improvement / incident.baseline.operationalCarbonKg) * 20;
  return Math.min(SCORE_WEIGHT.sustainability, weighted);
}

export function calculateCandidateScore(
  candidate: GeneratedCandidate,
  incident: IncidentContext,
): number {
  const latencyMet =
    candidate.impact.decisionLatencySeconds <=
    incident.constraints.maximumDecisionLatencySeconds;
  const latency = Number(latencyMet) * SCORE_WEIGHT.latency;
  const scores = [
    pressureScore(candidate, incident),
    percentageScore(
      candidate.impact.accessibleRoutePercent,
      SCORE_WEIGHT.accessibility,
    ),
    percentageScore(
      candidate.impact.transportFitPercent,
      SCORE_WEIGHT.transport,
    ),
    percentageScore(
      candidate.impact.instructionClarityPercent,
      SCORE_WEIGHT.clarity,
    ),
    latency,
    sustainabilityScore(candidate, incident),
  ];
  return Math.round(scores.reduce((total, score) => total + score, 0));
}
