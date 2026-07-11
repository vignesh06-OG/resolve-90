import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { navigate } from "../../presentation/routes/router";

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly href: string;
}

export function AppLink({
  href,
  onClick,
  ...props
}: AppLinkProps): React.JSX.Element {
  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank"
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  }

  return <a href={href} onClick={handleClick} {...props} />;
}
