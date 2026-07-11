import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

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
});
