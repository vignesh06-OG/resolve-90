import type {
  FanMessage,
  GeneratedCandidate,
  GeneratedResponse,
} from "../../domain/entities/decision";
import type { IncidentContext } from "../../domain/entities/incident";

const PRIORITY_MESSAGES: readonly FanMessage[] = [
  {
    locale: "en",
    localeLabel: "English",
    headline: "East entry is moving more slowly",
    body: "Please follow the teal North Loop signs. Allow 6 extra minutes and keep the central lane clear for step-free access.",
    accessibleAlternative:
      "For a step-free route, use North Lift N-L1. A mobility steward is waiting at the teal beacon.",
    humanReviewRequired: false,
  },
  {
    locale: "es",
    localeLabel: "Español",
    headline: "El acceso este avanza más despacio",
    body: "Siga las señales turquesas del circuito norte. Calcule 6 minutos más y deje libre el carril central para el acceso sin escalones.",
    accessibleAlternative:
      "Para una ruta sin escalones, use el ascensor norte N-L1. Hay personal de movilidad en la señal turquesa.",
    humanReviewRequired: true,
  },
  {
    locale: "fr",
    localeLabel: "Français",
    headline: "L’entrée Est avance plus lentement",
    body: "Suivez les panneaux turquoise de la boucle nord. Prévoyez 6 minutes de plus et laissez la voie centrale libre pour l’accès sans marches.",
    accessibleAlternative:
      "Pour un trajet sans marches, utilisez l’ascenseur nord N-L1. Un agent de mobilité vous attend à la balise turquoise.",
    humanReviewRequired: true,
  },
];

