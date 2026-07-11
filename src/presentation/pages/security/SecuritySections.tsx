import { QUALITY_REPORT } from "../../../generated/qualityReport";
import { Icon } from "../../../shared/components/Icon";
import { Badge } from "../../../shared/components/ui";
import { GATEWAY_STEPS, THREATS, type Threat } from "./evidence";

function ThreatCard({
  threat,
}: {
  readonly threat: Threat;
}): React.JSX.Element {
  return (
    <article className="threat-card">
      <div className="threat-card__top">
        <Icon name={threat.icon} />
        <Badge tone="pass">Controlled</Badge>
      </div>
      <h3>{threat.title}</h3>
      <dl>
        <div>
          <dt>Threat</dt>
          <dd>{threat.threat}</dd>
        </div>
        <div>
          <dt>Implemented control</dt>
          <dd>{threat.control}</dd>
        </div>
        <div>
          <dt>Residual risk</dt>
          <dd>{threat.residual}</dd>
        </div>
      </dl>
    </article>
  );
}

export function ThreatModel(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="threats-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Visible threat model</p>
          <h2 id="threats-title">Assets, controls, and residual risk</h2>
        </div>
        <p>
          Residual risk is exposed rather than hidden behind a green security
          badge.
        </p>
      </div>
      <div className="threat-grid">
        {THREATS.map((threat) => (
          <ThreatCard key={threat.title} threat={threat} />
        ))}
      </div>
    </section>
  );
}

export function GatewaySequence(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="gateway-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Server-side provider boundary</p>
          <h2 id="gateway-title">Seven checks before Gemini can respond</h2>
        </div>
        <code className="command-chip">api/compile.ts</code>
      </div>
      <ol className="security-sequence">
        {GATEWAY_STEPS.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
            <Icon name="check" size={16} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function DependencyCard(): React.JSX.Element {
  return (
    <article className="evidence-card">
      <div className="evidence-card__top">
        <span className="evidence-card__icon">
          <Icon name="lock" />
        </span>
        <Badge tone="pass">Verified</Badge>
      </div>
      <p className="evidence-card__metric">
        0 <small>high / critical</small>
      </p>
      <h3>Dependency advisories</h3>
      <p>
        <code>npm audit --audit-level=high</code> blocks CI.
      </p>
    </article>
  );
}

function HeaderCard(): React.JSX.Element {
  const checks = Object.values(QUALITY_REPORT.headers.checks);
  const passed = checks.filter((check) => check.passed).length;
  const tone = QUALITY_REPORT.headers.status === "pass" ? "pass" : "fail";
  return (
    <article className="evidence-card">
      <div className="evidence-card__top">
        <span className="evidence-card__icon">
          <Icon name="shield" />
        </span>
        <Badge tone={tone}>{QUALITY_REPORT.headers.status}</Badge>
      </div>
      <p className="evidence-card__metric">
        {passed} / 10 <small>deployed header checks</small>
      </p>
      <h3>Browser hardening</h3>
      <p>
        CSP, HSTS, frame, content-type, referrer, permissions, COOP, CORP, DNS,
        and cross-domain controls.
      </p>
    </article>
  );
}

export function SecuritySummary(): React.JSX.Element {
  return (
    <section
      className="content-section two-column"
      aria-label="Security verification"
    >
      <DependencyCard />
      <HeaderCard />
    </section>
  );
}

function HeaderRow({
  header,
  actual,
  passed,
}: {
  readonly header: string;
  readonly actual: string | null;
  readonly passed: boolean;
}): React.JSX.Element {
  return (
    <tr>
      <td>{header}</td>
      <td>{actual ?? "Missing"}</td>
      <td>
        <Badge tone={passed ? "pass" : "fail"}>
          {passed ? "Verified" : "Failed"}
        </Badge>
      </td>
    </tr>
  );
}

function HeaderTable(): React.JSX.Element {
  const checks = Object.values(QUALITY_REPORT.headers.checks);
  return (
    <div className="evidence-table-wrap">
      <table className="evidence-table">
        <caption className="visually-hidden">
          Deployed response-header verification
        </caption>
        <thead>
          <tr>
            <th scope="col">Header</th>
            <th scope="col">Observed value</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <HeaderRow {...check} key={check.header} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HeaderEvidence(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="headers-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Deployed response verification</p>
          <h2 id="headers-title">Security headers observed over HTTPS</h2>
        </div>
        <code className="command-chip">npm run headers:verify -- URL</code>
      </div>
      <HeaderTable />
    </section>
  );
}

export function SecurityCaveat(): React.JSX.Element {
  return (
    <aside className="audit-note">
      <Icon name="warning" />
      <p>
        <strong>Honest limitation:</strong> the public replay has no
        authentication. Real venue use requires scoped identity, distributed
        limiting, and signed audit storage.
      </p>
    </aside>
  );
}
