import type { IncidentRepository } from "../../application/ports/IncidentRepository";
import type {
  IncidentContext,
  IncidentId,
} from "../../domain/entities/incident";
import { EAST_CONCOURSE_INCIDENT } from "./replayScenario";

export class ReplayIncidentRepository implements IncidentRepository {
  async findById(id: IncidentId): Promise<IncidentContext | null> {
    return Promise.resolve(
      id === EAST_CONCOURSE_INCIDENT.id ? EAST_CONCOURSE_INCIDENT : null,
    );
  }
}
