import type { ReactNode } from "react";

interface BadgeProps {
  readonly tone: "fail" | "pass" | "warn";
  readonly children: ReactNode;
  readonly className?: string;
}

export function Badge({
  tone,
  children,
  className = "",
}: BadgeProps): React.JSX.Element {
  const classes = ["status-pill", `status-pill--${tone}`, className]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}
