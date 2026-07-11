import { z } from "zod";

const boundedId = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/);
const boundedText = z.string().trim().min(1).max(800);
const isoDateTime = z.iso.datetime({ offset: true });

const evidenceSchema = z
  .object({
    id: boundedId,
    title: boundedText,
    source: boundedText,
    observedAt: isoDateTime,
    freshness: z.enum(["fresh", "stale"]),
    excerpt: boundedText,
  })
  .strict();

const signalSchema = z
  .object({
    id: boundedId,
    category: z.enum([
      "accessibility",
      "crowd",
      "operations",
      "sustainability",
      "transport",
    ]),
    label: boundedText,
    value: boundedText,
    severity: z.enum(["critical", "elevated", "watch"]),
    evidenceId: boundedId,
  })
  .strict();

const impactSchema = z
  .object({
    decisionLatencySeconds: z.number().nonnegative().max(3600),
    peakPressureRatio: z.number().nonnegative().max(5),
    accessibleRoutePercent: z.number().min(0).max(100),
    transportFitPercent: z.number().min(0).max(100),
    instructionClarityPercent: z.number().min(0).max(100),
    operationalCarbonKg: z.number().nonnegative().max(100_000),
  })
  .strict();

export const incidentSchema = z
  .object({
    id: boundedId,
    code: z.string().trim().min(1).max(30),
    title: boundedText,
    summary: boundedText,
    venue: boundedText,
    event: boundedText,
    receivedAt: isoDateTime,
    zone: boundedText,
    affectedPeople: z.number().int().nonnegative().max(200_000),
    signals: z.array(signalSchema).min(1).max(30),
    evidence: z.array(evidenceSchema).min(1).max(60),
    constraints: z
      .object({
        maximumPressureRatio: z.number().positive().max(5),
        minimumAccessibleRoutePercent: z.number().min(0).max(100),
        targetAccessibleRoutePercent: z.number().min(0).max(100),
        minimumTransportFitPercent: z.number().min(0).max(100),
        maximumDecisionLatencySeconds: z.number().positive().max(3600),
      })
      .strict(),
    baseline: impactSchema,
  })
  .strict();

const actionSchema = z
  .object({
    id: boundedId,
    sequence: z.number().int().positive().max(30),
    owner: z.enum([
      "Accessibility lead",
      "Crowd lead",
      "Gate supervisor",
      "Mobility lead",
      "Transport liaison",
      "Volunteer captain",
    ]),
    location: boundedText,
    instruction: boundedText,
    dueInSeconds: z.number().int().positive().max(1800),
    fallback: boundedText,
    evidenceIds: z.array(boundedId).min(1).max(12),
  })
  .strict();

const messageSchema = z
  .object({
    locale: z.enum(["en", "es", "fr"]),
    localeLabel: z.string().trim().min(1).max(40),
    headline: boundedText,
    body: boundedText,
    accessibleAlternative: boundedText,
    humanReviewRequired: z.boolean(),
  })
  .strict();

export const generatedCandidateSchema = z
  .object({
    id: boundedId,
    title: boundedText,
    strategy: boundedText,
    confidence: z.enum(["high", "medium", "low"]),
    rationale: boundedText,
    actions: z.array(actionSchema).min(1).max(20),
    messages: z.array(messageSchema).min(3).max(6),
    impact: impactSchema,
    evidenceIds: z.array(boundedId).min(1).max(30),
  })
  .strict();

const receiptSchema = z
  .object({
    mode: z.enum(["live", "replay"]),
    provider: boundedText,
    model: boundedText,
    promptVersion: z.string().trim().min(1).max(80),
    generatedAt: isoDateTime,
    note: boundedText,
  })
  .strict();

export const generatedResponseSchema = z
  .object({
    candidates: z.array(generatedCandidateSchema).min(1).max(5),
    receipt: receiptSchema,
  })
  .strict();

export const compileRequestSchema = z
  .object({ incident: incidentSchema })
  .strict();

export const providerCandidateEnvelopeSchema = z
  .object({
    candidates: z.array(generatedCandidateSchema).min(3).max(3),
  })
  .strict();
