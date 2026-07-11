# Phase 0 — Concept Evaluation

**Challenge:** PromptWars Challenge 4 — Smart Stadiums & Tournament Operations  
**Decision date:** 2026-07-11  
**Decision rule:** Do not optimize for the number of features. Optimize for a memorable, deployable operational decision that has measurable fan and staff outcomes.

## 1. Challenge keyword extraction

### Direct challenge terms

- **Build** — a working, inspectable product rather than a concept deck.
- **GenAI-enabled solution** — generation must be consequential, grounded, structured, and auditable; it must not be a decorative chat surface.
- **Enhances stadium operations** — reduce detection-to-decision time, coordination cost, and unsafe crowd density.
- **Overall tournament experience** — preserve fan confidence, continuity, inclusion, and journey quality.
- **Fans** — receive accessible, calm, multilingual instructions with realistic alternatives.
- **Organizers** — receive cross-domain impact forecasts and an approval-grade decision packet.
- **Volunteers** — receive short, location-specific scripts and escalation guidance.
- **Venue staff** — receive role-specific actions, owners, deadlines, and acknowledgement state.
- **Navigation** — continuously reroute flows rather than show a static map.
- **Crowd management** — detect pressure, model intervention outcomes, and avoid displacement of risk.
- **Accessibility** — protect accessible routes, sensory needs, step-free capacity, and WCAG 2.2 AA access.
- **Transportation** — account for gates, transit headways, road disruption, and last-mile load.
- **Sustainability** — show intervention-level carbon and waste implications, not a generic ESG claim.
- **Multilingual assistance** — generate controlled-language instructions with translation risk controls.
- **Operational intelligence** — turn heterogeneous signals into evidence-backed, cross-domain understanding.
- **Real-time decision support** — shorten signal-to-safe-action latency while preserving human approval.
- **FIFA World Cup 2026** — multi-venue, multilingual, high-volume, high-consequence, and North America-hosted tournament context.

### Evaluation terms inferred from the brief

- Code quality, architecture, typing, validation, testability, security, privacy, performance, accessibility, observability, documentation, deployment readiness, and visible evidence.

## 2. Concepts considered

Scoring is 1–10. **Engineering leverage** rewards meaningful technical depth that remains feasible in a hackathon; needless complexity scores low. Weighted total: originality 20%, feasibility 15%, scalability 15%, evaluation visibility 20%, engineering leverage 10%, problem alignment 20%.

| # | Concept | Core operational decision | O | F | S | V | E | A | Weighted |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | Generic multilingual venue chatbot | Answer fan questions | 2 | 9 | 7 | 5 | 3 | 6 | 5.15 |
| 2 | Static smart stadium dashboard | Visualize venue KPIs | 2 | 8 | 8 | 6 | 4 | 6 | 5.55 |
| 3 | AI map recommendation viewer | Recommend a gate or route | 3 | 8 | 7 | 6 | 4 | 7 | 5.90 |
| 4 | Tournament CRUD command center | Manage incidents and tasks | 2 | 8 | 8 | 5 | 4 | 6 | 5.30 |
| 5 | **Resolve 90 — incident-to-action compiler** | Compile one safe, coordinated 90-second response from conflicting live signals | **10** | **9** | **9** | **10** | **9** | **10** | **9.60** |
| 6 | Crowd pressure digital twin | Predict density propagation between zones | 8 | 6 | 8 | 8 | 9 | 9 | 8.05 |
| 7 | Accessible route capacity exchange | Reserve and rebalance step-free route capacity | 9 | 7 | 8 | 8 | 8 | 9 | 8.25 |
| 8 | Volunteer micro-brief generator | Generate role/location-specific staff briefings | 7 | 9 | 8 | 8 | 6 | 8 | 7.80 |
| 9 | Multilingual safety phrase compiler | Produce controlled-language emergency messages with back-translation checks | 8 | 8 | 9 | 8 | 7 | 8 | 8.10 |
| 10 | Transit pulse synchronizer | Coordinate release waves with transit headways | 8 | 7 | 9 | 8 | 8 | 9 | 8.25 |
| 11 | Carbon-aware egress orchestrator | Select egress interventions by safety and emissions | 9 | 6 | 8 | 8 | 8 | 8 | 7.85 |
| 12 | Lost-party reunification protocol | Generate privacy-preserving reunification steps | 8 | 7 | 7 | 8 | 7 | 8 | 7.65 |
| 13 | Sensory load guardian | Forecast noise/light/queue stress and open low-sensory alternatives | 9 | 7 | 7 | 9 | 7 | 8 | 7.95 |
| 14 | Supply shock playbook generator | Reallocate water, medical, and sanitation resources | 7 | 8 | 8 | 8 | 7 | 8 | 7.75 |
| 15 | Weather-to-operations compiler | Convert heat/storm alerts into venue-wide role actions | 7 | 8 | 9 | 8 | 7 | 9 | 8.15 |
| 16 | Policy conflict resolver | Detect contradictions across security, accessibility, and transit SOPs | 9 | 7 | 9 | 8 | 9 | 9 | 8.50 |
| 17 | Shift handover intelligence capsule | Generate evidence-linked continuity briefs | 7 | 9 | 8 | 8 | 6 | 8 | 7.80 |
| 18 | Counterfactual intervention lab | Compare crowd actions before approval | 9 | 7 | 9 | 9 | 9 | 9 | 8.70 |
| 19 | Venue-to-venue risk transfer network | Detect displaced transport/crowd risk across tournament sites | 10 | 5 | 10 | 8 | 9 | 9 | 8.45 |
| 20 | Explainable queue fairness engine | Balance wait time without penalizing accessible/family lanes | 9 | 8 | 8 | 9 | 8 | 9 | 8.55 |
| 21 | Rumor containment evidence engine | Turn social reports into verified, non-amplifying public guidance | 9 | 7 | 9 | 8 | 8 | 8 | 8.15 |
| 22 | Post-match learning synthesizer | Convert decisions and outcomes into next-match policy changes | 8 | 9 | 9 | 8 | 7 | 8 | 8.20 |

