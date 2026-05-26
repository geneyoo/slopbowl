import type { SlopScoreConfig } from "../types.js";

export const defaultConfig: SlopScoreConfig = {
  version: "0.1.0",
  scoreRange: { min: 0, max: 100 },
  labels: [
    { id: "likely_human", min: 0, max: 24 },
    { id: "possibly_llm", min: 25, max: 49 },
    { id: "probably_llm", min: 50, max: 74 },
    { id: "very_likely_llm", min: 75, max: 100 }
  ],
  components: {
    aiPhrasing: { weight: 0.2, cap: 100 },
    genericStructure: { weight: 0.2, cap: 100 },
    lowSpecificity: { weight: 0.16, cap: 100 },
    polishedTone: { weight: 0.14, cap: 100 },
    socialFormat: { weight: 0.22, cap: 100 },
    humanTexture: { weight: 0.08, cap: 100 }
  },
  metrics: {
    polishedLongformPenalty: 18,
    sentenceUniformityPenalty: 14,
    lowSpecificityPenalty: 12,
    emojiMarketingPenalty: 7,
    promoFormatPenalty: 18,
    personalTextureDiscount: -16,
    shortTextConfidencePenalty: 0.18,
    adjacentSlopWindow: 140,
    adjacentSlopThreshold: 3,
    adjacentSlopPenalty: 9,
    polishedSurfacePenalty: 6
  },
  calibration: {
    scoreMultiplier: 3.2
  },
  rules: [
    {
      id: "llm_transition_stack",
      component: "genericStructure",
      type: "regex",
      pattern: "\\b(first|after|unlike|later|overall|in conclusion|ultimately)\\b",
      points: 6,
      maxMatches: 5,
      severity: "medium"
    },
    {
      id: "encyclopedic_bio_frame",
      component: "genericStructure",
      type: "regex",
      pattern: "\\b(born in \\d{4}|is an? american|was an? .+ known for|former executive director|nonprofit focused|first gained attention|first gained recognition|became widely known|became known for|major influences?|is known for)\\b",
      points: 14,
      maxMatches: 7,
      severity: "high"
    },
    {
      id: "ai_safety_explainer_frame",
      component: "genericStructure",
      type: "regex",
      pattern: "\\b(has argued|he frequently compares|what makes .+ notable|while many .+ advocate|current trajectory|technical challenges)\\b",
      points: 15,
      maxMatches: 6,
      severity: "high"
    },
    {
      id: "viral_event_explainer_frame",
      component: "genericStructure",
      type: "regex",
      pattern: "\\b(this is what .+ looks like|viral .+ has become|one of the most .+ moments|instead of relying|allowing the|every single time|engineered moment|showcased in front of|historic sold-out|became the first|gives .+ the freedom)\\b",
      points: 12,
      maxMatches: 10,
      severity: "high"
    },
    {
      id: "generic_impact_language",
      component: "lowSpecificity",
      type: "regex",
      pattern: "\\b(helping shape|development of|innovative|constant experimentation|major influence|significant impact|lasting legacy|long-term risks|advanced ai systems|dangerously unprepared|superintelligent machines|good intentions alone|far harder than most people realize|continued his success|marked a shift|included tracks|in addition to|has been recognized|associated with|technically impressive|modern live|millisecond-perfect precision|massive laser production|perfectly synchronized)\\b",
      points: 12,
      maxMatches: 10,
      severity: "medium"
    },
    {
      id: "ai_cliche",
      component: "aiPhrasing",
      type: "regex",
      pattern: "\\b(in today'?s fast-paced world|let'?s dive in|game-changer|unlock the power|delve|tapestry|realm of|stands as a testament)\\b",
      points: 18,
      maxMatches: 5,
      severity: "high"
    },
    {
      id: "balanced_explainer_frame",
      component: "polishedTone",
      type: "regex",
      pattern: "\\b(while .+, .+|although .+, .+|rather than|not only .+ but also|unlike many)\\b",
      points: 12,
      maxMatches: 4,
      severity: "medium"
    },
    {
      id: "promo_caption_frame",
      component: "socialFormat",
      type: "regex",
      pattern: "\\b(why pick one|try all|big scoops|bold .+ taste|located inside|food hall)\\b",
      points: 16,
      maxMatches: 5,
      severity: "high"
    },
    {
      id: "address_caption_frame",
      component: "socialFormat",
      type: "regex",
      pattern: "\\b(\\d{3,5}\\s+[a-z0-9 ]+\\s+(rd|road|st|street|ave|avenue|blvd|dr|drive|ln|lane)|las vegas|located inside)\\b",
      points: 14,
      maxMatches: 3,
      severity: "medium"
    },
    {
      id: "tabloid_headline_frame",
      component: "socialFormat",
      type: "regex",
      pattern: "\\b(called ['\"].+['\"]|deluded|heated row|got involved|fellow cyclist|as he got involved)\\b",
      points: 18,
      maxMatches: 4,
      severity: "medium"
    },
    {
      id: "meme_reaction_caption",
      component: "socialFormat",
      type: "regex",
      pattern: "\\b(the .+ at the end|cackle at the end|wait for the end|ending got me)\\b",
      points: 38,
      maxMatches: 1,
      severity: "medium"
    },
    {
      id: "hashtag_reaction_frame",
      component: "socialFormat",
      type: "regex",
      pattern: "#[a-z0-9_]*(roast|funny|meme|viral|fail|comedy)[a-z0-9_]*",
      points: 12,
      maxMatches: 2,
      severity: "low"
    },
    {
      id: "generic_descriptor_terms",
      component: "lowSpecificity",
      type: "token",
      tokens: ["innovative", "experimental", "influential", "iconic", "notable", "significant", "unique"],
      points: 8,
      maxMatches: 6,
      severity: "medium"
    },
    {
      id: "casual_community_texture",
      component: "humanTexture",
      type: "regex",
      pattern: "\\b(my flip|you guys|you all|y'all|unreal|we can stay|one more)\\b",
      points: -14,
      maxMatches: 4,
      severity: "medium"
    },
    {
      id: "human_first_person_texture",
      component: "humanTexture",
      type: "regex",
      pattern: "\\b(i think|i remember|my take|imo|honestly|personally|i saw|i listened|my favorite|i guess)\\b",
      points: -14,
      maxMatches: 4,
      severity: "medium"
    },
    {
      id: "human_messy_texture",
      component: "humanTexture",
      type: "regex",
      pattern: "\\b(lol|lmao|idk|ngl|tbh|wtf|kinda|sorta)\\b",
      points: -10,
      maxMatches: 4,
      severity: "medium"
    },
    {
      id: "citation_like_specificity",
      component: "humanTexture",
      type: "regex",
      pattern: "\\b(according to|source:|via |from the interview|page \\d+|\\d{1,2}:\\d{2})\\b",
      points: -12,
      maxMatches: 3,
      severity: "medium"
    }
  ]
};
