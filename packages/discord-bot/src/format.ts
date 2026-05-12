import type { SlopEvidence, SlopResult } from "@slopbowl/slopscore";

const maxDiscordMessageLength = 2000;

export function formatScore(result: SlopResult): string {
  const label = labelFor(result.label);
  const reasons = topReasons(result.evidence);
  const body = [
    `SlopScore: ${result.score}/100`,
    label,
    "",
    "Why:",
    ...reasons.map((reason) => `- ${reason}`),
    "",
    `Confidence: ${Math.round(result.confidence * 100)}%`
  ].join("\n");

  return truncate(body, maxDiscordMessageLength);
}

function topReasons(evidence: SlopEvidence[]): string[] {
  const reasons = evidence
    .filter((item) => item.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 4)
    .map(reasonFor);

  return reasons.length > 0 ? reasons : ["low visible deterministic slop signal"];
}

function reasonFor(evidence: SlopEvidence): string {
  if ("ruleId" in evidence) {
    return evidence.ruleId.replaceAll("_", " ");
  }

  return evidence.description;
}

function labelFor(label: string): string {
  switch (label) {
    case "likely_human":
      return "Likely human";
    case "possibly_llm":
      return "Possibly slop";
    case "probably_llm":
      return "Probably slop";
    case "very_likely_llm":
      return "Very likely slop";
    default:
      return label;
  }
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}
