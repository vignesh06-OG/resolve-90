import type {
  IncidentContext,
  IncidentId,
} from "../../domain/entities/incident";

export interface IncidentRepository {
  findById(id: IncidentId): Promise<IncidentContext | null>;
}
