import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
}

export function Card({
  className = "",
  children,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <article
      className={`ui-card${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </article>
  );
}
