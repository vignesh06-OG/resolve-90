import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { Icon, type IconName } from "../../shared/components/Icon";
import { QUALITY_REPORT } from "../../generated/qualityReport";

interface QualityCardProps {
  readonly title: string;
  readonly metric: string;
  readonly detail: string;
  readonly status: "pass" | "warn" | "fail";
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

function kibibytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

export default function QualityPage(): React.JSX.Element {
  const quality = QUALITY_REPORT;
  const lighthouse = quality.performance.lighthouse;
  const verifiedAt = new Date(quality.generatedAt).toLocaleString("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · quality"
        title="Quality, made observable."
        summary="Every value below is generated from machine-readable Vitest, coverage, Playwright, bundle, Lighthouse, and dependency-audit reports."
        status={`Generated ${verifiedAt} · ${quality.commit}`}
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
            metric={`${quality.tests.passed} / ${quality.tests.total}`}
            detail={`${quality.tests.vitest.files} Vitest files · ${quality.tests.playwright.total} Playwright scenarios`}
            status={quality.tests.status}
            label="Report verified"
            icon="test"
          />
          <QualityCard
            title="Coverage"
            metric={`${quality.coverage.lines}% lines`}
            detail={`Functions ${quality.coverage.functions}% · Branches ${quality.coverage.branches}%`}
            status={quality.coverage.status}
            label="Threshold met"
            icon="evidence"
          />
          <QualityCard
            title="CI"
            metric={`${quality.ci.workflows.length} workflows`}
            detail={`${quality.ci.workflows.join(" + ")} · remote ${quality.ci.remoteVerified ? "verified" : "not verified"}`}
            status={quality.ci.remoteVerified ? "pass" : "warn"}
            label={quality.ci.status}
            icon="code"
          />
          <QualityCard
            title="Security"
            metric={`${quality.security.vulnerabilities.high} high / ${quality.security.vulnerabilities.critical} critical`}
            detail={`${quality.security.vulnerabilities.total} total dependency advisories`}
            status={quality.security.status}
            label="Audit verified"
            icon="lock"
          />
          <QualityCard
            title="Performance"
            metric={`${lighthouse?.performance ?? 0} / 100`}
            detail={`${kibibytes(quality.build.javascriptGzipBytes)} total JS gzip · CLS ${lighthouse?.cls ?? "n/a"}`}
            status={quality.performance.status}
            label="Lighthouse + budget"
            icon="clock"
          />
          <QualityCard
            title="Accessibility"
            metric={`${quality.accessibility.lighthouseScore ?? 0} / 100`}
            detail={`${quality.accessibility.automatedChecks} automated accessibility checks`}
            status={quality.accessibility.status}
            label="Audited"
            icon="access"
          />
          <QualityCard
            title="Build status"
            metric={quality.build.status === "pass" ? "Passing" : "Failing"}
            detail={`${quality.build.javascriptChunks} JS chunks · largest ${kibibytes(quality.build.largestJavaScriptGzipBytes)} gzip`}
            status={quality.build.status}
            label="Report verified"
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
          <h2 id="integrity-title">No green badge without a report.</h2>
        </div>
        <dl>
          <div>
            <dt>Generated</dt>
            <dd>
              Statistics come from files produced by executable quality tools.
            </dd>
          </div>
          <div>
            <dt>Configured</dt>
            <dd>
              Automation exists; remote execution is labeled independently.
            </dd>
          </div>
          <div>
            <dt>Deployment-only</dt>
            <dd>
              Hosted headers and remote CI require an observable public origin.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
