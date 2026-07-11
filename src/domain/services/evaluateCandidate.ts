import type {
  EvaluatedCandidate,
  GeneratedCandidate,
} from "../entities/decision";
import type { IncidentContext } from "../entities/incident";
import {
  checkAccessibility,
  checkActionability,
  checkEvidence,
  checkSafety,
  checkTransport,
} from "./candidateChecks";
import { calculateCandidateScore } from "./candidateScore";

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
    score: calculateCandidateScore(candidate, incident),
    disposition: failed === undefined ? "eligible" : "rejected",
    rejectionReason: failed?.detail ?? null,
  };
}
