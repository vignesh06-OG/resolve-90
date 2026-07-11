import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useDecisionWorkflow } from "../../src/presentation/hooks/useDecisionWorkflow";

function WorkflowHarness(): React.JSX.Element {
  const workflow = useDecisionWorkflow();
  return (
    <div>
      <output aria-label="workflow state">{workflow.state.status}</output>
      <button type="button" onClick={() => void workflow.compile()}>
        compile
      </button>
      <button
        type="button"
        onClick={() =>
          void workflow.approve({
            understandsModeledImpact: true,
            reviewedAccessibility: true,
          })
        }
      >
        approve
      </button>
      <button type="button" onClick={workflow.reset}>
        reset
      </button>
    </div>
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("useDecisionWorkflow", () => {
  it("ignores premature approval and supports an explicit reset", async () => {
    const user = userEvent.setup();
    render(<WorkflowHarness />);

    await user.click(screen.getByRole("button", { name: "approve" }));
    expect(screen.getByLabelText("workflow state")).toHaveTextContent("idle");

    await user.click(screen.getByRole("button", { name: "compile" }));
    expect(await screen.findByText("compiled")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "reset" }));
    expect(screen.getByLabelText("workflow state")).toHaveTextContent("idle");
  });

  it("surfaces a typed error when the live provider is unavailable", async () => {
    vi.stubEnv("VITE_DECISION_API_MODE", "live");
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("offline")),
    );
    render(<WorkflowHarness />);
    await userEvent.click(screen.getByRole("button", { name: "compile" }));
    expect(await screen.findByText("error")).toBeVisible();
  });
});