export const EAST_CONCOURSE_INCIDENT: IncidentContext = {
  id: "east-concourse-204",
  code: "OPS-204",
  title: "East Concourse compression",
  summary:
    "A scanner-bank fault is compressing arrivals at E7 while the nearest lift is unavailable. A simple gate closure would move the queue onto the only protected step-free path.",
  venue: "Harbor Stadium · Toronto scenario",
  event: "World Cup 2026 operations rehearsal · Match day",
  receivedAt: "2026-06-19T18:42:10.000Z",
  zone: "East Concourse · Gate E7",
  affectedPeople: 4380,
  signals: [
    {
      id: "sig-crowd-east",
      category: "crowd",
      label: "Crowd pressure",
      value: "1.18 ratio",
      severity: "critical",
      evidenceId: "ev-crowd-17",
    },
    {
      id: "sig-scanner-e7",
      category: "operations",
      label: "Scanner throughput",
      value: "−34%",
      severity: "critical",
      evidenceId: "ev-scanner-e7",
    },
    {
      id: "sig-lift-el2",
      category: "accessibility",
      label: "East lift E-L2",
      value: "offline",
      severity: "critical",
      evidenceId: "ev-lift-el2",
    },
    {
      id: "sig-blue-line",
      category: "transport",
      label: "Blue Line headway",
      value: "8 min · confirm",
      severity: "watch",
      evidenceId: "ev-transit-blue",
    },
    {
      id: "sig-shuttles",
      category: "sustainability",
      label: "Standby shuttle loop",
      value: "3 idling",
      severity: "watch",
      evidenceId: "ev-carbon-shuttle",
    },
  ],
  evidence: [
    {
      id: "ev-crowd-17",
      title: "East aggregate occupancy feed",
      source: "Synthetic overhead counter · 60s window",
      observedAt: "2026-06-19T18:42:02.000Z",
      freshness: "fresh",
      excerpt:
        "Modeled East Concourse occupancy is 118% of the safe operating envelope and rising 4% per minute.",
    },
    {
      id: "ev-scanner-e7",
      title: "E7 scanner-bank health",
      source: "Synthetic gate telemetry",
      observedAt: "2026-06-19T18:41:58.000Z",
      freshness: "fresh",
      excerpt:
        "Four of twelve scanners are unavailable; observed throughput is 34% below the configured match-day rate.",
    },
    {
      id: "ev-lift-el2",
      title: "Lift E-L2 maintenance state",
      source: "Synthetic venue asset registry",
      observedAt: "2026-06-19T18:41:49.000Z",
      freshness: "fresh",
      excerpt:
        "East lift E-L2 is unavailable. North lift N-L1 is serviceable at 22 people per minute.",
    },
    {
      id: "ev-route-north",
      title: "Protected North Loop route",
      source: "Versioned synthetic venue route graph v4.2",
      observedAt: "2026-06-19T18:40:00.000Z",
      freshness: "fresh",
      excerpt:
        "North Loop adds six minutes, remains step-free, and preserves a central 2.4 m protected lane.",
    },
    {
      id: "ev-transit-blue",
      title: "Blue Line outbound headway",
      source: "Synthetic transit operations feed",
      observedAt: "2026-06-19T18:38:20.000Z",
      freshness: "stale",
      excerpt:
        "Last confirmed headway was eight minutes. The transport liaison must reconfirm before synchronized release.",
    },
    {
      id: "ev-carbon-shuttle",
      title: "Standby shuttle estimate",
      source: "Synthetic fleet telemetry · modeled emissions",
      observedAt: "2026-06-19T18:41:40.000Z",
      freshness: "fresh",
      excerpt:
        "Three diesel shuttles are idling; releasing only one avoids an estimated 72 kgCO₂e over the response window.",
    },
    {
      id: "ev-policy-access",
      title: "Accessible egress policy §4.3",
      source: "Synthetic venue operating policy v6",
      observedAt: "2026-06-19T17:00:00.000Z",
      freshness: "fresh",
      excerpt:
        "A response may not reduce viable step-free route capacity below 90%; 95% is the operating target.",
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
};

const BALANCED_PLAN: GeneratedCandidate = {
  id: "plan-protected-pulse",
  title: "Protected North Loop pulse",
  strategy:
    "Meter East arrivals, reserve a step-free lane to North Lift N-L1, and synchronize a staged release with transit capacity.",
  confidence: "medium",
  rationale:
    "This is the only candidate that brings pressure below the safe limit while preserving the 95% accessibility target. Confidence remains medium until the transport liaison reconfirms the stale Blue Line headway.",
  actions: [
    {
      id: "act-meter-e7",
      sequence: 1,
      owner: "Gate supervisor",
      location: "Gate E7 scanner line",
      instruction:
        "Meter the East queue at 45 people per minute and keep the teal central lane unobstructed.",
      dueInSeconds: 20,
      fallback:
        "If pressure remains above 0.95 after two minutes, pause E7 admission and escalate to the crowd lead.",
      evidenceIds: ["ev-crowd-17", "ev-scanner-e7"],
    },
    {
      id: "act-protect-lane",
      sequence: 2,
      owner: "Accessibility lead",
      location: "East-to-North central lane",
      instruction:
        "Place two mobility stewards at teal beacons and protect the 2.4 m step-free lane to N-L1.",
      dueInSeconds: 30,
      fallback:
        "If N-L1 becomes unavailable, stop rerouting and activate the assisted-transfer protocol.",
      evidenceIds: ["ev-lift-el2", "ev-route-north", "ev-policy-access"],
    },
    {
      id: "act-open-n4",
      sequence: 3,
      owner: "Crowd lead",
      location: "North Gate N4",
      instruction:
        "Open the N4 reserve scanner bank and cap North Loop inflow at 62 people per minute.",
      dueInSeconds: 40,
      fallback:
        "If North pressure exceeds 0.90, reduce inflow to 40 people per minute.",
      evidenceIds: ["ev-crowd-17", "ev-route-north"],
    },
    {
      id: "act-route-beacons",
      sequence: 4,
      owner: "Mobility lead",
      location: "East Concourse decision points",
      instruction:
        "Switch three route beacons to the teal North Loop and retain the center-lane accessibility symbol.",
      dueInSeconds: 45,
      fallback:
        "Use handheld teal paddles if a beacon fails to acknowledge the update.",
      evidenceIds: ["ev-route-north", "ev-policy-access"],
    },
    {
      id: "act-confirm-transit",
      sequence: 5,
      owner: "Transport liaison",
      location: "Venue transport desk",
      instruction:
        "Reconfirm Blue Line headway, then authorize 90-second release pulses toward the station.",
      dueInSeconds: 60,
      fallback:
        "If headway exceeds ten minutes, hold the next release pulse and stage one low-floor shuttle.",
      evidenceIds: ["ev-transit-blue", "ev-carbon-shuttle"],
    },
    {
      id: "act-brief-volunteers",
      sequence: 6,
      owner: "Volunteer captain",
      location: "East and North wayfinding posts",
      instruction:
        "Deliver the 20-second route brief and point; do not tell fans that the route is closed.",
      dueInSeconds: 70,
      fallback:
        "Escalate route or accessibility questions to the nearest mobility steward.",
      evidenceIds: ["ev-route-north", "ev-lift-el2"],
    },
  ],
  messages: PRIORITY_MESSAGES,
  impact: {
    decisionLatencySeconds: 74,
    peakPressureRatio: 0.88,
    accessibleRoutePercent: 96,
    transportFitPercent: 93,
    instructionClarityPercent: 100,
    operationalCarbonKg: 214,
  },
  evidenceIds: [
    "ev-crowd-17",
    "ev-scanner-e7",
    "ev-lift-el2",
    "ev-route-north",
    "ev-transit-blue",
    "ev-carbon-shuttle",
    "ev-policy-access",
  ],
};

const INACCESSIBLE_PLAN: GeneratedCandidate = {
  ...BALANCED_PLAN,
  id: "plan-close-east",
  title: "Close East and divert South",
  strategy:
    "Close E7 immediately and send all arrivals across the South footbridge.",
  confidence: "high",
  rationale:
    "This produces a rapid pressure reduction but incorrectly assumes the South footbridge is an equivalent accessible route.",
  actions: BALANCED_PLAN.actions.slice(0, 3),
  impact: {
    decisionLatencySeconds: 41,
    peakPressureRatio: 0.76,
    accessibleRoutePercent: 42,
    transportFitPercent: 94,
    instructionClarityPercent: 86,
    operationalCarbonKg: 244,
  },
};

const DISPLACED_RISK_PLAN: GeneratedCandidate = {
  ...BALANCED_PLAN,
  id: "plan-broadcast-only",
  title: "Broadcast-only North diversion",
  strategy:
    "Send a broad North Gate message without metering East or reserving route capacity.",
  confidence: "medium",
  rationale:
    "This is quick to communicate but displaces the queue faster than North can absorb it.",
  actions: BALANCED_PLAN.actions.slice(3),
  impact: {
    decisionLatencySeconds: 29,
    peakPressureRatio: 0.99,
    accessibleRoutePercent: 91,
    transportFitPercent: 82,
    instructionClarityPercent: 78,
    operationalCarbonKg: 231,
  },
};

export const REPLAY_GENERATION: GeneratedResponse = {
  candidates: [BALANCED_PLAN, INACCESSIBLE_PLAN, DISPLACED_RISK_PLAN],
  receipt: {
    mode: "replay",
    provider: "Pinned structured-output replay",
    model: "Gemini 2.5 Flash response fixture",
    promptVersion: "resolve90-grounded-v1.0",
    generatedAt: "2026-06-19T18:42:35.000Z",
    note: "Deterministic replay for judging. It follows the same validated provider contract as Live mode.",
  },
};
