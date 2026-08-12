import type { ConfidenceLevel, KnowledgeItem, KnowledgeItemType, Ledger } from "./types";

// ============================================================================
// Dashboard derived data
// ============================================================================
// Nothing here is stored data — everything is *computed*. These functions
// used to read the mock data modules directly. Now that items can change at
// runtime (Add Memory, Import), they take `items`/`ledgers` as arguments
// instead — usually straight from useKnowledgeStore() — so the same
// aggregation logic works whether the data came from the static mock file
// or from something the user just imported. Once the Go backend exists,
// callers pass in whatever the API returned; the functions themselves don't
// change.
// ============================================================================

const CONFIDENCE_SCORE: Record<ConfidenceLevel, number> = {
  low: 33,
  medium: 66,
  high: 100,
};

/** All knowledge items belonging to a given ledger. */
export function getItemsForLedger(items: KnowledgeItem[], ledgerId: string): KnowledgeItem[] {
  return items.filter((item) => item.ledgerId === ledgerId);
}

/** Pure scoring function so any list of items — a full ledger, a filtered subset — can be scored the same way. */
export function computeConfidence(items: KnowledgeItem[]): number {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + CONFIDENCE_SCORE[item.confidence], 0);
  return Math.round(total / items.length);
}

/**
 * A single 0–100 "confidence" score for a ledger, derived by averaging the
 * confidence level of every knowledge item inside it. This powers the subtle
 * progress indicator on each LedgerCard.
 */
export function getLedgerConfidence(items: KnowledgeItem[], ledgerId: string): number {
  return computeConfidence(getItemsForLedger(items, ledgerId));
}

/**
 * The most recent updatedAt among a ledger's items, formatted for display
 * elsewhere via formatRelativeDate(). Falls back to the ledger's own
 * lastUpdated field if it currently has no items.
 */
export function getLedgerLastUpdated(items: KnowledgeItem[], ledger: Ledger): string {
  const ledgerItems = getItemsForLedger(items, ledger.id);
  if (ledgerItems.length === 0) return ledger.lastUpdated;
  return ledgerItems.reduce(
    (latest, item) => (new Date(item.updatedAt) > new Date(latest) ? item.updatedAt : latest),
    ledgerItems[0].updatedAt
  );
}

export interface DashboardStats {
  totalMemories: number;
  totalCategories: number;
  totalSkills: number;
  totalGoals: number;
}

/** The four top-level numbers shown in the Dashboard's summary row. */
export function getDashboardStats(items: KnowledgeItem[], ledgers: Ledger[]): DashboardStats {
  return {
    totalMemories: items.length,
    totalCategories: ledgers.length,
    totalSkills: items.filter((item) => item.type === "skill").length,
    totalGoals: items.filter((item) => item.type === "goal").length,
  };
}

export interface ActivityEntry {
  id: string;
  title: string;
  type: KnowledgeItem["type"];
  confidence: ConfidenceLevel;
  ledgerId: string;
  ledgerName: string;
  ledgerColor: string;
  updatedAt: string;
}

/**
 * The most recently updated knowledge items across all ledgers, enriched
 * with the ledger's name/color so the Recent Activity list doesn't have to
 * do its own lookups.
 */
