import type {
  DecisionProvider,
  DecisionProviderError,
} from "../../application/ports/DecisionProvider";
import type { GeneratedResponse } from "../../domain/entities/decision";
import type { IncidentContext } from "../../domain/entities/incident";
import type { Result } from "../../shared/types/result";
import { failure, success } from "../../shared/types/result";
import { generatedResponseSchema } from "./schemas";

const ERRORS = {
  unavailable: {
    code: "PROVIDER_UNAVAILABLE",
    message:
      "The live decision provider is unavailable. Switch to Replay mode and retry safely.",
  },
  invalid: {
    code: "INVALID_PROVIDER_OUTPUT",
    message:
      "The live provider returned an invalid packet. Nothing was sent for approval.",
  },
  timeout: {
    code: "PROVIDER_TIMEOUT",
    message: "The live provider timed out. No partial plan was accepted.",
  },
  network: {
    code: "PROVIDER_UNAVAILABLE",
    message:
      "The live provider could not be reached. Replay mode remains available.",
  },
} as const satisfies Record<string, DecisionProviderError>;

async function parseResponse(
  response: Response,
): Promise<Result<GeneratedResponse, DecisionProviderError>> {
  if (!response.ok) return failure(ERRORS.unavailable);
  const payload: unknown = await response.json();
  const parsed = generatedResponseSchema.safeParse(payload);
  return parsed.success ? success(parsed.data) : failure(ERRORS.invalid);
}

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
    const timeout = globalThis.setTimeout(
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
      return await parseResponse(response);
    } catch {
      const error = controller.signal.aborted ? ERRORS.timeout : ERRORS.network;
      return failure(error);
    } finally {
      globalThis.clearTimeout(timeout);
    }
  }
}
