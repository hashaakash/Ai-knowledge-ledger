import { ledgers } from "./mock-data/ledgers";
import { evidence } from "./mock-data/evidence";
import type { Evidence, KnowledgeItem, Ledger } from "./types";

// ============================================================================
// Ledger detail page lookups
// ============================================================================
// These are separate from dashboard-utils.ts on purpose: dashboard-utils.ts
// holds aggregate/summary logic used by the Dashboard, while this file holds
// single-record lookups used by the /ledger/[id] page. Same reasoning as
// before — once there's a Go backend, these become one API call each
// (GET /ledgers/:id, GET /evidence?ids=...) and nothing calling them changes.
// ============================================================================

export function getLedgerById(id: string): Ledger | undefined {
  return ledgers.find((ledger) => ledger.id === id);
}

/** Resolves a KnowledgeItem's evidenceIds into the actual Evidence records. */
export function getEvidenceForItem(item: KnowledgeItem): Evidence[] {
  const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
  return item.evidenceIds
    .map((id) => evidenceById.get(id))
    .filter((entry): entry is Evidence => entry !== undefined);
}