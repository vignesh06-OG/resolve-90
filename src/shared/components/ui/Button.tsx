import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "primary" | "quiet" | "secondary";
  readonly busy?: boolean;
  readonly children: ReactNode;
}

export function Button({
  variant = "primary",
  busy = false,
  className = "",
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const classes = `button button--${variant}${busy ? " is-processing" : ""}${className ? ` ${className}` : ""}`;
  return (
    <button className={classes} aria-busy={busy} {...props}>
      {children}
    </button>
  );
}
