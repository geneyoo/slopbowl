export { defaultConfig } from "./configs/default.js";
export { normalizeText } from "./normalize.js";
export { analyzePost, analyzeText, engineVersion, scorePost, scoreText } from "./scorer.js";
export type {
  ComponentResult,
  NormalizedText,
  RuleConfig,
  SlopAnalysis,
  SlopEvidence,
  SlopInput,
  SlopResult,
  SlopScoreConfig
} from "./types.js";
