import { Icon } from "../../shared/components/Icon";
import { EAST_CONCOURSE_INCIDENT } from "../../infrastructure/repositories/replayScenario";
import type { DecisionWorkflowState } from "../hooks/useDecisionWorkflow";

interface IncidentBriefProps {
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
          <button
            className="button button--primary"
            type="button"
            disabled={!canCompile}
            onClick={() => {
              if (state.status === "error") onReset();
              void onCompile();
            }}
          >
            <Icon name={state.status === "compiling" ? "clock" : "spark"} />
            {actionLabel(state)}
          </button>
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
            <p>{EAST_CONCOURSE_INCIDENT.code} · 18:42:10 local</p>
          </div>
          <span className="severity-badge">Critical</span>
        </div>
        <h2 id="incident-title">{EAST_CONCOURSE_INCIDENT.title}</h2>
        <p>{EAST_CONCOURSE_INCIDENT.summary}</p>
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
          {EAST_CONCOURSE_INCIDENT.signals.slice(0, 4).map((signal) => (
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
