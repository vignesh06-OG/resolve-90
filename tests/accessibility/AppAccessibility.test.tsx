import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { App } from "../../src/App";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

async function expectNoAxeViolations(): Promise<void> {
  const result = await axe.run(document.body, {
    rules: {
      "color-contrast": { enabled: false },
      "landmark-unique": { enabled: true },
    },
  });
  expect(result.violations).toEqual([]);
}

describe("application accessibility", () => {
  it("has no detectable violations in the initial decision workspace", async () => {
    render(<App />);
    await screen.findByRole("heading", {
      name: "Stadium disruption in. Safe plan out.",
    });

    await expectNoAxeViolations();
  });

  it("has no detectable violations in the generated approval state", async () => {
    render(<App />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Compile guarded response" }),
    );
    await screen.findByRole("heading", {
      name: "What the model proposed. What code allowed.",
    });

    await expectNoAxeViolations();
  });

  it("supports arrow, Home, and End keys in multilingual tabs", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      await screen.findByRole("button", { name: "Compile guarded response" }),
    );
    await user.click(screen.getByLabelText(/Modeled impact reviewed/));
    await user.click(
      screen.getByLabelText(/Accessibility validation reviewed/),
    );
    await user.click(
      screen.getByRole("button", { name: "Approve plan and unlock relay" }),
    );

    const english = await screen.findByRole("tab", { name: "English" });
    english.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Español" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Français" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(english).toHaveFocus();
  });
});
