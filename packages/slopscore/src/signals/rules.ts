import type { NormalizedText, RuleConfig, RuleEvidence } from "../types.js";

export function evaluateRules(normalized: NormalizedText, rules: RuleConfig[]): RuleEvidence[] {
  const evidence: RuleEvidence[] = [];

  for (const rule of rules) {
    if (rule.enabled === false) {
      continue;
    }

    if (rule.type === "regex" && rule.pattern) {
      evidence.push(...evaluateRegexRule(normalized, rule));
    }

    if (rule.type === "token" && rule.tokens?.length) {
      evidence.push(...evaluateTokenRule(normalized, rule));
    }
  }

  return evidence;
}

function evaluateRegexRule(normalized: NormalizedText, rule: RuleConfig): RuleEvidence[] {
  const regex = new RegExp(rule.pattern ?? "", "giu");
  const matches = [...normalized.original.matchAll(regex)];
  return matches.slice(0, rule.maxMatches ?? matches.length).map((match) => ({
    ruleId: rule.id,
    component: rule.component,
    match: match[0],
    index: match.index,
    points: rule.points,
    severity: rule.severity
  }));
}

function evaluateTokenRule(normalized: NormalizedText, rule: RuleConfig): RuleEvidence[] {
  const wanted = new Set(rule.tokens?.map((token) => token.toLowerCase()) ?? []);
  const matches = normalized.tokens
    .filter((token) => wanted.has(token))
    .slice(0, rule.maxMatches ?? normalized.tokens.length);

  return matches.map((match) => ({
    ruleId: rule.id,
    component: rule.component,
    match,
    points: rule.points,
    severity: rule.severity
  }));
}

