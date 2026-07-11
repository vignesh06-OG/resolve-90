import type {
  DecisionProvider,
  DecisionProviderError,
} from "../../application/ports/DecisionProvider";
import type { GeneratedResponse } from "../../domain/entities/decision";
import type { IncidentContext } from "../../domain/entities/incident";
import type { Result } from "../../shared/types/result";

export class LazyGatewayDecisionProvider implements DecisionProvider {
  constructor(private readonly endpoint: string) {}

  async generate(
    incident: IncidentContext,
  ): Promise<Result<GeneratedResponse, DecisionProviderError>> {
    const { GatewayDecisionProvider } =
      await import("./GatewayDecisionProvider");
    return new GatewayDecisionProvider(this.endpoint).generate(incident);
  }
}
