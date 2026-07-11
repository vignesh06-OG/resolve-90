import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FanRelay } from "../../src/presentation/components/relay/FanRelay";
import { SectionHeader } from "../../src/shared/components/ui";

describe("UI primitive branches", () => {
  it("renders trailing, summary, and minimal section headers", () => {
    const { rerender } = render(
      <SectionHeader
        kicker="Kicker"
        title="Title"
        titleId="title"
        trailing={<code>Trailing</code>}
      />,
    );
    expect(screen.getByText("Trailing")).toBeVisible();
    rerender(
      <SectionHeader
        kicker="Kicker"
        title="Title"
        titleId="title"
        summary="Summary"
      />,
    );
    expect(screen.getByText("Summary")).toBeVisible();
    rerender(<SectionHeader kicker="Kicker" title="Title" titleId="title" />);
    expect(screen.queryByText("Summary")).not.toBeInTheDocument();
  });

  it("returns no fan relay when no locale message is available", () => {
    const { container } = render(<FanRelay messages={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
