import type { DecisionProvider } from "../ports/DecisionProvider";
import type { IncidentRepository } from "../ports/IncidentRepository";
import type { Clock, IdGenerator } from "../ports/SystemPorts";
import type { CompiledDecision } from "../../domain/entities/decision";
import type { IncidentId } from "../../domain/entities/incident";
import { selectDecision } from "../../domain/services/selectDecision";
import type { Result } from "../../shared/types/result";
import { failure, success } from "../../shared/types/result";

export type CompileIncidentError = {
  readonly code: "INCIDENT_NOT_FOUND" | "NO_SAFE_PLAN" | "PROVIDER_FAILURE";
  readonly message: string;
};

export interface CompileIncident {
  execute(
    incidentId: IncidentId,
  ): Promise<Result<CompiledDecision, CompileIncidentError>>;
}

export interface CompileIncidentDependencies {
  readonly incidents: IncidentRepository;
  readonly provider: DecisionProvider;
  readonly clock: Clock;
  readonly ids: IdGenerator;
}

export function createCompileIncident(
  dependencies: CompileIncidentDependencies,
): CompileIncident {
  return {
    async execute(incidentId) {
      const incident = await dependencies.incidents.findById(incidentId);

      if (incident === null) {
        return failure({
          code: "INCIDENT_NOT_FOUND",
          message: `Incident ${incidentId} is not available.`,
        });
      }

      const generated = await dependencies.provider.generate(incident);
      if (!generated.ok) {
        return failure({
          code: "PROVIDER_FAILURE",
          message: generated.error.message,
        });
      }

      const selection = selectDecision(generated.value.candidates, incident);
      if (!selection.ok) {
        return failure({
          code: "NO_SAFE_PLAN",
          message: selection.error.message,
        });
      }

      return success({
        id: dependencies.ids.next("decision"),
        incident,
        selected: selection.value.selected,
        alternatives: selection.value.alternatives,
        receipt: generated.value.receipt,
        compiledAt: dependencies.clock.now(),
        state: "awaiting-approval",
      });
    },
  };
}
