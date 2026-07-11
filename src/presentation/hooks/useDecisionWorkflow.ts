import { useCallback, useMemo, useState } from "react";

import type {
  ApprovalAcknowledgement,
  ApprovedDecision,
  CompiledDecision,
  GenerationMode,
} from "../../domain/entities/decision";
import { createApplicationServices } from "../../infrastructure/createApplicationServices";
import { EAST_CONCOURSE_INCIDENT } from "../../infrastructure/repositories/replayScenario";

export type DecisionWorkflowState =
  | { readonly status: "idle" }
  | { readonly status: "compiling" }
  | { readonly status: "compiled"; readonly decision: CompiledDecision }
  | { readonly status: "approved"; readonly decision: ApprovedDecision }
  | { readonly status: "error"; readonly message: string };

export interface DecisionWorkflow {
  readonly state: DecisionWorkflowState;
  readonly mode: GenerationMode;
  readonly compile: () => Promise<void>;
  readonly approve: (
    acknowledgement: ApprovalAcknowledgement,
  ) => Promise<boolean>;
  readonly reset: () => void;
}

export function useDecisionWorkflow(): DecisionWorkflow {
  const mode: GenerationMode =
    import.meta.env.VITE_DECISION_API_MODE === "live" ? "live" : "replay";
  const apiUrl = import.meta.env.VITE_DECISION_API_URL ?? "/api/compile";
  const services = useMemo(
    () => createApplicationServices({ mode, apiUrl }),
    [apiUrl, mode],
  );
  const [state, setState] = useState<DecisionWorkflowState>({ status: "idle" });

  const compile = useCallback(async (): Promise<void> => {
    setState({ status: "compiling" });
    const result = await services.compileIncident.execute(
      EAST_CONCOURSE_INCIDENT.id,
    );

    setState(
      result.ok
        ? { status: "compiled", decision: result.value }
        : { status: "error", message: result.error.message },
    );
  }, [services]);

  const approve = useCallback(
    async (acknowledgement: ApprovalAcknowledgement): Promise<boolean> => {
      if (state.status !== "compiled") return false;

      const result = await services.approveDecision.execute(
        state.decision,
        acknowledgement,
      );
      setState(
        result.ok
          ? { status: "approved", decision: result.value }
          : { status: "error", message: result.error.message },
      );
      return result.ok;
    },
    [services, state],
  );

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return { state, mode, compile, approve, reset };
}
