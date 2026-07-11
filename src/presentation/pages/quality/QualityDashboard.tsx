import { QUALITY_REPORT } from "../../../generated/qualityReport";
import { Icon, type IconName } from "../../../shared/components/Icon";
import { Metric } from "../../../shared/components/ui";

interface CardData {
  readonly title: string;
  readonly metric: string;
  readonly detail: string;
  readonly status: "pass" | "warn" | "fail";
  readonly label: string;
  readonly icon: IconName;
}

const quality = QUALITY_REPORT;
const lighthouse = quality.performance.lighthouse;
const kibibytes = (bytes: number): string => `${(bytes / 1024).toFixed(1)} KiB`;
const ciDetail = quality.ci.remoteVerified
  ? `Remote ${quality.ci.verifiedCommit?.slice(0, 7) ?? "commit"} · CodeQL ${quality.ci.codeql} · Dependabot configured`
  : `${quality.ci.workflows.join(" + ")} · remote not verified`;
const ciTone = quality.ci.remoteVerified ? "pass" : "warn";

const CARDS: readonly CardData[] = [
  {
    title: "Tests",
    metric: `${quality.tests.passed} / ${quality.tests.total}`,
    detail: `${quality.tests.vitest.files} Vitest files · ${quality.tests.playwright.total} Playwright scenarios`,
    status: quality.tests.status,
    label: "Report verified",
    icon: "test",
  },
  {
    title: "Coverage",
    metric: `${quality.coverage.lines}% lines`,
    detail: `Functions ${quality.coverage.functions}% · Branches ${quality.coverage.branches}%`,
    status: quality.coverage.status,
    label: "Threshold met",
    icon: "evidence",
  },
  {
    title: "CI",
    metric: `${quality.ci.workflows.length} workflows`,
    detail: ciDetail,
    status: ciTone,
    label: quality.ci.status,
    icon: "code",
  },
  {
    title: "Security",
    metric: `${quality.security.vulnerabilities.high} high / ${quality.security.vulnerabilities.critical} critical`,
    detail: `${quality.security.vulnerabilities.total} total dependency advisories`,
    status: quality.security.status,
    label: "Audit verified",
    icon: "lock",
  },
  {
    title: "Performance",
    metric: `${lighthouse?.performance ?? 0} / 100`,
    detail: `${kibibytes(quality.build.javascriptGzipBytes)} total JS gzip · CLS ${lighthouse?.cls ?? "n/a"}`,
    status: quality.performance.status,
    label: "Lighthouse + budget",
    icon: "clock",
  },
  {
    title: "Accessibility",
    metric: `${quality.accessibility.lighthouseScore ?? 0} / 100`,
    detail: `${quality.accessibility.automatedChecks} automated accessibility checks`,
    status: quality.accessibility.status,
    label: "Audited",
    icon: "access",
  },
  {
    title: "Build status",
    metric: quality.build.status === "pass" ? "Passing" : "Failing",
    detail: `${quality.build.javascriptChunks} JS chunks · largest ${kibibytes(quality.build.largestJavaScriptGzipBytes)} gzip`,
    status: quality.build.status,
    label: "Report verified",
    icon: "check",
  },
];

function QualityCard({ data }: { readonly data: CardData }): React.JSX.Element {
  return (
    <article className="quality-card">
      <div className="quality-card__top">
        <span className="quality-card__icon">
          <Icon name={data.icon} />
        </span>
        <span className={`status-pill status-pill--${data.status}`}>
          {data.label}
        </span>
      </div>
      <Metric label={data.title} value={data.metric} detail={data.detail} />
    </article>
  );
}

export function QualityDashboard(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="quality-status-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Quality dashboard</p>
          <h2 id="quality-status-title">Seven scoring categories, one gate</h2>
        </div>
        <code className="command-chip">npm run quality</code>
      </div>
      <div className="quality-grid">
        {CARDS.map((data) => (
          <QualityCard data={data} key={data.title} />
        ))}
      </div>
    </section>
  );
}
