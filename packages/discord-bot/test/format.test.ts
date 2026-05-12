import { describe, expect, it } from "vitest";
import { scoreText } from "@slopbowl/slopscore";
import { formatScore } from "../src/format.js";

describe("formatScore", () => {
  it("formats high slop scores for Discord", () => {
    const result = scoreText(
      "John Mayer, born in 1977, is an American singer, songwriter, and guitarist. He first gained recognition in the early 2000s and became known for his guitar playing."
    );

    const formatted = formatScore(result);

    expect(formatted).toContain("SlopScore:");
    expect(formatted).toContain("Why:");
    expect(formatted).toContain("encyclopedic bio frame");
    expect(formatted.length).toBeLessThanOrEqual(2000);
  });

  it("formats low-signal text", () => {
    const result = scoreText("I guess we can stay for one more…👀");

    expect(formatScore(result)).toContain("Likely human");
  });
});
