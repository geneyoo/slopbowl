import { defaultConfig } from "./configs/default.js";
import { normalizeText } from "./normalize.js";
import { slopInputSchema, slopScoreConfigSchema } from "./schema.js";
import { evaluateMetrics } from "./signals/metrics.js";
import { evaluateRules } from "./signals/rules.js";
import type {
  ComponentResult,
  SlopAnalysis,
  SlopEvidence,
  SlopInput,
  SlopResult,
  SlopScoreConfig
} from "./types.js";

export const engineVersion = "0.1.0";

export function scoreText(text: string, config: SlopScoreConfig = defaultConfig): SlopResult {
  return scorePost({ text, source: "text" }, config);
}

export function scorePost(input: SlopInput, config: SlopScoreConfig = defaultConfig): SlopResult {
  const analysis = analyzePost(input, config);
  const parsedConfig = slopScoreConfigSchema.parse(config);
  const score = clamp(
    Math.round(
      analysis.components.reduce((sum, component) => sum + component.weightedScore, 0) *
        parsedConfig.calibration.scoreMultiplier
    ),
    parsedConfig.scoreRange.min,
    parsedConfig.scoreRange.max
  );

  return {
    score,
    label: labelForScore(score, parsedConfig),
    confidence: confidenceFor(analysis.normalized.wordCount, analysis.evidence.length, parsedConfig),
    configVersion: parsedConfig.version,
    engineVersion,
    components: analysis.components,
    evidence: analysis.evidence,
    summary: summarize(score, analysis.components),
    normalized: {
      wordCount: analysis.normalized.wordCount,
      urls: analysis.normalized.urls,
      hashtags: analysis.normalized.hashtags,
      mentions: analysis.normalized.mentions
    }
  };
}

export function analyzeText(text: string, config: SlopScoreConfig = defaultConfig): SlopAnalysis {
  return analyzePost({ text, source: "text" }, config);
}

export function analyzePost(input: SlopInput, config: SlopScoreConfig = defaultConfig): SlopAnalysis {
  const parsedInput = slopInputSchema.parse(input);
  const parsedConfig = slopScoreConfigSchema.parse(config);
  const normalized = normalizeText(parsedInput.text);
  const ruleEvidence = evaluateRules(normalized, parsedConfig.rules);
  const metricEvidence = evaluateMetrics(normalized, parsedConfig);
  const evidence = [...ruleEvidence, ...metricEvidence];
  const components = buildComponentResults(evidence, parsedConfig);

  return {
    configVersion: parsedConfig.version,
    engineVersion,
    normalized,
    evidence,
    components,
    config: {
      enabledRules: parsedConfig.rules.filter((rule) => rule.enabled !== false).length,
      disabledRules: parsedConfig.rules.filter((rule) => rule.enabled === false).length,
      componentWeights: Object.fromEntries(
        Object.entries(parsedConfig.components).map(([id, component]) => [id, component.weight])
      ),
      scoreMultiplier: parsedConfig.calibration.scoreMultiplier
    }
  };
}

function buildComponentResults(
  evidence: SlopEvidence[],
  config: SlopScoreConfig
): ComponentResult[] {
  return Object.entries(config.components).map(([id, component]) => {
    const componentEvidence = evidence.filter((item) => item.component === id);
    const rawScore = clamp(
      componentEvidence.reduce((sum, item) => sum + item.points, 0),
      0,
      component.cap
    );

    return {
      id,
      rawScore,
      weightedScore: rawScore * component.weight,
      weight: component.weight,
      evidence: componentEvidence
    };
  });
}

function labelForScore(score: number, config: SlopScoreConfig): string {
  return config.labels.find((label) => score >= label.min && score <= label.max)?.id ?? "unknown";
}

function confidenceFor(wordCount: number, evidenceCount: number, config: SlopScoreConfig): number {
  const base = Math.min(0.95, 0.35 + evidenceCount * 0.08);
  const adjusted = wordCount < 8 ? base - config.metrics.shortTextConfidencePenalty : base;
  return Number(clamp(adjusted, 0.1, 0.95).toFixed(2));
}

function summarize(score: number, components: ComponentResult[]): string {
  const top = components
    .filter((component) => component.rawScore > 0)
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 3)
    .map((component) => component.id);

  if (top.length === 0) {
    return "Low visible slop from deterministic checks.";
  }

  const level = score >= 75 ? "High" : score >= 50 ? "Moderate" : "Light";
  return `${level} slop signal driven by ${top.join(", ")}.`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
