import type { DecisionProvider } from "../../application/ports/DecisionProvider";
import type { GeneratedResponse } from "../../domain/entities/decision";
import type { IncidentContext } from "../../domain/entities/incident";
import type { Result } from "../../shared/types/result";
import { success } from "../../shared/types/result";
import { REPLAY_GENERATION } from "../repositories/replayScenario";

export class ReplayDecisionProvider implements DecisionProvider {
  generate(
    incident: IncidentContext,
  ): Promise<Result<GeneratedResponse, never>> {
    void incident;
    return Promise.resolve(success(REPLAY_GENERATION));
  }
}
