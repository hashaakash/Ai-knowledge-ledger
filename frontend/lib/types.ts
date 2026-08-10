// ============================================================================
// AI Knowledge Ledger — Core Data Model
// ============================================================================
// These types describe the three core entities in the app and how they
// relate to each other. Nothing here talks to a database or an API yet —
// this file just defines the *shape* of the data so mock data (and later,
// real API responses) can be strongly typed.
//
// Relationship overview:
//
//   Ledger (1) ──── has many ────> KnowledgeItem (many)
//   KnowledgeItem (1) ──── references many ────> Evidence (many)
//
// A Ledger is a category (e.g. "DSA", "Linux").
// A KnowledgeItem is one fact/insight inside that category
// (e.g. "Strong at Two Pointers", "Frequently forgets edge cases").
// Evidence is the proof behind a KnowledgeItem — a snippet from a real
// conversation that justifies why the system believes that insight.
// ============================================================================

/**
 * The kind of insight a KnowledgeItem represents.
 * Every knowledge item is exactly one of these types — this is what lets
 * the UI filter/group items ("show me only weaknesses", "show me only goals").
 */
export type KnowledgeItemType =
  | "topic" // A subject the user has learned about (e.g. "Binary Search")
  | "skill" // A demonstrated ability (e.g. "Can implement BFS from scratch")
  | "strength" // Something the user consistently does well
  | "weakness" // An area the user consistently struggles with
  | "mistake" // A specific recurring error pattern
  | "preference" // How the user likes to learn or work
  | "goal" // Something the user is actively working toward
  | "project"; // A concrete project the user is building

/**
 * How confident the system is that a KnowledgeItem is accurate.
 * This matters because knowledge is *inferred* from conversations —
 * some conclusions are backed by lots of evidence, others by very little.
 */
export type ConfidenceLevel = "low" | "medium" | "high";

/**
 * A single piece of proof behind a KnowledgeItem.
 *
 * Evidence is intentionally kept as its own top-level entity instead of
 * being nested directly inside KnowledgeItem. Two reasons:
 *   1. In a real system, evidence comes from actual conversation history,
 *      which is fetched/stored independently of the conclusions drawn from it.
 *   2. The same piece of evidence could theoretically support more than
 *      one knowledge item in the future.
 */
export interface Evidence {
  id: string;
  /** The actual excerpt from the conversation that supports the conclusion. */
  snippet: string;
  /** Human-readable source, e.g. "ChatGPT conversation, Aug 3" */
  sourceLabel: string;
  /** ISO date string for when this conversation happened. */
  date: string;
}

/**
 * A single knowledge "fact" inside a Ledger.
 * This is the atomic unit of the entire product — everything the UI shows
 * is ultimately a list of these, grouped, filtered, or sorted.
 */
export interface KnowledgeItem {
  id: string;
  /** Which Ledger (category) this item belongs to. */
  ledgerId: string;
  type: KnowledgeItemType;
  title: string;
  description: string;
  confidence: ConfidenceLevel;
  /** Short freeform labels for extra filtering/search, e.g. ["arrays", "O(n)"] */
  tags: string[];
  /** IDs referencing entries in the Evidence collection. */
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * A top-level knowledge category, e.g. "DSA" or "Linux".
 * This is what the user sees as a card on the Dashboard, and what they
 * can eventually export as a standalone "portable knowledge package".
 */
export interface Ledger {
  id: string;
  name: string;
  /** Name of a lucide-react icon component, e.g. "Binary", "Terminal". */
  icon: string;
  /** Tailwind-friendly color keyword used for accents, e.g. "violet", "emerald". */
  color: string;
  description: string;
  /**
   * Denormalized count of knowledge items in this ledger.
   * Stored directly on the Ledger (instead of computed on the fly) so the
   * Dashboard can render summary cards without needing to load every item
   * up front. Mock data must keep this in sync by hand for now.
   */
  itemCount: number;
  lastUpdated: string;
}