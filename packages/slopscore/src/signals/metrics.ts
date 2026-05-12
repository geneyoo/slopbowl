import type { MetricEvidence, NormalizedText, SlopScoreConfig } from "../types.js";

const strongClaimTerms = new Set([
  "always",
  "never",
  "everyone",
  "nobody",
  "proven",
  "guaranteed",
  "truth",
  "fact"
]);

const evidenceTerms = new Set([
  "source",
  "study",
  "data",
  "research",
  "paper",
  "report",
  "citation"
]);

export function evaluateMetrics(normalized: NormalizedText, config: SlopScoreConfig): MetricEvidence[] {
  const evidence: MetricEvidence[] = [];
  const hasUrl = normalized.urls.length > 0;
  const strongClaimCount = normalized.tokens.filter((token) => strongClaimTerms.has(token)).length;
  const evidenceTermCount = normalized.tokens.filter((token) => evidenceTerms.has(token)).length;

  if (!hasUrl && strongClaimCount >= 2) {
    evidence.push({
      id: "strong_claim_without_url",
      component: "weakEvidence",
      value: strongClaimCount,
      points: config.metrics.strongClaimWithoutUrlPenalty,
      description: "Strong absolute claims without an external source URL."
    });
  }

  if (hasUrl && evidenceTermCount > 0) {
    evidence.push({
      id: "evidence_with_url_discount",
      component: "weakEvidence",
      value: evidenceTermCount,
      points: config.metrics.evidenceDiscountWithUrl,
      description: "Evidence language appears alongside at least one URL."
    });
  }

  if (normalized.allCapsTokenCount >= 2) {
    evidence.push({
      id: "all_caps_burst",
      component: "formatSpam",
      value: normalized.allCapsTokenCount,
      points: normalized.allCapsTokenCount * config.metrics.allCapsPenalty,
      description: "Multiple all-caps tokens."
    });
  }

  if (normalized.exclamationCount + normalized.questionCount >= 4) {
    evidence.push({
      id: "punctuation_burst",
      component: "formatSpam",
      value: normalized.exclamationCount + normalized.questionCount,
      points: config.metrics.punctuationBurstPenalty,
      description: "High punctuation density."
    });
  }

  return evidence;
}

