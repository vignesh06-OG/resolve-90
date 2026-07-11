import { expect, test } from "@playwright/test";

test("commander can compile, review, approve, and verify an audit receipt", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Stadium disruption in. Safe plan out.",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Compile guarded response" }).click();
  await expect(
    page.getByRole("heading", {
      name: "What the model proposed. What code allowed.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Accessibility validation", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Safety validation")).toBeVisible();

  await page.getByLabel(/Modeled impact reviewed/).check();
  await page.getByLabel(/Accessibility validation reviewed/).check();
  await page
    .getByRole("button", { name: "Approve plan and unlock relay" })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "One plan, adapted to every role and fan.",
    }),
  ).toBeFocused();
  await expect(page.getByText("Audit receipt written")).toBeVisible();
});

test("keyboard user can bypass navigation and operate language tabs", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();

  await page.getByRole("button", { name: "Compile guarded response" }).click();
  await page.getByLabel(/Modeled impact reviewed/).check();
  await page.getByLabel(/Accessibility validation reviewed/).check();
  await page
    .getByRole("button", { name: "Approve plan and unlock relay" })
    .click();

  const english = page.getByRole("tab", { name: "English" });
  await english.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Español" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Français" })).toBeFocused();
});

test("challenge evidence remains readable on a mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/challenge-alignment");

  await expect(
    page.getByRole("heading", { name: "Nothing in the brief is implicit." }),
  ).toBeVisible();
  await expect(page.getByText("17 / 17 terms mapped")).toBeVisible();
  await expect(page.getByRole("row", { name: /GenAI-enabled/ })).toBeVisible();
  const hasBodyOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasBodyOverflow).toBe(false);
});
