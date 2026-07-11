import { useCallback, useMemo, useState } from "react";

import { createUiRuntime } from "../../bootstrap/createUiRuntime";
import type {
  ApprovalAcknowledgement,
  ApprovedDecision,
  CompiledDecision,
  GenerationMode,
} from "../../domain/entities/decision";
import type { IncidentContext } from "../../domain/entities/incident";

export type DecisionWorkflowState =
  | { readonly status: "idle" }
  | { readonly status: "compiling" }
  | { readonly status: "compiled"; readonly decision: CompiledDecision }
  | { readonly status: "approved"; readonly decision: ApprovedDecision }
  | { readonly status: "error"; readonly message: string };

export interface DecisionWorkflow {
  readonly state: DecisionWorkflowState;
  readonly mode: GenerationMode;
  readonly incident: IncidentContext;
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
  const runtime = useMemo(
    () => createUiRuntime({ mode, apiUrl }),
    [apiUrl, mode],
  );
  const [state, setState] = useState<DecisionWorkflowState>({ status: "idle" });

  const compile = useCallback(async (): Promise<void> => {
    setState({ status: "compiling" });
    const result = await runtime.services.compileIncident.execute(
      runtime.incident.id,
    );

    setState(
      result.ok
        ? { status: "compiled", decision: result.value }
        : { status: "error", message: result.error.message },
    );
  }, [runtime]);

  const approve = useCallback(
    async (acknowledgement: ApprovalAcknowledgement): Promise<boolean> => {
      if (state.status !== "compiled") return false;

      const result = await runtime.services.approveDecision.execute(
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
    [runtime, state],
  );

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return {
    state,
    mode,
    incident: runtime.incident,
    compile,
    approve,
    reset,
  };
}
