import { useEffect, useRef, type ReactNode } from "react";

import { usePathname } from "../routes/router";
import { SiteFooter, SiteHeader } from "./ShellChrome";

export function AppShell({
  children,
}: {
  readonly children: ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current !== pathname) mainRef.current?.focus();
    previousPath.current = pathname;
  }, [pathname]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader pathname={pathname} />
      <main className="site-main" id="main-content" ref={mainRef} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
