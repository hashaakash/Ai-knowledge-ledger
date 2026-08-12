import { ledgers } from "./mock-data/ledgers";
import type { Evidence, KnowledgeItem, Ledger } from "./types";

// ============================================================================
// Ledger detail page lookups
// ============================================================================
// Separate from dashboard-utils.ts: that file holds aggregate/summary logic
// for the Dashboard, this file holds single-record lookups for /ledger/[id].
// getEvidenceForItem() takes a live evidence array (from useKnowledgeStore())
// rather than reading the mock module directly, since evidence can now grow
// at runtime — a new memory can be created with a piece of evidence attached.
// ============================================================================

export function getLedgerById(id: string): Ledger | undefined {
  return ledgers.find((ledger) => ledger.id === id);
}

/** Resolves a KnowledgeItem's evidenceIds into the actual Evidence records. */
export function getEvidenceForItem(evidenceList: Evidence[], item: KnowledgeItem): Evidence[] {
  const evidenceById = new Map(evidenceList.map((entry) => [entry.id, entry]));
  return item.evidenceIds
    .map((id) => evidenceById.get(id))
    .filter((entry): entry is Evidence => entry !== undefined);
}