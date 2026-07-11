import type { GeneratedResponse } from "../../domain/entities/decision";
import type { IncidentContext } from "../../domain/entities/incident";
import type { Result } from "../../shared/types/result";

export type DecisionProviderError = {
  readonly code:
    "INVALID_PROVIDER_OUTPUT" | "PROVIDER_TIMEOUT" | "PROVIDER_UNAVAILABLE";
  readonly message: string;
};

export interface DecisionProvider {
  generate(
    incident: IncidentContext,
  ): Promise<Result<GeneratedResponse, DecisionProviderError>>;
}
