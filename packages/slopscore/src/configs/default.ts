import type { SlopScoreConfig } from "../types.js";

export const defaultConfig: SlopScoreConfig = {
  version: "0.1.0",
  scoreRange: { min: 0, max: 100 },
  labels: [
    { id: "clean", min: 0, max: 24 },
    { id: "light_slop", min: 25, max: 49 },
    { id: "sloppy", min: 50, max: 74 },
    { id: "industrial_slop", min: 75, max: 100 }
  ],
  components: {
    bait: { weight: 0.22, cap: 100 },
    rage: { weight: 0.18, cap: 100 },
    weakEvidence: { weight: 0.2, cap: 100 },
    grift: { weight: 0.12, cap: 100 },
    aiSlop: { weight: 0.1, cap: 100 },
    contextCollapse: { weight: 0.12, cap: 100 },
    formatSpam: { weight: 0.06, cap: 100 }
  },
  metrics: {
    strongClaimWithoutUrlPenalty: 18,
    evidenceDiscountWithUrl: -8,
    allCapsPenalty: 4,
    punctuationBurstPenalty: 6,
    shortTextConfidencePenalty: 0.18
  },
  calibration: {
    scoreMultiplier: 3
  },
  rules: [
    {
      id: "nobody_is_talking_about",
      component: "bait",
      type: "regex",
      pattern: "\\bnobody is talking about\\b",
      points: 18,
      maxMatches: 1,
      severity: "medium"
    },
    {
      id: "they_dont_want_you_to_know",
      component: "bait",
      type: "regex",
      pattern: "\\bthey don'?t want you to know\\b",
      points: 24,
      maxMatches: 1,
      severity: "high"
    },
    {
      id: "bookmark_this",
      component: "bait",
      type: "regex",
      pattern: "\\b(bookmark this|save this|read that again)\\b",
      points: 12,
      maxMatches: 2,
      severity: "low"
    },
    {
      id: "thread_bait",
      component: "bait",
      type: "regex",
      pattern: "\\b(thread|mega thread|a thread)\\b",
      points: 10,
      maxMatches: 1,
      severity: "low"
    },
    {
      id: "changes_everything",
      component: "bait",
      type: "regex",
      pattern: "\\b(this changes everything|you won'?t believe|wait until you see)\\b",
      points: 20,
      maxMatches: 2,
      severity: "medium"
    },
    {
      id: "outrage_terms",
      component: "rage",
      type: "token",
      tokens: ["insane", "unhinged", "clown", "disgusting", "evil", "deranged"],
      points: 9,
      maxMatches: 5,
      severity: "medium"
    },
    {
      id: "absolutely_wild",
      component: "rage",
      type: "regex",
      pattern: "\\babsolutely wild\\b",
      points: 14,
      maxMatches: 1,
      severity: "medium"
    },
    {
      id: "wake_up",
      component: "rage",
      type: "regex",
      pattern: "\\bwake up\\b",
      points: 16,
      maxMatches: 1,
      severity: "medium"
    },
    {
      id: "fake_authority",
      component: "weakEvidence",
      type: "regex",
      pattern: "\\b(studies show|experts agree|the science is settled|everyone knows|proven)\\b",
      points: 16,
      maxMatches: 4,
      severity: "medium"
    },
    {
      id: "absolute_claims",
      component: "weakEvidence",
      type: "token",
      tokens: ["always", "never", "everyone", "nobody", "all", "none", "guaranteed"],
      points: 7,
      maxMatches: 6,
      severity: "medium"
    },
    {
      id: "grift_terms",
      component: "grift",
      type: "regex",
      pattern: "\\b(dm me|link in bio|free guide|my course|join my community|passive income|not financial advice)\\b",
      points: 18,
      maxMatches: 4,
      severity: "high"
    },
    {
      id: "ai_cliche",
      component: "aiSlop",
      type: "regex",
      pattern: "\\b(in today'?s fast-paced world|let'?s dive in|game-changer|unlock the power|delve|tapestry)\\b",
      points: 15,
      maxMatches: 4,
      severity: "medium"
    },
    {
      id: "dunk_farming",
      component: "contextCollapse",
      type: "regex",
      pattern: "\\b(imagine thinking|tell me you .* without telling me|aged like milk|this you\\?|ratio)\\b",
      points: 18,
      maxMatches: 3,
      severity: "high"
    },
    {
      id: "context_flatteners",
      component: "contextCollapse",
      type: "regex",
      pattern: "\\b(it'?s that simple|end of story|no debate|case closed)\\b",
      points: 14,
      maxMatches: 3,
      severity: "medium"
    }
  ]
};
