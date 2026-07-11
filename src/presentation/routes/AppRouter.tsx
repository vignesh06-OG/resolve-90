import { lazy, Suspense, useEffect } from "react";

import { AppLink } from "../../shared/components/AppLink";
import { AppShell } from "../layouts/AppShell";
import HomePage from "../pages/HomePage";
import { usePathname } from "./router";
const QualityPage = lazy(() => import("../pages/QualityPage"));
const ArchitecturePage = lazy(() => import("../pages/ArchitecturePage"));
const SecurityPage = lazy(() => import("../pages/SecurityPage"));
const TestingPage = lazy(() => import("../pages/TestingPage"));
const AccessibilityPage = lazy(() => import("../pages/AccessibilityPage"));
const ChallengeAlignmentPage = lazy(
  () => import("../pages/ChallengeAlignmentPage"),
);

const titles: Readonly<Record<string, string>> = {
  "/": "Decision demo",
  "/quality": "Quality dashboard",
  "/architecture": "Architecture",
  "/security": "Security",
  "/testing": "Testing",
  "/accessibility": "Accessibility audit",
  "/challenge-alignment": "Challenge alignment",
};

function RouteLoader(): React.JSX.Element {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span aria-hidden="true" />
      Loading evidence…
    </div>
  );
}

function NotFoundPage(): React.JSX.Element {
  return (
    <section className="page-shell empty-page">
      <p className="eyebrow">404 · Route not found</p>
      <h1>The requested evidence page is unavailable.</h1>
      <p>No operational action has been affected.</p>
      <AppLink className="button button--primary" href="/">
        Return to decision demo
      </AppLink>
    </section>
  );
}

function routeFor(pathname: string): React.JSX.Element {
  switch (pathname) {
    case "/":
      return <HomePage />;
    case "/quality":
      return <QualityPage />;
    case "/architecture":
      return <ArchitecturePage />;
    case "/security":
      return <SecurityPage />;
    case "/testing":
      return <TestingPage />;
    case "/accessibility":
      return <AccessibilityPage />;
    case "/challenge-alignment":
      return <ChallengeAlignmentPage />;
    default:
      return <NotFoundPage />;
  }
}

export function AppRouter(): React.JSX.Element {
  const pathname = usePathname();

  useEffect(() => {
    document.title = `${titles[pathname] ?? "Not found"} — Resolve 90`;
  }, [pathname]);

  return (
    <AppShell>
      <Suspense fallback={<RouteLoader />}>{routeFor(pathname)}</Suspense>
    </AppShell>
  );
}
