import { AppLink } from "./AppLink";

export function Brand(): React.JSX.Element {
  return (
    <AppLink className="brand" href="/">
      <span className="brand__mark" aria-hidden="true">
        <span>R</span>
        <span>90</span>
      </span>
      <span className="brand__name">
        Resolve <strong>90</strong>
      </span>
    </AppLink>
  );
}
