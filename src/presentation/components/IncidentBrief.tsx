import type { IncidentContext } from "../../domain/entities/incident";
import { QUALITY_REPORT } from "../../generated/qualityReport";
import { AppLink } from "../../shared/components/AppLink";
import { Icon } from "../../shared/components/Icon";
import { Button } from "../../shared/components/ui/Button";
import type { DecisionWorkflowState } from "../hooks/useDecisionWorkflow";

interface IncidentBriefProps {
  readonly incident: IncidentContext;
  readonly state: DecisionWorkflowState;
  readonly onCompile: () => Promise<void>;
  readonly onReset: () => void;
}

function actionLabel(state: DecisionWorkflowState): string {
  switch (state.status) {
    case "idle":
      return "Compile guarded response";
    case "compiling":
      return "Compiling and validating…";
    case "compiled":
      return "Response ready below";
    case "approved":
      return "Response approved";
    case "error":
      return "Retry stable replay";
  }
}

export function IncidentBrief({
  incident,
  state,
  onCompile,
  onReset,
}: IncidentBriefProps): React.JSX.Element {
  const canCompile = state.status === "idle" || state.status === "error";

  return (
    <section className="incident-hero" aria-labelledby="product-title">
      <div className="incident-hero__copy">
        <p className="eyebrow">Resolve 90 · AI stadium incident command</p>
        <h1 id="product-title">
          Stadium disruption in. <em>Safe plan out.</em>
        </h1>
        <p className="incident-hero__lede">
          Grounded GenAI compiles crowd, accessibility, transit, and venue
          signals into one explainable action packet—then code challenges it
          before a human approves anything.
        </p>
        <div className="incident-hero__actions">
          <Button
            type="button"
            busy={state.status === "compiling"}
            disabled={!canCompile}
            onClick={() => {
              if (state.status === "error") onReset();
              void onCompile();
            }}
          >
            <Icon name={state.status === "compiling" ? "clock" : "spark"} />
            {actionLabel(state)}
          </Button>
          <a className="button button--quiet" href="#operational-flow">
            See how it works
            <Icon name="arrow" />
          </a>
        </div>
        <div className="trust-line" aria-label="Product guardrails">
          <span>
            <Icon name="shield" size={16} /> Human approval required
          </span>
          <span>
            <Icon name="access" size={16} /> Accessibility can veto
          </span>
          <span>
            <Icon name="lock" size={16} /> No personal tracking
          </span>
        </div>
        <nav
          className="hero-evidence"
          aria-label="Verified engineering evidence"
        >
          <AppLink
            href="/quality"
            aria-label={`${QUALITY_REPORT.tests.passed} checks Testing evidence`}
          >
            <Icon name="test" size={17} />
            <span>
              <strong>{QUALITY_REPORT.tests.passed} checks</strong>
              <small>Testing evidence</small>
            </span>
          </AppLink>
          <AppLink
            href="/architecture"
            aria-label="Strict TypeScript Architecture evidence"
          >
            <Icon name="code" size={17} />
            <span>
              <strong>Strict TypeScript</strong>
              <small>Architecture evidence</small>
            </span>
          </AppLink>
          <AppLink
            href="/challenge-alignment"
            aria-label="17 / 17 mapped Challenge alignment"
          >
            <Icon name="evidence" size={17} />
            <span>
              <strong>17 / 17 mapped</strong>
              <small>Challenge alignment</small>
            </span>
          </AppLink>
        </nav>
        {state.status === "error" ? (
          <p className="inline-error" role="alert">
            {state.message}
          </p>
        ) : null}
      </div>

      <article className="incident-card" aria-labelledby="incident-title">
        <div className="incident-card__top">
          <div>
            <span className="live-label">
              <span aria-hidden="true" /> Synthetic incident replay
            </span>
            <p>{incident.code} · 18:42:10 local</p>
          </div>
          <span className="severity-badge">Critical</span>
        </div>
        <h2 id="incident-title">{incident.title}</h2>
        <p>{incident.summary}</p>
        <dl className="incident-stats">
          <div>
            <dt>Pressure</dt>
            <dd>
              1.18 <small>/ 0.95 limit</small>
            </dd>
          </div>
          <div>
            <dt>People affected</dt>
            <dd>4,380</dd>
          </div>
          <div>
            <dt>Step-free path</dt>
            <dd className="incident-stats__risk">At risk</dd>
          </div>
        </dl>
        <ul className="signal-list" aria-label="Critical incident signals">
          {incident.signals.slice(0, 4).map((signal) => (
            <li key={signal.id}>
              <span className={`signal-dot signal-dot--${signal.severity}`} />
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </li>
          ))}
        </ul>
        <p className="incident-card__source">
          Synthetic aggregate signals · no person-level data
        </p>
      </article>
    </section>
  );
}
