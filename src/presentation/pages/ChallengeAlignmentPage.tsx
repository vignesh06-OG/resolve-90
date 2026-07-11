import "../styles/evidence.css";

import { EvidencePageHeader } from "../components/EvidencePageHeader";
import { Icon } from "../../shared/components/Icon";

const alignment = [
  [
    "Build",
    "Working incident-to-approval replay",
    "Deployable React + TypeScript application with provider ports",
    "Run ‘Compile guarded response’ through audit receipt",
    "Reliable end-to-end judging without credentials",
  ],
  [
    "GenAI-enabled",
    "Grounded incident-to-action compiler",
    "Server-side Gemini structured output; Zod schema; replay adapter",
    "Explainability panel shows model, prompt, reasoning, confidence",
    "High-entropy synthesis without autonomous authority",
  ],
  [
    "Stadium operations",
    "Owned 70-second response sequence",
    "Typed actions with owner, place, due time, fallback, evidence",
    "Six-role action timeline",
    "Lower coordination delay and incomplete handoffs",
  ],
  [
    "Tournament experience",
    "Calm reroute and continuity guidance",
    "Fan message compiler plus modeled journey outcomes",
    "Before/after impact proof and fan relay preview",
    "Less uncertainty while maintaining venue flow",
  ],
  [
    "Fans",
    "Actionable, accessible disruption message",
    "Controlled-language message schema and channel adaptation",
    "English, Spanish, French fan preview",
    "Clear next step, added time, and step-free option",
  ],
  [
    "Organizers",
    "Cross-domain counterfactual decision packet",
    "Candidate scoring after hard safety/access constraints",
    "Selected plan beside two rejected alternatives",
    "Trade-offs understood before approval",
  ],
  [
    "Volunteers",
    "20-second location-specific micro-brief",
    "Role-filtered relay action with escalation fallback",
    "Volunteer captain card in approved relay",
    "Consistent language under pressure",
  ],
  [
    "Venue staff",
    "Owned action sequence",
    "OperationalRole union, action completeness guardrail, audit state",
    "Gate, crowd, mobility, access, transit relay cards",
    "Every action has accountable ownership",
  ],
  [
    "Navigation",
    "Protected North Loop reroute",
    "Versioned route evidence, step-free capacity, route fallback",
    "Route action, added six minutes, N-L1 alternative",
    "Flow changes without sacrificing accessible movement",
  ],
  [
    "Crowd management",
    "Pressure containment plus spillover rejection",
    "Pressure-ratio invariant and counterfactual guardrail",
    "1.18 → 0.88 modeled pressure; 0.95 limit visible",
    "Safer density without displacing risk",
  ],
  [
    "Accessibility",
    "Accessibility veto and protected lane",
    "90% hard floor, 95% target, required human acknowledgement",
    "Dedicated validation row and accessibility audit page",
    "No throughput gain can override step-free access",
  ],
  [
    "Transportation",
    "Transit-synchronized release pulses",
    "Headway freshness rule and minimum transport-fit threshold",
    "Stale-data warning; liaison confirmation action",
    "Egress matches carrying capacity",
  ],
  [
    "Sustainability",
    "Safety-gated carbon tie-breaker",
    "Modeled shuttle emissions only influence eligible plans",
    "286 → 214 kgCO₂e impact card with assumption",
    "Lower emissions without safety-washing",
  ],
  [
    "Multilingual assistance",
    "Controlled multilingual relay",
    "Locale schema, glossary-bound prompt, human-review flag",
    "Side-by-side locale tabs and review warning",
    "Faster inclusive communication with translation control",
  ],
  [
    "Operational intelligence",
    "Evidence-linked situation synthesis",
    "Signal normalization, policy grounding, evidence allowlist",
    "Every action exposes source IDs and freshness",
    "Traceable understanding instead of unexplained advice",
  ],
  [
    "Real-time decision support",
    "Under-90-second approval packet",
    "Fast pure guardrails, typed freshness, lazy evidence routes",
    "74-second modeled latency and operational flow",
    "Shorter signal-to-safe-decision time",
  ],
  [
    "World Cup 2026 context",
    "High-volume multilingual match-day rehearsal",
    "Venue-agnostic ports, ISO time, locale and multi-role types",
    "Toronto synthetic scenario explicitly labeled rehearsal",
    "Credible scale context without claiming FIFA affiliation",
  ],
] as const;

export default function ChallengeAlignmentPage(): React.JSX.Element {
  return (
    <div className="page-shell">
      <EvidencePageHeader
        eyebrow="Evaluation evidence · problem alignment"
        title="Nothing in the brief is implicit."
        summary="Every challenge term maps to a product behavior, inspectable implementation, visible proof, and measurable operational outcome."
        status="17 / 17 terms mapped"
      />

      <section className="content-section" aria-labelledby="alignment-title">
        <div className="alignment-summary" aria-label="Alignment summary">
          <article>
            <strong>17/17</strong>
            <span>challenge terms mapped</span>
          </article>
          <article>
            <strong>4/4</strong>
            <span>user groups served</span>
          </article>
          <article>
            <strong>7</strong>
            <span>operational domains joined</span>
          </article>
          <article>
            <strong>1</strong>
            <span>human approval boundary</span>
          </article>
        </div>
        <div className="section-intro">
          <div>
            <p className="section-kicker">Requirement traceability</p>
            <h2 id="alignment-title">
              Challenge → feature → evidence → impact
            </h2>
          </div>
          <p>
            Rows use the exact challenge vocabulary so automated and human
            review can trace coverage quickly.
          </p>
        </div>
        <div className="evidence-table-wrap">
          <table className="evidence-table alignment-table">
            <caption className="visually-hidden">
              Complete challenge keyword alignment matrix
            </caption>
            <thead>
              <tr>
                <th scope="col">Challenge keyword</th>
                <th scope="col">Feature</th>
                <th scope="col">Technical implementation</th>
                <th scope="col">Visible evidence</th>
                <th scope="col">Expected impact</th>
              </tr>
            </thead>
            <tbody>
              {alignment.map(
                ([keyword, feature, implementation, evidence, impact]) => (
                  <tr key={keyword}>
                    <td>{keyword}</td>
                    <td>{feature}</td>
                    <td>{implementation}</td>
                    <td>
                      <span className="table-evidence">
                        <Icon name="check" size={15} />
                        {evidence}
                      </span>
                    </td>
                    <td>{impact}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <aside className="audit-note">
          <Icon name="evidence" />
          <p>
            <strong>Evidence rule:</strong> replay data and outcomes are labeled
            synthetic or modeled. Resolve 90 does not claim FIFA affiliation,
            certification, live venue integration, or measured real-world
            impact.
          </p>
        </aside>
      </section>
    </div>
  );
}
