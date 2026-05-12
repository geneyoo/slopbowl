export type SlopSource = "x" | "threads" | "text" | "unknown";

export interface SlopInput {
  text: string;
  source?: SlopSource;
  url?: string;
  author?: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedText {
  original: string;
  lower: string;
  tokens: string[];
  sentences: string[];
  urls: string[];
  hashtags: string[];
  mentions: string[];
  wordCount: number;
  exclamationCount: number;
  questionCount: number;
  allCapsTokenCount: number;
}

export type RuleType = "regex" | "token";

export interface RuleConfig {
  id: string;
  component: string;
  type: RuleType;
  pattern?: string;
  tokens?: string[];
  points: number;
  enabled?: boolean;
  maxMatches?: number;
  severity?: "low" | "medium" | "high";
  description?: string;
}

export interface ComponentConfig {
  weight: number;
  cap: number;
}

export interface LabelConfig {
  id: string;
  min: number;
  max: number;
}

export interface MetricConfig {
  strongClaimWithoutUrlPenalty: number;
  evidenceDiscountWithUrl: number;
  allCapsPenalty: number;
  punctuationBurstPenalty: number;
  shortTextConfidencePenalty: number;
}

export interface CalibrationConfig {
  scoreMultiplier: number;
}

export interface SlopScoreConfig {
  version: string;
  scoreRange: {
    min: number;
    max: number;
  };
  labels: LabelConfig[];
  components: Record<string, ComponentConfig>;
  rules: RuleConfig[];
  metrics: MetricConfig;
  calibration: CalibrationConfig;
}

export interface RuleEvidence {
  ruleId: string;
  component: string;
  match: string;
  index?: number;
  points: number;
  severity?: string;
}

export interface MetricEvidence {
  id: string;
  component: string;
  value: number;
  points: number;
  description: string;
}

export type SlopEvidence = RuleEvidence | MetricEvidence;

export interface ComponentResult {
  id: string;
  rawScore: number;
  weightedScore: number;
  weight: number;
  evidence: SlopEvidence[];
}

export interface SlopAnalysis {
  configVersion: string;
  engineVersion: string;
  normalized: NormalizedText;
  evidence: SlopEvidence[];
  components: ComponentResult[];
  config: {
    enabledRules: number;
    disabledRules: number;
    componentWeights: Record<string, number>;
    scoreMultiplier: number;
  };
}

export interface SlopResult {
  score: number;
  label: string;
  confidence: number;
  configVersion: string;
  engineVersion: string;
  components: ComponentResult[];
  evidence: SlopEvidence[];
  summary: string;
  normalized: Pick<NormalizedText, "wordCount" | "urls" | "hashtags" | "mentions">;
}
