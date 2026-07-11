import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { QUALITY_REPORT } from "../../generated/qualityReport";
import { Icon, type IconName } from "../../shared/components/Icon";

interface Threat {
  readonly title: string;
  readonly icon: IconName;
  readonly threat: string;
  readonly control: string;
  readonly residual: string;
}

const threats: readonly Threat[] = [
  {
    title: "Decision integrity",
    icon: "shield",
    threat: "Prompt injection or hallucinated venue facts",
    control:
      "Instruction/data separation, evidence-ID allowlist, output schema, deterministic guardrails",
    residual: "Source telemetry may itself be stale or incorrect",
  },
  {
    title: "Provider secret",
    icon: "lock",
    threat: "Credential extraction from the browser bundle",
    control:
      "Same-origin server gateway; GEMINI_API_KEY never uses a VITE_ variable",
    residual: "Authorized hosting administrators can access runtime secrets",
  },
  {
    title: "Accessibility",
    icon: "access",
    threat: "Throughput optimization disadvantages disabled fans",
    control:
      "90% hard floor, 95% target, deterministic veto, explicit human acknowledgement",
    residual: "Real venue configuration must include every physical barrier",
  },
  {
    title: "API abuse",
    icon: "warning",
    threat: "Generation spam, oversized payloads, and cost exhaustion",
    control:
      "32 KiB limit, bounded schemas, origin check, token bucket, timeout, model allowlist",
    residual:
      "Multi-region production needs a distributed authenticated limiter",
  },
  {
    title: "Browser content",
    icon: "code",
    threat: "Model or signal text executes as HTML or script",
    control:
      "React text escaping, no dangerous HTML, strict CSP, same-origin resources",
    residual: "Untrusted browser extensions are outside application control",
  },
  {
    title: "Fan privacy",
    icon: "users",
    threat: "Operational tooling becomes person-level surveillance",
    control:
      "Aggregate counts only; no biometrics, profiles, device IDs, or personal storage",
    residual:
      "Connected upstream systems must uphold the same minimization policy",
  },
];

export default function SecurityPage(): React.JSX.Element {
  const headerChecks = Object.values(QUALITY_REPORT.headers.checks);
  const passedHeaders = headerChecks.filter(({ passed }) => passed).length;
  const headerTone =
    QUALITY_REPORT.headers.status === "pass"
      ? "pass"
      : QUALITY_REPORT.headers.status === "fail"
        ? "fail"
        : "warn";

  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · security"
        title="The model proposes. It never commands."
        summary="Resolve 90 treats every generated plan as untrusted. Security controls protect credentials, decision integrity, accessibility, privacy, and the human authority boundary."
        status="0 known high / critical advisories"
      />

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
          {threats.map(({ title, icon, threat, control, residual }) => (
            <article className="threat-card" key={title}>
              <div className="threat-card__top">
                <Icon name={icon} />
                <span className="status-pill status-pill--pass">
                  Controlled
                </span>
              </div>
              <h3>{title}</h3>
              <dl>
                <div>
                  <dt>Threat</dt>
                  <dd>{threat}</dd>
                </div>
                <div>
                  <dt>Implemented control</dt>
                  <dd>{control}</dd>
                </div>
                <div>
                  <dt>Residual risk</dt>
                  <dd>{residual}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="gateway-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">Server-side provider boundary</p>
            <h2 id="gateway-title">Seven checks before Gemini can respond</h2>
          </div>
          <code className="command-chip">api/compile.ts</code>
        </div>
        <ol className="security-sequence">
          {[
            "POST + allowed origin",
            "Hashed rate-limit key",
            "32 KiB request ceiling",
            "Strict incident schema",
            "Server-only credential",
            "10 second provider timeout",
            "Strict response schema",
          ].map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              <Icon name="check" size={16} />
            </li>
          ))}
        </ol>
      </section>

      <section
        className="content-section two-column"
        aria-label="Security verification"
      >
        <article className="evidence-card">
          <div className="evidence-card__top">
            <span className="evidence-card__icon">
              <Icon name="lock" />
            </span>
            <span className="status-pill status-pill--pass">Verified</span>
          </div>
          <p className="evidence-card__metric">
            0 <small>high / critical</small>
          </p>
          <h3>Dependency advisories</h3>
          <p>
            <code>npm audit --audit-level=high</code> is part of the blocking
            quality command and CI job.
          </p>
        </article>
        <article className="evidence-card">
          <div className="evidence-card__top">
            <span className="evidence-card__icon">
              <Icon name="shield" />
            </span>
            <span className={`status-pill status-pill--${headerTone}`}>
              {QUALITY_REPORT.headers.status}
            </span>
          </div>
          <p className="evidence-card__metric">
            {passedHeaders} / 10 <small>deployed header checks</small>
          </p>
          <h3>Browser hardening</h3>
          <p>
            CSP, HSTS, frame denial, nosniff, strict referrer policy, and
            permissions policy are verified only against a public origin.
          </p>
        </article>
      </section>

      <section className="content-section" aria-labelledby="headers-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">Deployed response verification</p>
            <h2 id="headers-title">Security headers observed over HTTPS</h2>
          </div>
          <code className="command-chip">npm run headers:verify -- URL</code>
        </div>
        {headerChecks.length > 0 ? (
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
                {headerChecks.map(({ header, actual, passed }) => (
                  <tr key={header}>
                    <td>{header}</td>
                    <td>{actual ?? "Missing"}</td>
                    <td>
                      <span
                        className={`status-pill status-pill--${passed ? "pass" : "fail"}`}
                      >
                        {passed ? "Verified" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <aside className="audit-note">
            <Icon name="warning" />
            <p>
              <strong>Public-origin verification pending.</strong> No deployment
              URL or deployment credential is available in this workspace; the
              repository does not claim that configured headers were observed.
            </p>
          </aside>
        )}
      </section>

      <aside className="audit-note">
        <Icon name="warning" />
        <p>
          <strong>Honest limitation:</strong> the public replay has no
          authentication because it controls no real venue. Production requires
          venue-scoped identity, role authorization, a distributed limiter, and
          signed audit storage before operational use.
        </p>
      </aside>
    </div>
  );
}
