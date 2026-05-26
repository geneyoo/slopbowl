import { z } from "zod";

export const slopInputSchema = z.object({
  text: z.string().min(1),
  source: z.enum(["x", "threads", "text", "unknown"]).optional(),
  url: z.string().url().optional(),
  author: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export const ruleConfigSchema = z.object({
  id: z.string().min(1),
  component: z.string().min(1),
  type: z.enum(["regex", "token"]),
  pattern: z.string().optional(),
  tokens: z.array(z.string()).optional(),
  points: z.number(),
  enabled: z.boolean().optional(),
  maxMatches: z.number().int().positive().optional(),
  severity: z.enum(["low", "medium", "high"]).optional(),
  description: z.string().optional()
});

export const slopScoreConfigSchema = z.object({
  version: z.string().min(1),
  scoreRange: z.object({
    min: z.number(),
    max: z.number()
  }),
  labels: z.array(z.object({
    id: z.string(),
    min: z.number(),
    max: z.number()
  })),
  components: z.record(z.string(), z.object({
    weight: z.number().nonnegative(),
    cap: z.number().positive()
  })),
  rules: z.array(ruleConfigSchema),
  metrics: z.object({
    polishedLongformPenalty: z.number(),
    sentenceUniformityPenalty: z.number(),
    lowSpecificityPenalty: z.number(),
    emojiMarketingPenalty: z.number(),
    promoFormatPenalty: z.number(),
    personalTextureDiscount: z.number(),
    shortTextConfidencePenalty: z.number(),
    adjacentSlopWindow: z.number().nonnegative(),
    adjacentSlopThreshold: z.number().int().min(2),
    adjacentSlopPenalty: z.number(),
    polishedSurfacePenalty: z.number()
  }),
  calibration: z.object({
    scoreMultiplier: z.number().positive()
  })
});
