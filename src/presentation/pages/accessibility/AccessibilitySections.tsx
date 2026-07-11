import { QUALITY_REPORT } from "../../../generated/qualityReport";
import { Icon } from "../../../shared/components/Icon";
import { AUDIT_CATEGORIES, AUDIT_ROWS, type AuditCategory } from "./evidence";

function AuditCategoryCard({
  category,
}: {
  readonly category: AuditCategory;
}): React.JSX.Element {
  return (
    <article className="audit-category">
      <div className="audit-category__top">
        <h3>{category.title}</h3>
        <Icon name={category.icon} />
      </div>
      <ul>
        {category.checks.map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
    </article>
  );
}

export function AuditSummary(): React.JSX.Element {
  const audit = QUALITY_REPORT.accessibility;
  return (
    <section className="content-section" aria-labelledby="audit-summary-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Accessibility audit result</p>
          <h2 id="audit-summary-title">Automated scan plus WCAG code review</h2>
        </div>
        <p>
          Automated tools catch only a subset of barriers. Deployment-only human
          and assistive-technology checks remain explicit.
        </p>
      </div>
      <div className="audit-summary">
        <div className="audit-score">
          <strong>{audit.lighthouseScore ?? "—"}</strong>
          <span>Lighthouse · {audit.automatedChecks} automated checks</span>
        </div>
        <div className="audit-categories">
          {AUDIT_CATEGORIES.map((category) => (
            <AuditCategoryCard category={category} key={category.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WcagRow({
  row,
}: {
  readonly row: (typeof AUDIT_ROWS)[number];
}): React.JSX.Element {
  const [criterion, evidence, result] = row;
  const tone = result === "Pass" ? "pass" : "warn";
  return (
    <tr>
      <td>{criterion}</td>
      <td>{evidence}</td>
      <td>
        <span className={`status-pill status-pill--${tone}`}>{result}</span>
      </td>
    </tr>
  );
}

function WcagResults(): React.JSX.Element {
  return (
    <div className="evidence-table-wrap">
      <table className="evidence-table">
        <caption className="visually-hidden">
          WCAG 2.2 accessibility audit results
        </caption>
        <thead>
          <tr>
            <th scope="col">Criterion</th>
            <th scope="col">Evidence</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {AUDIT_ROWS.map((row) => (
            <WcagRow key={row[0]} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WcagTable(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="wcag-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">WCAG 2.2 AA evidence</p>
          <h2 id="wcag-title">Criterion-level audit trail</h2>
        </div>
        <code className="command-chip">npm run test:accessibility</code>
      </div>
      <WcagResults />
    </section>
  );
}

const FIXES = [
  [
    "code",
    "Complete tab semantics",
    "Language tabs support Left, Right, Home, End, click, and Tab.",
  ],
  [
    "route",
    "Predictable focus",
    "Route changes move focus to main; approval focuses the unlocked relay.",
  ],
  [
    "warning",
    "No color-only state",
    "Every pass, warning, rejection, and live state includes text or iconography.",
  ],
] as const;

export function AuditFixes(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="fixes-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Audit fixes surfaced</p>
          <h2 id="fixes-title">What the audit changed</h2>
        </div>
      </div>
      <div className="boundary-rules">
        {FIXES.map(([icon, title, detail]) => (
          <article key={title}>
            <Icon name={icon} />
            <h3>{title}</h3>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccessibilityCaveat(): React.JSX.Element {
  return (
    <aside className="audit-note">
      <Icon name="access" />
      <p>
        <strong>Operational distinction:</strong> an accessible web interface
        does not certify a physical route. Disabled fans and venue specialists
        must validate route graphs, signage, lifts, surfaces, and fallbacks.
      </p>
    </aside>
  );
}
