import { createApproveCompiledDecision } from "../application/use-cases/approveCompiledDecision";
import { createCompileIncident } from "../application/use-cases/compileIncident";
import type { ApproveCompiledDecision } from "../application/use-cases/approveCompiledDecision";
import type { CompileIncident } from "../application/use-cases/compileIncident";
import type { GenerationMode } from "../domain/entities/decision";
import { LazyGatewayDecisionProvider } from "./ai/LazyGatewayDecisionProvider";
import { ReplayDecisionProvider } from "./ai/ReplayDecisionProvider";
import { InMemoryAuditPort } from "./repositories/InMemoryAuditPort";
import { ReplayIncidentRepository } from "./repositories/ReplayIncidentRepository";
import {
  BrowserClock,
  RandomIdGenerator,
} from "./telemetry/BrowserSystemPorts";

export interface ApplicationServices {
  readonly compileIncident: CompileIncident;
  readonly approveDecision: ApproveCompiledDecision;
}

export interface ApplicationConfiguration {
  readonly mode: GenerationMode;
  readonly apiUrl: string;
}

export function createApplicationServices(
  configuration: ApplicationConfiguration,
): ApplicationServices {
  const clock = new BrowserClock();
  const ids = new RandomIdGenerator();
  const audit = new InMemoryAuditPort();
  const incidents = new ReplayIncidentRepository();
  const provider =
    configuration.mode === "live"
      ? new LazyGatewayDecisionProvider(configuration.apiUrl)
      : new ReplayDecisionProvider();

  return {
    compileIncident: createCompileIncident({
      incidents,
      provider,
      clock,
      ids,
    }),
    approveDecision: createApproveCompiledDecision({ audit, clock, ids }),
  };
}
