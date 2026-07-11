import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
}

export function Card({
  className = "",
  children,
  ...props
}: CardProps): React.JSX.Element {
  const classes = ["ui-card", className].filter(Boolean).join(" ");
  return (
    <article className={classes} {...props}>
      {children}
    </article>
  );
}
