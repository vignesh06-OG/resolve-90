import type {
  DecisionProvider,
  DecisionProviderError,
} from "../../application/ports/DecisionProvider";
import type { GeneratedResponse } from "../../domain/entities/decision";
import type { IncidentContext } from "../../domain/entities/incident";
import type { Result } from "../../shared/types/result";
import { failure, success } from "../../shared/types/result";
import { generatedResponseSchema } from "./schemas";

export class GatewayDecisionProvider implements DecisionProvider {
  constructor(
    private readonly endpoint: string,
    private readonly fetcher: typeof fetch = fetch,
    private readonly timeoutMilliseconds = 12_000,
  ) {}

  async generate(
    incident: IncidentContext,
  ): Promise<Result<GeneratedResponse, DecisionProviderError>> {
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      this.timeoutMilliseconds,
    );

    try {
      const response = await this.fetcher(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incident }),
        signal: controller.signal,
      });

      if (!response.ok) {
        return failure({
          code: "PROVIDER_UNAVAILABLE",
          message:
            "The live decision provider is unavailable. Switch to Replay mode and retry safely.",
        });
      }

      const payload: unknown = await response.json();
      const parsed = generatedResponseSchema.safeParse(payload);
      if (!parsed.success) {
        return failure({
          code: "INVALID_PROVIDER_OUTPUT",
          message:
            "The live provider returned an invalid packet. Nothing was sent for approval.",
        });
      }

      return success(parsed.data);
    } catch {
      return failure({
        code: controller.signal.aborted
          ? "PROVIDER_TIMEOUT"
          : "PROVIDER_UNAVAILABLE",
        message: controller.signal.aborted
          ? "The live provider timed out. No partial plan was accepted."
          : "The live provider could not be reached. Replay mode remains available.",
      });
    } finally {
      window.clearTimeout(timeout);
    }
  }
}