export function getRecentActivity(items: KnowledgeItem[], ledgers: Ledger[], limit = 6): ActivityEntry[] {
  const ledgerById = new Map(ledgers.map((ledger) => [ledger.id, ledger]));

  return [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
    .map((item) => {
      const ledger = ledgerById.get(item.ledgerId);
      return {
        id: item.id,
        title: item.title,
        type: item.type,
        confidence: item.confidence,
        ledgerId: item.ledgerId,
        ledgerName: ledger?.name ?? item.ledgerId,
        ledgerColor: ledger?.color ?? "slate",
        updatedAt: item.updatedAt,
      };
    });
}

/** Human-friendly relative time, e.g. "2 days ago", "Today", "Aug 3". */
export function formatRelativeDate(dateString: string): string {
  const diffDays = daysSince(dateString);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Whole days between now and a given ISO date string. Pulled out of formatRelativeDate() so the Needs Attention "stale goal" rule can reuse the same math instead of recalculating it. */
export function daysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

/** Human-friendly label for a knowledge item type, e.g. "skill" -> "Skill". */
export function formatItemType(type: KnowledgeItem["type"]): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/** Consistent badge coloring for a confidence level, used anywhere a single item's confidence is shown (as opposed to a ledger-wide score). */
export function getConfidenceBadgeClasses(confidence: ConfidenceLevel): string {
  switch (confidence) {
    case "high":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "medium":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "low":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
}

/** Solid bar-fill color for a confidence level — same color family as getConfidenceBadgeClasses(), used by the Confidence Distribution bars instead of the soft badge background. */
export function getConfidenceBarColor(confidence: ConfidenceLevel): string {
  switch (confidence) {
    case "high":
      return "bg-emerald-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-slate-400";
  }
}

// ============================================================================
// Knowledge Overview (Dashboard enhancement)
// ============================================================================
// Everything below is deterministic, rule-based aggregation over the live
// item list — no AI involved. It all takes `items` as a plain argument, same
// pattern as the rest of this file, so it works identically whether the
// items came from mock data or from something imported at runtime.
// ============================================================================

const ALL_ITEM_TYPES: KnowledgeItemType[] = [
  "topic",
  "skill",
  "strength",
  "weakness",
  "mistake",
  "preference",
  "goal",
  "project",
];

/**
 * Mistakes that share at least one tag with another mistake — a simple,
 * deterministic proxy for "this keeps happening" without any AI involved.
 * Exported (not just used internally) so both getKnowledgeOverviewStats()
 * and getNeedsAttentionItems() can share the exact same definition of
 * "recurring" instead of each having their own version of this logic.
 */
export function getRecurringMistakes(items: KnowledgeItem[]): KnowledgeItem[] {
  const mistakes = items.filter((item) => item.type === "mistake");

  const tagCounts = new Map<string, number>();
  for (const item of mistakes) {
    for (const tag of item.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  const recurringTags = new Set(
    [...tagCounts.entries()].filter(([, count]) => count >= 2).map(([tag]) => tag)
  );

  return mistakes.filter((item) => item.tags.some((tag) => recurringTags.has(tag)));
}

export interface KnowledgeOverviewStats {
  totalMemories: number;
  /** 0–100, same scoring as computeConfidence(). */
  averageConfidence: number;
  strengths: number;
  weaknesses: number;
  recurringMistakes: number;
  activeGoals: number;
  projects: number;
}

/** The deeper stat set for the Knowledge Overview section — separate from getDashboardStats(), which still powers the original four-card summary row untouched. */
export function getKnowledgeOverviewStats(items: KnowledgeItem[]): KnowledgeOverviewStats {
  return {
    totalMemories: items.length,
    averageConfidence: computeConfidence(items),
    strengths: items.filter((item) => item.type === "strength").length,
    weaknesses: items.filter((item) => item.type === "weakness").length,
    recurringMistakes: getRecurringMistakes(items).length,
    // There's no "completed"/"active" status field on KnowledgeItem, so
    // every goal currently counts as active. If a status field gets added
    // later, this is the one place that needs to change.
    activeGoals: items.filter((item) => item.type === "goal").length,
    projects: items.filter((item) => item.type === "project").length,
  };
}

export interface TypeDistributionEntry {
  type: KnowledgeItemType;
  count: number;
  /** 0–100, share of total items. */
  percentage: number;
}

/** Item count and share for every KnowledgeItemType, in a fixed display order (not sorted by count) so the section doesn't visually reshuffle as data changes. */
export function getTypeDistribution(items: KnowledgeItem[]): TypeDistributionEntry[] {
  const total = items.length;
  return ALL_ITEM_TYPES.map((type) => {
    const count = items.filter((item) => item.type === type).length;
    return { type, count, percentage: total === 0 ? 0 : Math.round((count / total) * 100) };
  });
}

export interface ConfidenceDistributionEntry {
  level: ConfidenceLevel;
  count: number;
  percentage: number;
}

/** Item count and share for each confidence level, low → high. */
export function getConfidenceDistribution(items: KnowledgeItem[]): ConfidenceDistributionEntry[] {
  const total = items.length;
  const levels: ConfidenceLevel[] = ["low", "medium", "high"];
  return levels.map((level) => {
    const count = items.filter((item) => item.confidence === level).length;
    return { level, count, percentage: total === 0 ? 0 : Math.round((count / total) * 100) };
  });
}

export interface NeedsAttentionEntry {
  item: KnowledgeItem;
  reason: string;
}

/** A goal with no update in this many days is flagged as stale. Kept as one named constant so the threshold is easy to find and tune later. */
export const STALE_GOAL_DAYS = 30;

/**
 * Simple, deterministic, rule-based candidates for the "Needs Attention"
 * section — explicitly not AI. Each item is flagged by at most one reason
 * (first rule that matches wins) and deduped by id, since an item could
 * technically match more than one rule.
 *
 * Rules:
 *   - low-confidence weakness
 *   - low-confidence mistake
 *   - recurring mistake (shares a tag with another mistake — see getRecurringMistakes)
 *   - goal not updated in over STALE_GOAL_DAYS days
 */
export function getNeedsAttentionItems(items: KnowledgeItem[]): NeedsAttentionEntry[] {
  const entries = new Map<string, NeedsAttentionEntry>();
  const flag = (item: KnowledgeItem, reason: string) => {
    if (!entries.has(item.id)) entries.set(item.id, { item, reason });
  };

  for (const item of items) {
    if (item.type === "weakness" && item.confidence === "low") {
      flag(item, "Low-confidence weakness — worth revisiting");
    } else if (item.type === "mistake" && item.confidence === "low") {
      flag(item, "Low-confidence mistake — worth revisiting");
    } else if (item.type === "goal" && daysSince(item.updatedAt) > STALE_GOAL_DAYS) {
      flag(item, `No update in ${daysSince(item.updatedAt)} days`);
    }
  }

  for (const item of getRecurringMistakes(items)) {
    flag(item, "Recurring pattern — shows up in multiple mistakes");
  }

  return [...entries.values()].sort(
    (a, b) => new Date(b.item.updatedAt).getTime() - new Date(a.item.updatedAt).getTime()
  );
}