interface EvidencePageHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly status: string;
  readonly tone?: "pass" | "warn";
}

export function EvidencePageHeader({
  eyebrow,
  title,
  summary,
  status,
  tone = "pass",
}: EvidencePageHeaderProps): React.JSX.Element {
  return (
    <header className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <div>
        <p className="page-heading__summary">{summary}</p>
        <span className={`status-pill status-pill--${tone}`}>{status}</span>
      </div>
    </header>
  );
}
