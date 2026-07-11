import type { ApplicationServices } from "../infrastructure/createApplicationServices";
import { createApplicationServices } from "../infrastructure/createApplicationServices";
import type { IncidentContext } from "../domain/entities/incident";
import type { GenerationMode } from "../domain/entities/decision";
import { EAST_CONCOURSE_INCIDENT } from "../infrastructure/repositories/replayScenario";

export interface UiRuntime {
  readonly services: ApplicationServices;
  readonly incident: IncidentContext;
}

export function createUiRuntime(configuration: {
  readonly mode: GenerationMode;
  readonly apiUrl: string;
}): UiRuntime {
  return {
    services: createApplicationServices(configuration),
    incident: EAST_CONCOURSE_INCIDENT,
  };
}
