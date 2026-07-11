import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "primary" | "quiet" | "secondary";
  readonly busy?: boolean;
  readonly children: ReactNode;
}

export function Button({
  variant,
  busy,
  className,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const classes = [
    "button",
    `button--${variant ?? "primary"}`,
    busy && "is-processing",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} aria-busy={Boolean(busy)} {...props}>
      {children}
    </button>
  );
}
