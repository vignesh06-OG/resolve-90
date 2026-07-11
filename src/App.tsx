import { ErrorBoundary } from "./presentation/components/ErrorBoundary";
import { AppRouter } from "./presentation/routes/AppRouter";

export function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}
