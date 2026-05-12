import type { MetricEvidence, NormalizedText, SlopScoreConfig } from "../types.js";

const specificTextureTerms = new Set([
  "because",
  "when",
  "where",
  "heard",
  "saw",
  "watched",
  "played",
  "interview",
  "quote",
  "source"
]);

export function evaluateMetrics(normalized: NormalizedText, config: SlopScoreConfig): MetricEvidence[] {
  const evidence: MetricEvidence[] = [];
  const emojiCount = [...normalized.original.matchAll(/\p{Extended_Pictographic}/gu)].length;
  const nonEmptyLineCount = normalized.original.split(/\n+/).map((line) => line.trim()).filter(Boolean).length;
  const hasPromoShape = /\b(try all|big scoops|bold|located|inside|food hall|address|las vegas)\b/i.test(normalized.original);
  const averageSentenceLength = normalized.sentences.length > 0
    ? normalized.wordCount / normalized.sentences.length
    : normalized.wordCount;
  const sentenceLengths = normalized.sentences.map((sentence) => sentence.split(/\s+/).filter(Boolean).length);
  const sentenceSpread = sentenceLengths.length > 1
    ? Math.max(...sentenceLengths) - Math.min(...sentenceLengths)
    : 0;
  const specificTextureCount = normalized.tokens.filter((token) => specificTextureTerms.has(token)).length;

  if (normalized.wordCount >= 80 && normalized.exclamationCount === 0 && normalized.questionCount === 0) {
    evidence.push({
      id: "polished_longform",
      component: "polishedTone",
      value: normalized.wordCount,
      points: config.metrics.polishedLongformPenalty,
      description: "Long, clean explanatory prose with no conversational punctuation."
    });
  }

  if (normalized.sentences.length >= 3 && sentenceSpread <= 8 && averageSentenceLength >= 18) {
    evidence.push({
      id: "sentence_uniformity",
      component: "polishedTone",
      value: sentenceSpread,
      points: config.metrics.sentenceUniformityPenalty,
      description: "Sentence lengths are unusually even for casual social text."
    });
  }

  if (normalized.wordCount >= 60 && specificTextureCount <= 1 && normalized.urls.length === 0) {
    evidence.push({
      id: "low_specificity_longform",
      component: "lowSpecificity",
      value: specificTextureCount,
      points: config.metrics.lowSpecificityPenalty,
      description: "Long post with little citation, sensory, or first-hand texture."
    });
  }

  if (specificTextureCount >= 3 || normalized.urls.length > 0) {
    evidence.push({
      id: "specific_texture_discount",
      component: "humanTexture",
      value: specificTextureCount + normalized.urls.length,
      points: config.metrics.personalTextureDiscount,
      description: "Specific or sourced details reduce LLM-likelihood."
    });
  }

  if (emojiCount >= 2 && hasPromoShape) {
    evidence.push({
      id: "emoji_marketing_burst",
      component: "socialFormat",
      value: emojiCount,
      points: emojiCount * config.metrics.emojiMarketingPenalty,
      description: "Multiple emoji in promotional copy."
    });
  }

  if (nonEmptyLineCount >= 3 && /\b(located|inside|rd|road|st|street|ave|blvd|las vegas)\b/i.test(normalized.original)) {
    evidence.push({
      id: "promo_line_structure",
      component: "socialFormat",
      value: nonEmptyLineCount,
      points: config.metrics.promoFormatPenalty,
      description: "Line-broken promotional caption with location/address structure."
    });
  }

  return evidence;
}
