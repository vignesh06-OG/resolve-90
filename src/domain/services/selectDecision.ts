import type {
  EvaluatedCandidate,
  GeneratedCandidate,
} from "../entities/decision";
import type { IncidentContext } from "../entities/incident";
import type { Result } from "../../shared/types/result";
import { failure, success } from "../../shared/types/result";
import { evaluateCandidate } from "./evaluateCandidate";

export interface CandidateSelection {
  readonly selected: EvaluatedCandidate;
  readonly alternatives: readonly EvaluatedCandidate[];
}

export type SelectionError = {
  readonly code: "NO_SAFE_PLAN";
  readonly message: string;
  readonly evaluated: readonly EvaluatedCandidate[];
};

function byEligibilityThenScore(
  left: EvaluatedCandidate,
  right: EvaluatedCandidate,
): number {
  if (left.disposition !== right.disposition) {
    return left.disposition === "eligible" ? -1 : 1;
  }

  return right.score - left.score;
}

export function selectDecision(
  candidates: readonly GeneratedCandidate[],
  incident: IncidentContext,
): Result<CandidateSelection, SelectionError> {
  const evaluated = candidates
    .map((candidate) => evaluateCandidate(candidate, incident))
    .sort(byEligibilityThenScore);
  const selected = evaluated.find(
    ({ disposition }) => disposition === "eligible",
  );

  if (selected === undefined) {
    return failure({
      code: "NO_SAFE_PLAN",
      message:
        "Generation completed, but every candidate violated a hard operational constraint.",
      evaluated,
    });
  }

  return success({
    selected,
    alternatives: evaluated.filter(({ id }) => id !== selected.id),
  });
}
