import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "../../src/presentation/components/ErrorBoundary";

function BrokenChild(): React.JSX.Element {
  throw new Error("synthetic render failure");
}

describe("ErrorBoundary", () => {
  it("fails closed with a recovery explanation", () => {
    const errorOutput = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", {
        name: "The decision workspace could not render.",
      }),
    ).toBeVisible();
    expect(
      screen.getByText("No operational action was sent.", { exact: false }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Reload workspace" }),
    ).toBeVisible();
    errorOutput.mockRestore();
  });
});
