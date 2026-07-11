import { Icon } from "../../../shared/components/Icon";

const PIPELINE = [
  ["01", "Format", "Prettier check"],
  ["02", "Lint", "Zero warnings"],
  ["03", "Types", "Strict TS"],
  ["04", "Test", "Coverage gate"],
  ["05", "Build", "Production bundle"],
  ["06", "Budget", "Compressed assets"],
  ["07", "Audit", "High severity = fail"],
] as const;
const INTEGRITY = [
  [
    "Generated",
    "Statistics come from files produced by executable quality tools.",
  ],
  [
    "Configured",
    "Automation exists; remote execution is labeled independently.",
  ],
  [
    "Deployment-only",
    "Hosted headers and remote CI require an observable public origin.",
  ],
] as const;

export function PipelineSection(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="pipeline-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Fail-closed pipeline</p>
          <h2 id="pipeline-title">A broken signal cannot reach deployment</h2>
        </div>
        <p>
          CI cancels superseded runs, preserves reports on failure, and blocks
          E2E until the quality job passes.
        </p>
      </div>
      <ol className="quality-pipeline">
        {PIPELINE.map(([number, name, note]) => (
          <li key={number}>
            <span>{number}</span>
            <strong>{name}</strong>
            <small>{note}</small>
            <Icon name="check" size={17} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EvidenceIntegrity(): React.JSX.Element {
  return (
    <section
      className="content-section evidence-integrity"
      aria-labelledby="integrity-title"
    >
      <div>
        <p className="section-kicker">Evidence integrity</p>
        <h2 id="integrity-title">No green badge without a report.</h2>
      </div>
      <dl>
        {INTEGRITY.map(([term, detail]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
