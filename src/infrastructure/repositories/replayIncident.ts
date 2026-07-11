import type { IncidentContext } from "../../domain/entities/incident";

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
