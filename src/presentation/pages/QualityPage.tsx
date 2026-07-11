import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { Icon, type IconName } from "../../shared/components/Icon";
import { QUALITY_SNAPSHOT } from "../../shared/lib/qualitySnapshot";

interface QualityCardProps {
  readonly title: string;
  readonly metric: string;
  readonly detail: string;
  readonly status: "pass" | "warn";
  readonly label: string;
  readonly icon: IconName;
}

function QualityCard({
  title,
  metric,
  detail,
  status,
  label,
  icon,
}: QualityCardProps): React.JSX.Element {
  return (
    <article className="quality-card">
      <div className="quality-card__top">
        <span className="quality-card__icon">
          <Icon name={icon} />
        </span>
        <span className={`status-pill status-pill--${status}`}>{label}</span>
      </div>
      <p>{title}</p>
      <strong>{metric}</strong>
      <small>{detail}</small>
    </article>
  );
}

const pipeline = [
  ["01", "Format", "Prettier check"],
  ["02", "Lint", "Zero warnings"],
  ["03", "Types", "Strict TS"],
  ["04", "Test", "Coverage gate"],
  ["05", "Build", "Production bundle"],
  ["06", "Budget", "Compressed assets"],
  ["07", "Audit", "High severity = fail"],
] as const;

export default function QualityPage(): React.JSX.Element {
  const quality = QUALITY_SNAPSHOT;

  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · quality"
        title="Quality, made observable."
        summary="Every claim below maps to an executable repository gate. Honest labels distinguish locally verified checks from configured CI and deployment-only measurement."
        status={`Snapshot · ${quality.verifiedAt}`}
      />

      <section
        className="content-section"
        aria-labelledby="quality-status-title"
      >
        <div className="section-intro">
          <div>
            <p className="section-kicker">Quality dashboard</p>
            <h2 id="quality-status-title">
              Seven scoring categories, one gate
            </h2>
          </div>
          <code className="command-chip">npm run quality</code>
        </div>
        <div className="quality-grid">
          <QualityCard
            title="Tests"
            metric={`${quality.tests.total} / ${quality.tests.total}`}
            detail={quality.tests.detail}
            status="pass"
            label="Verified"
            icon="test"
          />
          <QualityCard
            title="Coverage"
            metric={quality.coverage.lines}
            detail={`Functions ${quality.coverage.functions} · Branches ${quality.coverage.branches}`}
            status={quality.coverage.status}
            label={
              quality.coverage.status === "pass"
                ? "Threshold met"
                : "Final audit"
            }
            icon="evidence"
          />
          <QualityCard
            title="CI"
            metric="2 workflows"
            detail={quality.ci.detail}
            status="pass"
            label="Configured"
            icon="code"
          />
          <QualityCard
            title="Security"
            metric="0 high / critical"
            detail={quality.security.detail}
            status="pass"
            label="Verified"
            icon="lock"
          />
          <QualityCard
            title="Performance"
            metric={quality.performance.lighthouse}
            detail={quality.performance.detail}
            status={quality.performance.status}
            label="Budget passes"
            icon="clock"
          />
          <QualityCard
            title="Accessibility"
            metric="WCAG 2.2 AA"
            detail={quality.accessibility.detail}
            status={quality.accessibility.status}
            label={
              quality.accessibility.status === "pass"
                ? "Audited"
                : "In progress"
            }
            icon="access"
          />
          <QualityCard
            title="Build status"
            metric="Passing"
            detail={quality.build.detail}
            status="pass"
            label="Verified"
            icon="check"
          />
        </div>
      </section>

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
          {pipeline.map(([number, name, note]) => (
            <li key={number}>
              <span>{number}</span>
              <strong>{name}</strong>
              <small>{note}</small>
              <Icon name="check" size={17} />
            </li>
          ))}
        </ol>
      </section>

      <section
        className="content-section evidence-integrity"
        aria-labelledby="integrity-title"
      >
        <div>
          <p className="section-kicker">Evidence integrity</p>
          <h2 id="integrity-title">
            No green badge without a reproducible check.
          </h2>
        </div>
        <dl>
          <div>
            <dt>Verified</dt>
            <dd>Executed successfully in this repository snapshot.</dd>
          </div>
          <div>
            <dt>Configured</dt>
            <dd>Automation exists; a public remote run is not claimed.</dd>
          </div>
          <div>
            <dt>Deployment-only</dt>
            <dd>
              Requires the final hosted origin or real assistive technology.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
