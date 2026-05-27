import { describe, expect, it } from "vitest";
import { analyzeText, defaultConfig, scoreText } from "../src/index.js";

describe("scoreText", () => {
  it("scores generic AI phrasing higher than personal text", () => {
    const aiLike = scoreText("In today's fast-paced world, Jeff Beck stands as a testament to innovation and significant influence.");
    const personal = scoreText("I listened to Wired last night and the guitar tone on Led Boots still sounds wild to me.");

    expect(aiLike.score).toBeGreaterThan(personal.score);
    expect(aiLike.evidence.length).toBeGreaterThan(personal.evidence.length);
  });

  it("returns component evidence for LLM-like biography framing", () => {
    const result = scoreText("Nate Soares is an American artificial intelligence researcher and former executive director of a nonprofit focused on long-term risks posed by advanced AI systems.");

    expect(result.components.find((component) => component.id === "genericStructure")?.rawScore).toBeGreaterThan(0);
    expect(result.evidence.some((item) => "ruleId" in item && item.ruleId === "encyclopedic_bio_frame")).toBe(true);
  });

  it("scores templated social promo copy as slop", () => {
    const result = scoreText("Why pick one? Try all SIX poke flavors 🤤🌴 Big scoops + bold island taste!\n\nGT Poke Located inside Cheongdam Food Hall\n\n📍 8610 W Spring Mountain Rd, Las Vegas, NV 89117");

    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.components.find((component) => component.id === "socialFormat")?.rawScore).toBeGreaterThan(0);
  });

  it("keeps casual human social captions low", () => {
    const support = scoreText("The support my flip has been getting is insane, you guys are unreal 🫶🏻");
    const casual = scoreText("I guess we can stay for one more…👀");
    const meme = scoreText("the cackle at the end 🤣😭 #KevinHartRoast");

    expect(support.score).toBeLessThan(25);
    expect(casual.score).toBeLessThan(25);
    expect(meme.score).toBeGreaterThanOrEqual(25);
    expect(meme.score).toBeLessThanOrEqual(40);
  });

  it("scores polished musician biography copy higher", () => {
    const result = scoreText("John Mayer, born in 1977 in Bridgeport, Connecticut, is an American singer, songwriter, and guitarist. He first gained recognition in the early 2000s with his debut album Room for Squares. He continued his success with albums like Heavier Things and Continuum. Mayer is known for his guitar playing and has been recognized for his technique and tone.");

    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("scores polished viral event explainer copy high", () => {
    const result = scoreText("This is what precision looks like on a stadium scale. Dom Dolla’s viral Rhyme Dust interlude has become one of the most technically impressive moments in modern live dance music. Instead of relying on standard sound-reactive visuals, the synth sequence is locked to SMPTE timecode, allowing the lasers to hit with millisecond-perfect precision every single time the section is triggered live. The engineered moment was showcased in front of more than 40,000 fans during Dom Dolla’s historic sold-out headline show.");

    expect(result.score).toBeGreaterThanOrEqual(75);
  });

  it("keeps config version on the result", () => {
    const result = scoreText("normal post");

    expect(result.configVersion).toBe(defaultConfig.version);
  });

  it("allows tunable component weights", () => {
    const lowAiPhrasing = scoreText("Let's dive in and unlock the power of this game-changer.", {
      ...defaultConfig,
      components: {
        ...defaultConfig.components,
        aiPhrasing: { weight: 0.01, cap: 100 }
      }
    });
    const highAiPhrasing = scoreText("Let's dive in and unlock the power of this game-changer.", {
      ...defaultConfig,
      components: {
        ...defaultConfig.components,
        aiPhrasing: { weight: 1, cap: 100 }
      }
    });

    expect(highAiPhrasing.score).toBeGreaterThan(lowAiPhrasing.score);
  });

  it("flags rhetorical-question dramatic reveal cadence", () => {
    const result = scoreText("Em dash is no longer the most glaring indicator of genAI output. Honestly? It's this.");

    expect(result.evidence.some((item) => "ruleId" in item && item.ruleId === "dramatic_reveal_frame")).toBe(true);
    expect(result.evidence.some((item) => "ruleId" in item && item.ruleId === "contrarian_pivot_frame")).toBe(true);
    expect(result.evidence.some((item) => "ruleId" in item && item.ruleId === "human_first_person_texture")).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(25);
  });

  it("still credits casual 'honestly,' as human texture", () => {
    const result = scoreText("honestly i listened to the whole thing and it was kinda fun, you guys");

    expect(result.evidence.some((item) => "ruleId" in item && item.ruleId === "human_first_person_texture")).toBe(true);
    expect(result.score).toBeLessThan(25);
  });

  it("flags dense adjacency clusters of distinct slop rules", () => {
    const result = scoreText(
      "First, this stands as a testament to innovation. While many advocate restraint, the development of this game-changer carries significant impact. Ultimately, its lasting legacy is undeniable."
    );

    expect(result.evidence.some((item) => "id" in item && item.id === "adjacent_slop_cluster")).toBe(true);
  });

  it("flags polished surface signal on clean long-form prose", () => {
    const result = scoreText(
      "The organization has continued to expand its reach across multiple regions. Researchers presented their findings at a recent conference held in Geneva. The work focuses on the responsible development of Advanced AI Systems and the Long Term Risks they may pose. Stakeholders from industry and academia attended the proceedings and contributed to the ongoing discussion."
    );

    expect(result.evidence.some((item) => "id" in item && item.id === "polished_surface")).toBe(true);
  });

  it("does not flag polished surface on casual messy text", () => {
    const result = scoreText(
      "lol idk man... the show was unreal, you guys -- i can't believe how loud it got!! my ears are still ringing tbh."
    );

    expect(result.evidence.some((item) => "id" in item && item.id === "polished_surface")).toBe(false);
  });

  it("supports dry-run analysis without final score fields", () => {
    const analysis = analyzeText("Nate Soares is an American artificial intelligence researcher and former executive director.");

    expect(analysis.normalized.tokens).toContain("nate");
    expect(analysis.evidence.some((item) => "ruleId" in item && item.ruleId === "encyclopedic_bio_frame")).toBe(true);
    expect(analysis.config.enabledRules).toBeGreaterThan(0);
    expect("score" in analysis).toBe(false);
  });
});
