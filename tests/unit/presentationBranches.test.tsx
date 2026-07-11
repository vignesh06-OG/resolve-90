import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ApprovedDecision } from "../../src/domain/entities/decision";
import { approveDecision } from "../../src/domain/services/approveDecision";
import { ApprovalPanel } from "../../src/presentation/components/ApprovalPanel";
import { IncidentBrief } from "../../src/presentation/components/IncidentBrief";
import { OperationalFlow } from "../../src/presentation/components/OperationalFlow";
import { RelayPanel } from "../../src/presentation/components/RelayPanel";
import { navigate } from "../../src/presentation/routes/router";
import { AppLink } from "../../src/shared/components/AppLink";
import { buildCompiledDecision, buildIncident } from "../fixtures/builders";

function buildApprovedDecision(): ApprovedDecision {
  const result = approveDecision(
    buildCompiledDecision(),
    { understandsModeledImpact: true, reviewedAccessibility: true },
    {
      approvedAt: "2026-07-11T18:43:10.000Z",
      auditEventId: "audit-approved",
    },
  );
  if (!result.ok) throw new Error("Fixture approval failed.");
  return result.value;
}

describe("presentation failure and terminal branches", () => {
  it("labels compiling, compiled, approved, and error states explicitly", () => {
    const compile = vi.fn().mockResolvedValue(undefined);
    const reset = vi.fn();
    const states = [
      {
        state: { status: "compiling" } as const,
        label: "Compiling and validating…",
      },
      {
        state: {
          status: "compiled",
          decision: buildCompiledDecision(),
        } as const,
        label: "Response ready below",
      },
      {
        state: {
          status: "approved",
          decision: buildApprovedDecision(),
        } as const,
        label: "Response approved",
      },
    ];

    for (const { state, label } of states) {
      const view = render(
        <IncidentBrief
          incident={buildIncident()}
          state={state}
          onCompile={compile}
          onReset={reset}
        />,
      );
      expect(screen.getByRole("button", { name: label })).toBeDisabled();
      view.unmount();
    }

    render(
      <IncidentBrief
        incident={buildIncident()}
        state={{ status: "error", message: "Provider unavailable." }}
        onCompile={compile}
        onReset={reset}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Retry stable replay" }),
    ).toBeEnabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Provider unavailable.",
    );
  });

  it("retries the stable replay through the explicit error control", async () => {
    const compile = vi.fn().mockResolvedValue(undefined);
    const reset = vi.fn();
    render(
      <IncidentBrief
        incident={buildIncident()}
        state={{ status: "error", message: "Provider unavailable." }}
        onCompile={compile}
        onReset={reset}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Retry stable replay" }),
    );

    expect(reset).toHaveBeenCalledOnce();
    expect(compile).toHaveBeenCalledOnce();
  });

  it("renders a fully pending operational flow after a typed failure", () => {
    const { container } = render(
      <OperationalFlow state={{ status: "error", message: "No safe plan." }} />,
    );

    expect(container.querySelectorAll(".flow-step--pending")).toHaveLength(7);
  });

  it("keeps the approval panel in place when application approval fails", async () => {
    const onApprove = vi.fn().mockResolvedValue(false);
    render(
      <ApprovalPanel
        decision={buildCompiledDecision()}
        onApprove={onApprove}
      />,
    );
    await userEvent.click(screen.getByLabelText(/Modeled impact reviewed/));
    await userEvent.click(
      screen.getByLabelText(/Accessibility validation reviewed/),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Approve plan and unlock relay" }),
    );

    expect(onApprove).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("heading", {
        name: "The model cannot press this button.",
      }),
    ).toBeVisible();
  });

  it("renders no relay when a validated locale cannot be found", () => {
    const decision = buildApprovedDecision();
    const { container } = render(
      <RelayPanel
        decision={{
          ...decision,
          selected: { ...decision.selected, messages: [] },
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe("navigation guard branches", () => {
  it("does not push duplicate history for the current path", () => {
    window.history.replaceState(null, "", "/quality");
    const push = vi.spyOn(window.history, "pushState");

    navigate("/quality");

    expect(push).not.toHaveBeenCalled();
    push.mockRestore();
  });

  it("preserves modified and explicitly prevented link behavior", () => {
    window.history.replaceState(null, "", "/");
    const push = vi.spyOn(window.history, "pushState");
    const prevent = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });
    const { rerender } = render(
      <AppLink href="/quality" onClick={prevent}>
        Prevented
      </AppLink>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Prevented" }));
    expect(push).not.toHaveBeenCalled();

    rerender(
      <AppLink href="/quality" target="_blank">
        New tab
      </AppLink>,
    );
    fireEvent.click(screen.getByRole("link", { name: "New tab" }), {
      ctrlKey: true,
    });
    expect(push).not.toHaveBeenCalled();
    push.mockRestore();
  });
});
