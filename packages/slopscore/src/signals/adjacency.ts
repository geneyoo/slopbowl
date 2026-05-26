import type { MetricEvidence, RuleEvidence, SlopScoreConfig } from "../types.js";

export function evaluateAdjacency(
  ruleEvidence: RuleEvidence[],
  config: SlopScoreConfig
): MetricEvidence[] {
  const window = config.metrics.adjacentSlopWindow;
  const threshold = config.metrics.adjacentSlopThreshold;
  const penalty = config.metrics.adjacentSlopPenalty;

  if (penalty === 0 || threshold < 2) {
    return [];
  }

  const indexed = ruleEvidence
    .filter((item) => typeof item.index === "number" && item.points > 0)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  if (indexed.length < threshold) {
    return [];
  }

  const evidence: MetricEvidence[] = [];
  let cluster: RuleEvidence[] = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    if (cluster.length === 0) return;
    const distinctRules = new Set(cluster.map((item) => item.ruleId)).size;
    if (distinctRules >= threshold) {
      const start = cluster[0].index ?? 0;
      const last = cluster[cluster.length - 1];
      const end = (last.index ?? 0) + (last.match?.length ?? 0);
      evidence.push({
        id: "adjacent_slop_cluster",
        component: "genericStructure",
        value: distinctRules,
        points: (distinctRules - (threshold - 1)) * penalty,
        description: `Dense cluster of ${distinctRules} distinct slop signals within ${end - start} chars.`
      });
    }
    cluster = [];
  };

  for (const item of indexed) {
    const idx = item.index ?? 0;
    const itemEnd = idx + (item.match?.length ?? 1);
    if (cluster.length === 0) {
      cluster.push(item);
      clusterEnd = itemEnd;
      continue;
    }
    if (idx <= clusterEnd + window) {
      cluster.push(item);
      clusterEnd = Math.max(clusterEnd, itemEnd);
    } else {
      flush();
      cluster.push(item);
      clusterEnd = itemEnd;
    }
  }
  flush();

  return evidence;
}
