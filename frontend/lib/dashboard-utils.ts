import type { ConfidenceLevel, KnowledgeItem, Ledger } from "./types";

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
        ledgerId: item.ledgerId,
        ledgerName: ledger?.name ?? item.ledgerId,
        ledgerColor: ledger?.color ?? "slate",
        updatedAt: item.updatedAt,
      };
    });
}

/** Human-friendly relative time, e.g. "2 days ago", "Today", "Aug 3". */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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