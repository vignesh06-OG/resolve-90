import type { ReactNode } from "react";

interface SectionHeaderProps {
  readonly kicker: ReactNode;
  readonly title: string;
  readonly titleId: string;
  readonly summary?: string;
  readonly trailing?: ReactNode;
}

export function SectionHeader({
  kicker,
  title,
  titleId,
  summary,
  trailing,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div className="section-intro">
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2 id={titleId}>{title}</h2>
      </div>
      {trailing ?? (summary === undefined ? null : <p>{summary}</p>)}
    </div>
  );
}
