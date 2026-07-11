import { Icon } from "../../../shared/components/Icon";
import { Badge } from "../../../shared/components/ui";

const LAYERS = [
  [
    "01",
    "Presentation Layer",
    "Accessible React renders state and invokes use cases. No risk math, validation, or fetch calls.",
    ["pages + components", "workflow hook", "lazy route shell"],
  ],
  [
    "02",
    "Application Layer",
    "Use cases orchestrate incident retrieval, generation, guardrails, approval, and audit ports.",
    ["CompileIncident", "ApproveDecision", "typed ports"],
  ],
  [
    "03",
    "Domain Layer · safety kernel",
    "Pure rules rank plans and veto unsafe, inaccessible, ungrounded, or incomplete output.",
    ["evaluateCandidate", "selectDecision", "approveDecision"],
  ],
  [
    "04",
    "Infrastructure Layer · adapters",
    "Replay, Gemini gateway, repositories, clocks, and audit implementations plug into ports.",
    ["Gemini / Replay", "Zod schemas", "server gateway"],
  ],
] as const;
const AI_PIPELINE = [
  ["1", "Bound input", "32 KiB body + typed signal schema"],
  ["2", "Ground prompt", "Evidence-ID allowlist + policy context"],
  ["3", "Generate", "Gemini JSON schema or pinned replay"],
  ["4", "Challenge", "Deterministic safety + access vetoes"],
  ["5", "Approve", "Human acknowledgement + audit receipt"],
] as const;

function LayerCard({
  layer,
}: {
  readonly layer: (typeof LAYERS)[number];
}): React.JSX.Element {
  const [number, title, description, modules] = layer;
  return (
    <article className="architecture-layer">
      <span className="architecture-layer__number">LAYER {number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {modules.map((module) => (
          <li key={module}>{module}</li>
        ))}
      </ul>
    </article>
  );
}

export function ArchitectureLayers(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="layers-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">Visual system architecture</p>
          <h2 id="layers-title">Dependencies point toward the safety kernel</h2>
        </div>
        <p>
          Presentation and infrastructure call inward through typed application
          contracts.
        </p>
      </div>
      <div className="architecture-canvas">
        <div className="architecture-layers">
          {LAYERS.map((layer) => (
            <LayerCard key={layer[0]} layer={layer} />
          ))}
        </div>
        <p className="architecture-caption">
          <span>Provider edge</span>Infrastructure → application ports → domain
          invariants ← presentation use cases<span>Human edge</span>
        </p>
      </div>
    </section>
  );
}

export function AiBoundary(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="ai-boundary-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">AI trust boundary</p>
          <h2 id="ai-boundary-title">Generated output is untrusted input</h2>
        </div>
        <p>
          The model cannot define evidence, thresholds, approval state, or
          authority.
        </p>
      </div>
      <div className="ai-boundary">
        {AI_PIPELINE.map(([number, title, note]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const RULES = [
  [
    "code",
    "No business logic in UI",
    "Components format state; safety and approval live in domain services.",
  ],
  [
    "lock",
    "No provider secret in client",
    "Credentials, model policy, and rate limits remain server-side.",
  ],
  [
    "shield",
    "No model authority",
    "Approval requires human acknowledgements and an audit-port write.",
  ],
] as const;

export function SolidRules(): React.JSX.Element {
  return (
    <section className="content-section" aria-labelledby="rules-title">
      <div className="section-intro">
        <div>
          <p className="section-kicker">SOLID principles · enforced rules</p>
          <h2 id="rules-title">
            Single responsibility. Dependency inversion. Explicit boundaries.
          </h2>
        </div>
      </div>
      <div className="boundary-rules">
        {RULES.map(([icon, title, detail]) => (
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

function ArchitectureCard({
  icon,
  badge,
  title,
  detail,
}: {
  readonly icon: "route" | "warning";
  readonly badge: string;
  readonly title: string;
  readonly detail: string;
}): React.JSX.Element {
  return (
    <article className="evidence-card">
      <div className="evidence-card__top">
        <span className="evidence-card__icon">
          <Icon name={icon} />
        </span>
        <Badge tone="pass">{badge}</Badge>
      </div>
      <h3>{title}</h3>
      <p>{detail}</p>
    </article>
  );
}

export function FailureAndScale(): React.JSX.Element {
  return (
    <section
      className="content-section two-column"
      aria-label="Failure and scaling architecture"
    >
      <ArchitectureCard
        icon="warning"
        badge="Fail closed"
        title="Provider unavailable?"
        detail="No partial result is accepted; a typed recovery state preserves the deterministic replay."
      />
      <ArchitectureCard
        icon="route"
        badge="Scale ready"
        title="Multi-venue growth?"
        detail="Ports can swap to event streams, durable limits, policy stores, and signed audit logs."
      />
    </section>
  );
}
