import { ledgers } from "./mock-data/ledgers";
import { knowledgeItems } from "./mock-data/knowledge-items";
import type { ConfidenceLevel, KnowledgeItem } from "./types";

// ============================================================================
// Dashboard derived data
// ============================================================================
// Nothing here is stored data — everything is *computed* from the existing
// mock data (ledgers + knowledgeItems). This is deliberate: once the Go
// backend exists, these functions get replaced by API calls that do the same
// aggregation server-side. The components that use them don't need to change.
// ============================================================================

const CONFIDENCE_SCORE: Record<ConfidenceLevel, number> = {
  low: 33,
  medium: 66,
  high: 100,
};

/** All knowledge items belonging to a given ledger. */
export function getItemsForLedger(ledgerId: string): KnowledgeItem[] {
  return knowledgeItems.filter((item) => item.ledgerId === ledgerId);
}

/**
 * Pure scoring function, extracted out of getLedgerConfidence() so pages
 * that hold their own local copy of a ledger's items (e.g. the ledger detail
 * page, after a user adds a memory via the dialog) can recompute the same
 * score without re-reading the global mock data or duplicating the formula.
 */
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
export function getLedgerConfidence(ledgerId: string): number {
  return computeConfidence(getItemsForLedger(ledgerId));
}

export interface DashboardStats {
  totalMemories: number;
  totalCategories: number;
  totalSkills: number;
  totalGoals: number;
}

/** The four top-level numbers shown in the Dashboard's summary row. */
export function getDashboardStats(): DashboardStats {
  return {
    totalMemories: knowledgeItems.length,
    totalCategories: ledgers.length,
    totalSkills: knowledgeItems.filter((item) => item.type === "skill").length,
    totalGoals: knowledgeItems.filter((item) => item.type === "goal").length,
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
export function getRecentActivity(limit = 6): ActivityEntry[] {
  const ledgerById = new Map(ledgers.map((ledger) => [ledger.id, ledger]));

  return [...knowledgeItems]
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