import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/presentation/styles/global.css"),
  "utf8",
);

function token(name: string): string {
  const value = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css)?.[1];
  if (value === undefined) throw new Error(`Missing color token: ${name}`);
  return value;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return (
    0.2126 * (linear[0] ?? 0) +
    0.7152 * (linear[1] ?? 0) +
    0.0722 * (linear[2] ?? 0)
  );
}

function contrast(foreground: string, background: string): number {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const textPairs = [
  ["ink", "night"],
  ["muted", "night"],
  ["accent", "night"],
  ["paper-ink", "paper"],
  ["paper-muted", "paper"],
  ["mint", "surface"],
  ["muted", "surface"],
] as const;

describe("design-token contrast", () => {
  it.each(textPairs)(
    "keeps %s on %s at WCAG AA normal-text contrast",
    (foreground, background) => {
      expect(
        contrast(token(foreground), token(background)),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("keeps primary button text above AA contrast", () => {
    expect(contrast("#152221", token("accent"))).toBeGreaterThanOrEqual(4.5);
  });
});
