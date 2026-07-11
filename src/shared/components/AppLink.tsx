import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { navigate } from "../../presentation/routes/router";

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly href: string;
}

function usesNativeNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  target: string | undefined,
): boolean {
  return [
    event.defaultPrevented,
    event.button !== 0,
    event.metaKey,
    event.ctrlKey,
    event.shiftKey,
    event.altKey,
    target === "_blank",
  ].includes(true);
}

export function AppLink({
  href,
  onClick,
  ...props
}: AppLinkProps): React.JSX.Element {
  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.(event);
    if (usesNativeNavigation(event, props.target)) return;
    event.preventDefault();
    navigate(href);
  }
  return <a href={href} onClick={handleClick} {...props} />;
}
