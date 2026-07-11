import type {
  CompiledDecision,
  GeneratedCandidate,
} from "../../src/domain/entities/decision";
import type { IncidentContext } from "../../src/domain/entities/incident";

export function buildIncident(
  overrides: Partial<IncidentContext> = {},
): IncidentContext {
  return {
    id: "incident-1",
    code: "OPS-204",
    title: "East Concourse pressure",
    summary: "A scanner failure redirects arrivals toward a constrained route.",
    venue: "Harbor Stadium",
    event: "International tournament · Group stage",
    receivedAt: "2026-07-11T18:42:10.000Z",
    zone: "East Concourse · E7",
    affectedPeople: 4380,
    signals: [
      {
        id: "signal-crowd",
        category: "crowd",
        label: "Pressure ratio",
        value: "1.18",
        severity: "critical",
        evidenceId: "ev-crowd",
      },
      {
        id: "signal-transport",
        category: "transport",
        label: "Transit headway",
        value: "8 min",
        severity: "watch",
        evidenceId: "ev-transport",
      },
    ],
    evidence: [
      {
        id: "ev-crowd",
        title: "East Concourse aggregate counter",
        source: "Synthetic occupancy feed",
        observedAt: "2026-07-11T18:42:02.000Z",
        freshness: "fresh",
        excerpt: "Modeled occupancy is 118% of the safe operating envelope.",
      },
      {
        id: "ev-transport",
        title: "Blue Line headway",
        source: "Synthetic transit feed",
        observedAt: "2026-07-11T18:41:20.000Z",
        freshness: "fresh",
        excerpt: "An eight-minute headway can absorb a metered release.",
      },
    ],
    constraints: {
      maximumPressureRatio: 0.95,
      minimumAccessibleRoutePercent: 90,
      targetAccessibleRoutePercent: 95,
      minimumTransportFitPercent: 90,
      maximumDecisionLatencySeconds: 90,
    },
    baseline: {
      decisionLatencySeconds: 380,
      peakPressureRatio: 1.18,
      accessibleRoutePercent: 62,
      transportFitPercent: 71,
      instructionClarityPercent: 43,
      operationalCarbonKg: 286,
    },
    ...overrides,
  };
}

export function buildCandidate(
  overrides: Partial<GeneratedCandidate> = {},
): GeneratedCandidate {
  return {
    id: "candidate-balanced",
    title: "Meter East + protect North Loop",
    strategy: "Meter arrivals while reserving step-free capacity.",
    confidence: "medium",
    rationale: "This contains pressure without transferring risk.",
    actions: [
      {
        id: "action-1",
        sequence: 1,
        owner: "Gate supervisor",
        location: "Gate E7",
        instruction: "Meter entry to 45 people per minute.",
        dueInSeconds: 30,
        fallback: "Pause entry and call the crowd lead.",
        evidenceIds: ["ev-crowd"],
      },
    ],
    messages: [
      {
        locale: "en",
        localeLabel: "English",
        headline: "Use the North Loop",
        body: "Follow staff to the North Loop.",
        accessibleAlternative: "The North Loop remains step-free.",
        humanReviewRequired: false,
      },
      {
        locale: "es",
        localeLabel: "Español",
        headline: "Use el circuito norte",
        body: "Siga al personal hacia el circuito norte.",
        accessibleAlternative: "La ruta permanece sin escalones.",
        humanReviewRequired: true,
      },
      {
        locale: "fr",
        localeLabel: "Français",
        headline: "Utilisez la boucle nord",
        body: "Suivez le personnel vers la boucle nord.",
        accessibleAlternative: "Le trajet reste sans marches.",
        humanReviewRequired: true,
      },
    ],
    impact: {
      decisionLatencySeconds: 74,
      peakPressureRatio: 0.88,
      accessibleRoutePercent: 96,
      transportFitPercent: 93,
      instructionClarityPercent: 100,
      operationalCarbonKg: 214,
    },
    evidenceIds: ["ev-crowd", "ev-transport"],
    ...overrides,
  };
}

export function buildCompiledDecision(): CompiledDecision {
  const incident = buildIncident();
  const candidate = buildCandidate();

  return {
    id: "decision-1",
    incident,
    selected: {
      ...candidate,
      checks: [],
      score: 87,
      disposition: "eligible",
      rejectionReason: null,
    },
    alternatives: [],
    receipt: {
      mode: "replay",
      provider: "Pinned replay",
      model: "Gemini structured-output fixture",
      promptVersion: "resolve90-v1.0",
      generatedAt: "2026-07-11T18:42:35.000Z",
      note: "Replay mode is deterministic.",
    },
    compiledAt: "2026-07-11T18:42:36.000Z",
    state: "awaiting-approval",
  };
}
