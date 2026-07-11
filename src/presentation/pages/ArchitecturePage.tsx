import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { Icon } from "../../shared/components/Icon";

const layers = [
  {
    number: "01",
    title: "Presentation Layer",
    description:
      "Accessible React renders state and invokes use cases. No risk math, validation, or fetch calls.",
    modules: ["pages + components", "workflow hook", "lazy route shell"],
  },
  {
    number: "02",
    title: "Application Layer",
    description:
      "Use cases orchestrate incident retrieval, generation, guardrails, approval, and audit ports.",
    modules: ["CompileIncident", "ApproveDecision", "typed ports"],
  },
  {
    number: "03",
    title: "Domain Layer · safety kernel",
    description:
      "Pure rules rank plans and veto unsafe, inaccessible, ungrounded, or incomplete output.",
    modules: ["evaluateCandidate", "selectDecision", "approveDecision"],
  },
  {
    number: "04",
    title: "Infrastructure Layer · adapters",
    description:
      "Replay, Gemini gateway, repositories, clocks, and audit implementations plug into ports.",
    modules: ["Gemini / Replay", "Zod schemas", "server gateway"],
  },
] as const;

const aiPipeline = [
  ["1", "Bound input", "32 KiB body + typed signal schema"],
  ["2", "Ground prompt", "Evidence-ID allowlist + policy context"],
  ["3", "Generate", "Gemini JSON schema or pinned replay"],
  ["4", "Challenge", "Deterministic safety + access vetoes"],
  ["5", "Approve", "Human acknowledgement + audit receipt"],
] as const;

export default function ArchitecturePage(): React.JSX.Element {
  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · architecture"
        title="AI outside. Safety inside."
        summary="A clean modular monolith keeps provider uncertainty at the edge and deterministic operational invariants in a small, testable domain core."
        status="4 explicit dependency boundaries"
      />

      <section className="content-section" aria-labelledby="layers-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">Visual system architecture</p>
            <h2 id="layers-title">
              Dependencies point toward the safety kernel
            </h2>
          </div>
          <p>
            Presentation and infrastructure never become sources of operational
            truth. Both call inward through typed application contracts.
          </p>
        </div>
        <div className="architecture-canvas">
          <div className="architecture-layers">
            {layers.map((layer) => (
              <article className="architecture-layer" key={layer.number}>
                <span className="architecture-layer__number">
                  LAYER {layer.number}
                </span>
                <h3>{layer.title}</h3>
                <p>{layer.description}</p>
                <ul>
                  {layer.modules.map((module) => (
                    <li key={module}>{module}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="architecture-caption">
            <span>Provider edge</span>
            Infrastructure → application ports → domain invariants ←
            presentation use cases
            <span>Human edge</span>
          </p>
        </div>
      </section>

      <section className="content-section" aria-labelledby="ai-boundary-title">
        <div className="section-intro">
          <div>
            <p className="section-kicker">AI trust boundary</p>
            <h2 id="ai-boundary-title">Generated output is untrusted input</h2>
          </div>
          <p>
            The model synthesizes language and sequence. It cannot define
            evidence, capacity thresholds, approval state, or real-world
            authority.
          </p>
        </div>
        <div className="ai-boundary">
          {aiPipeline.map(([number, title, note]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </section>

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
          <article>
            <Icon name="code" />
            <h3>No business logic in UI</h3>
            <p>
              Components only format application state. Pressure scoring,
              accessibility floors, selection, and approval live in pure domain
              services.
            </p>
          </article>
          <article>
            <Icon name="lock" />
            <h3>No provider secret in client</h3>
            <p>
              The browser calls a same-origin gateway. Gemini credentials, model
              allowlists, prompt policy, and rate limits remain server-side.
            </p>
          </article>
          <article>
            <Icon name="shield" />
            <h3>No model authority</h3>
            <p>
              A state transition to approved requires both human
              acknowledgements and a successful append-only audit-port write.
            </p>
          </article>
        </div>
      </section>

      <section
        className="content-section two-column"
        aria-label="Failure and scaling architecture"
      >
        <article className="evidence-card">
          <div className="evidence-card__top">
            <span className="evidence-card__icon">
              <Icon name="warning" />
            </span>
            <span className="status-pill status-pill--pass">Fail closed</span>
          </div>
          <h3>Provider unavailable?</h3>
          <p>
            No partial result is accepted. The operator sees a typed recovery
            state and may choose the explicitly labeled deterministic replay.
          </p>
        </article>
        <article className="evidence-card">
          <div className="evidence-card__top">
            <span className="evidence-card__icon">
              <Icon name="route" />
            </span>
            <span className="status-pill status-pill--pass">Scale ready</span>
          </div>
          <h3>Multi-venue growth?</h3>
          <p>
            Swap ports for an event stream, durable limiter, versioned policy
            store, and signed audit log without moving domain invariants.
          </p>
        </article>
      </section>
    </div>
  );
}
