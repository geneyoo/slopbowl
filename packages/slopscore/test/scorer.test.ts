import { describe, expect, it } from "vitest";
import { analyzeText, defaultConfig, scoreText } from "../src/index.js";

describe("scoreText", () => {
  it("scores obvious bait higher than plain factual text", () => {
    const bait = scoreText("Nobody is talking about this. They don't want you to know. This changes everything!");
    const plain = scoreText("The city council meeting starts at 7pm and the agenda is posted online.");

    expect(bait.score).toBeGreaterThan(plain.score);
    expect(bait.evidence.length).toBeGreaterThan(plain.evidence.length);
  });

  it("returns component evidence for matched rules", () => {
    const result = scoreText("DM me for my course on passive income. Not financial advice.");

    expect(result.components.find((component) => component.id === "grift")?.rawScore).toBeGreaterThan(0);
    expect(result.evidence.some((item) => "ruleId" in item && item.ruleId === "grift_terms")).toBe(true);
  });

  it("keeps config version on the result", () => {
    const result = scoreText("normal post");

    expect(result.configVersion).toBe(defaultConfig.version);
  });

  it("allows tunable component weights", () => {
    const lowRage = scoreText("This is insane and unhinged.", {
      ...defaultConfig,
      components: {
        ...defaultConfig.components,
        rage: { weight: 0.01, cap: 100 }
      }
    });
    const highRage = scoreText("This is insane and unhinged.", {
      ...defaultConfig,
      components: {
        ...defaultConfig.components,
        rage: { weight: 1, cap: 100 }
      }
    });

    expect(highRage.score).toBeGreaterThan(lowRage.score);
  });

  it("supports dry-run analysis without final score fields", () => {
    const analysis = analyzeText("Nobody is talking about this.");

    expect(analysis.normalized.tokens).toContain("nobody");
    expect(analysis.evidence.some((item) => "ruleId" in item && item.ruleId === "nobody_is_talking_about")).toBe(true);
    expect(analysis.config.enabledRules).toBeGreaterThan(0);
    expect("score" in analysis).toBe(false);
  });
});
