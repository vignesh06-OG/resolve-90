import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly failed: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, details: ErrorInfo): void {
    void error;
    void details;
    // Production telemetry is adapter-bound; incident data is never logged here.
  }

  override render(): ReactNode {
    if (this.state.failed) {
      return (
        <main className="fatal-error">
          <p className="eyebrow">Recoverable interface error</p>
          <h1>The decision workspace could not render.</h1>
          <p>
            No operational action was sent. Reload the verified replay to
            recover safely.
          </p>
          <button
            className="button button--primary"
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload workspace
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
