export type ReadinessScoreTier = "ready" | "conditional" | "at_risk" | "not_ready";

export type ReadinessScoreTierConfig = {
  tier: ReadinessScoreTier;
  heading: string;
  badgeLabel: string;
  summary: string;
  progressColor: string;
  trackColor: string;
  badgeClassName: string;
  showCommunityButton: boolean;
  primaryLabel: string;
  primaryAction: "proceed" | "support";
};

const DEFAULT_SUMMARY =
  "Get ready to collaborate, learn, and grow alongside your peers. Your Pod Leader will be reaching out shortly with the next steps to get you started—stay tuned!";

const NOT_READY_SUMMARY =
  "Based on your responses, we recommend a short delay so we can put the right support in place. This isn't a rejection — it's us making sure you succeed.";

/** Score bands: 40–50 ready, 30–40 conditional, 20–30 at risk, below 20 not ready. */
export function getReadinessScoreTier(score: number): ReadinessScoreTier {
  if (score >= 40) return "ready";
  if (score >= 30) return "conditional";
  if (score >= 20) return "at_risk";
  return "not_ready";
}

export function getReadinessScoreProgressPercent(score: number): number {
  const maxScore = score > 50 ? 100 : 50;
  return Math.min(100, Math.max(0, (score / maxScore) * 100));
}

export function getReadinessScoreTierConfig(
  score: number,
): ReadinessScoreTierConfig {
  const tier = getReadinessScoreTier(score);

  switch (tier) {
    case "ready":
      return {
        tier,
        heading: "You are good to go!",
        badgeLabel: "Ready",
        summary: DEFAULT_SUMMARY,
        progressColor: "#3A8E53",
        trackColor: "#D8F6DC",
        badgeClassName: "bg-[#D8F6DC] text-[#3A8E53]",
        showCommunityButton: false,
        primaryLabel: "Proceed",
        primaryAction: "proceed",
      };
    case "conditional":
      return {
        tier,
        heading: "Let's get started!",
        badgeLabel: "Conditional",
        summary: DEFAULT_SUMMARY,
        progressColor: "#B8860B",
        trackColor: "#FFF1C6",
        badgeClassName: "bg-[#FFF1C6] text-[#564103]",
        showCommunityButton: true,
        primaryLabel: "Proceed",
        primaryAction: "proceed",
      };
    case "at_risk":
      return {
        tier,
        heading: "Let's get you prepared",
        badgeLabel: "At Risk",
        summary: DEFAULT_SUMMARY,
        progressColor: "#AA3030",
        trackColor: "#FDECEC",
        badgeClassName: "bg-[#FDECEC] text-[#AA3030]",
        showCommunityButton: true,
        primaryLabel: "Proceed",
        primaryAction: "proceed",
      };
    case "not_ready":
      return {
        tier,
        heading: "Let's get you prepared",
        badgeLabel: "Not yet ready",
        summary: NOT_READY_SUMMARY,
        progressColor: "#AA3030",
        trackColor: "#FDECEC",
        badgeClassName: "bg-[#AA3030] text-white",
        showCommunityButton: true,
        primaryLabel: "Reach out to support",
        primaryAction: "support",
      };
  }
}