## 3. Rejections

Concepts 1–4 are explicitly rejected because they are ordinary interaction patterns rather than defensible operational systems. They expose features, not better decisions.

Concepts 6–22 each solve a valuable slice, but a single-slice product leaves challenge keywords and evaluator categories weakly connected. Several also require unavailable infrastructure or datasets for a credible live demo.

## 4. Selected concept — Resolve 90

### One-line proposition

**Resolve 90 compiles fragmented venue signals into a grounded, accessibility-preserving, multilingual action packet that a human commander can understand and approve in under 90 seconds.**

### Why it wins

1. **GenAI is consequential:** generation transforms evidence and policies into structured role actions, fan messages, accessible alternatives, and explicit uncertainty—not a chat answer.
2. **Human authority is preserved:** the engine recommends and explains; a commander approves. Destructive or high-risk actions are never autonomous.
3. **Cross-domain conflicts are visible:** a gate closure can reduce crowd pressure while harming step-free access and transit loading. Resolve 90 identifies and repairs that conflict before execution.
4. **Impact is measurable:** the demo exposes projected decision latency, crowd pressure, accessible-route preservation, transport fit, and avoided carbon.
5. **The experience is memorable:** one high-pressure incident unfolds as a decision narrative: signals → constraints → alternatives → selected packet → role relay → impact proof.
6. **The product remains demoable offline:** a deterministic scenario/replay adapter provides stable evidence. The production architecture keeps Gemini calls server-side behind a typed provider port.

## 5. Core product loop

1. **Detect:** ingest a synthetic or provider-backed incident signal bundle.
2. **Ground:** retrieve relevant policies, venue facts, capacity constraints, and accessibility commitments.
3. **Generate:** create a typed candidate plan with actions, messages, risks, and evidence references.
4. **Challenge:** deterministic guardrails reject unsupported claims, inaccessible routes, unsafe capacity, missing owners, or policy conflicts.
5. **Compare:** display counterfactual impact for the candidate and two alternatives.
6. **Approve:** require explicit human acknowledgement, especially for low-confidence or safety-critical steps.
7. **Relay:** present role-specific staff/volunteer cards and controlled-language fan guidance.
8. **Learn:** append an immutable audit event and calculate outcome metrics.

## 6. Non-goals

- No biometric identification or facial recognition.
- No individual fan tracking.
- No autonomous gate, security, medical, or evacuation control.
- No claim of real sensor connectivity in demo mode.
- No decorative chatbot.
- No generalized analytics dashboard.
- No unverified translation presented as authoritative.

## 7. Product thesis

The scarce resource during a stadium disruption is not another chart; it is **shared, policy-grounded understanding under time pressure**. Resolve 90 is a decision compiler, not a dashboard. Its UI exists to make one consequential decision safer, faster, more inclusive, and auditable.
