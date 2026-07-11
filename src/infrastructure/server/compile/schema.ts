import { z } from "zod";

export const geminiResponseSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(z.object({ text: z.string() })).min(1),
        }),
      }),
    )
    .min(1),
});

export const OUTPUT_SCHEMA = {
  type: "object",
  required: ["candidates"],
  additionalProperties: false,
  properties: {
    candidates: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "title",
          "strategy",
          "confidence",
          "rationale",
          "actions",
          "messages",
          "impact",
          "evidenceIds",
        ],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          strategy: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          rationale: { type: "string" },
          actions: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "id",
                "sequence",
                "owner",
                "location",
                "instruction",
                "dueInSeconds",
                "fallback",
                "evidenceIds",
              ],
              properties: {
                id: { type: "string" },
                sequence: { type: "integer" },
                owner: {
                  type: "string",
                  enum: [
                    "Accessibility lead",
                    "Crowd lead",
                    "Gate supervisor",
                    "Mobility lead",
                    "Transport liaison",
                    "Volunteer captain",
                  ],
                },
                location: { type: "string" },
                instruction: { type: "string" },
                dueInSeconds: { type: "integer" },
                fallback: { type: "string" },
                evidenceIds: { type: "array", items: { type: "string" } },
              },
            },
          },
          messages: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "locale",
                "localeLabel",
                "headline",
                "body",
                "accessibleAlternative",
                "humanReviewRequired",
              ],
              properties: {
                locale: { type: "string", enum: ["en", "es", "fr"] },
                localeLabel: { type: "string" },
                headline: { type: "string" },
                body: { type: "string" },
                accessibleAlternative: { type: "string" },
                humanReviewRequired: { type: "boolean" },
              },
            },
          },
          impact: {
            type: "object",
            additionalProperties: false,
            required: [
              "decisionLatencySeconds",
              "peakPressureRatio",
              "accessibleRoutePercent",
              "transportFitPercent",
              "instructionClarityPercent",
              "operationalCarbonKg",
            ],
            properties: {
              decisionLatencySeconds: { type: "number" },
              peakPressureRatio: { type: "number" },
              accessibleRoutePercent: { type: "number" },
              transportFitPercent: { type: "number" },
              instructionClarityPercent: { type: "number" },
              operationalCarbonKg: { type: "number" },
            },
          },
          evidenceIds: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;
