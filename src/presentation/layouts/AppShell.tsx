import { useEffect, useRef, type ReactNode } from "react";

import { AppLink } from "../../shared/components/AppLink";
import { Brand } from "../../shared/components/Brand";
import { usePathname } from "../routes/router";

const NAVIGATION = [
  { href: "/", label: "Decision demo" },
  { href: "/challenge-alignment", label: "Alignment" },
  { href: "/quality", label: "Quality" },
  { href: "/architecture", label: "Architecture" },
  { href: "/security", label: "Security" },
  { href: "/testing", label: "Testing" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps): React.JSX.Element {
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
      <header className="site-header">
        <div className="shell-width site-header__inner">
          <Brand />
          <div className="identity-line" aria-label="Product description">
            <span>AI stadium incident command</span>
            <span className="mode-pill">
              <span className="mode-pill__dot" aria-hidden="true" />
              Replay mode
            </span>
          </div>
        </div>
        <nav className="site-nav" aria-label="Evidence and product navigation">
          <div className="shell-width site-nav__scroll">
            {NAVIGATION.map(({ href, label }) => {
              const isCurrent = pathname === href;
              return (
                <AppLink
                  href={href}
                  key={href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent ? "site-nav__link is-current" : "site-nav__link"
                  }
                >
                  {label}
                </AppLink>
              );
            })}
          </div>
        </nav>
      </header>
      <main className="site-main" id="main-content" ref={mainRef} tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="shell-width site-footer__inner">
          <div>
            <strong>Resolve 90</strong>
            <span>Human-controlled AI for inclusive stadium operations.</span>
          </div>
          <div className="site-footer__links">
            <AppLink href="/challenge-alignment">Challenge evidence</AppLink>
            <AppLink href="/quality">Quality evidence</AppLink>
          </div>
          <p>
            Synthetic replay · Modeled impact · No FIFA affiliation or live
            venue claim
          </p>
        </div>
      </footer>
    </div>
  );
}
