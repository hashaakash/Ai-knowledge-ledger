"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { knowledgeItems as seedKnowledgeItems } from "./mock-data/knowledge-items";
import { evidence as seedEvidence } from "./mock-data/evidence";
import { makeUniqueId } from "./id-utils";
import { reconcileImportIds } from "./import-utils";
import type { Evidence, KnowledgeItem } from "./types";

// ============================================================================
// Knowledge store
// ============================================================================
// The one piece of genuinely shared client state in the app. Holds both
// KnowledgeItems and Evidence together, since a memory can reference
// evidence and the two need to stay consistent (see importItems below).
//
// ID-uniqueness invariant: nothing in this file ever inserts an item or
// evidence record without first checking it against the ids already
// present. addItem/addEvidence guard the single-record path (belt-and-
// braces — Add Memory's own generated ids essentially never collide, but
// this makes "the store has no duplicate ids" a property of the store
// itself, not something every caller has to get right). importItems
// re-runs the same reconciliation used for the Import preview, against the
// live store at the moment of commit, which is what actually guarantees
// correctness even if the store changed between preview and confirm.
//
// Still no persistence — in-memory for the tab's lifetime, seeded from mock
// data, resets on refresh.
// ============================================================================

interface KnowledgeContextValue {
  items: KnowledgeItem[];
  /** Add a single item (used by "Add Memory"). Renames the id on the rare chance it collides with something already in the store. */
  addItem: (item: KnowledgeItem) => void;
  /** Patch an existing item; updatedAt is set automatically. Never touches id. */
  updateItem: (id: string, updates: Partial<Omit<KnowledgeItem, "id" | "ledgerId" | "createdAt">>) => void;
  /** Remove an item entirely (used by Delete). */
  deleteItem: (id: string) => void;
  /** Discard all changes and go back to the original mock data. */
  resetItems: () => void;

  evidence: Evidence[];
  /** Add one or more evidence records (used when "Add Memory" includes supporting evidence). */
  addEvidence: (entries: Evidence[]) => void;

  /**
   * The single entry point for Import: adds a batch of items and evidence
   * together, re-checking every id against the current live store (not
   * just whatever was true when the import preview was generated) and
   * keeping evidenceIds pointed at the right record if anything had to be
   * renamed. This is the only bulk-add path — Import doesn't go through
   * addItem/addEvidence one at a time.
   */
  importItems: (items: KnowledgeItem[], evidence: Evidence[]) => void;
}

const KnowledgeContext = createContext<KnowledgeContextValue | null>(null);

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  // items and evidence are kept as ONE state value internally (not two
  // separate useState calls) specifically so importItems() below can
  // compute reconcileImportIds() exactly once, against a single consistent
  // snapshot of both, and commit the result atomically. Two separate
  // useState calls would mean either reading a possibly-stale value of the
  // other piece of state, or computing the reconciliation twice against
  // snapshots that could disagree — both are real bugs, not just style.
  const [store, setStore] = useState<{ items: KnowledgeItem[]; evidence: Evidence[] }>({
    items: seedKnowledgeItems,
    evidence: seedEvidence,
  });

  const addItem = useCallback((item: KnowledgeItem) => {
    setStore((prev) => {
      const existingIds = new Set(prev.items.map((i) => i.id));
      const safeId = makeUniqueId(item.id, existingIds, "dup");
      const safeItem = safeId === item.id ? item : { ...item, id: safeId };
      return { ...prev, items: [safeItem, ...prev.items] };
    });
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<Omit<KnowledgeItem, "id" | "ledgerId" | "createdAt">>) => {
      setStore((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        ),
      }));
    },
    []
  );

  const deleteItem = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  }, []);

  const resetItems = useCallback(() => {
    setStore({ items: seedKnowledgeItems, evidence: seedEvidence });
  }, []);

  const addEvidence = useCallback((entries: Evidence[]) => {
    setStore((prev) => {
      const existingIds = new Set(prev.evidence.map((e) => e.id));
      const safeEntries = entries.map((entry) => {
        const safeId = makeUniqueId(entry.id, existingIds, "dup");
        existingIds.add(safeId);
        return safeId === entry.id ? entry : { ...entry, id: safeId };
      });
      return { ...prev, evidence: [...safeEntries, ...prev.evidence] };
    });
  }, []);

  const importItems = useCallback((newItems: KnowledgeItem[], newEvidence: Evidence[]) => {
    setStore((prev) => {
      // Re-reconcile against the live store right now, rather than trusting
      // ids already resolved at preview time — this is what makes "import
      // the same file twice" and "two imports in quick succession" both
      // land correctly instead of racing against a stale snapshot.
      const existingItemIds = new Set(prev.items.map((i) => i.id));
      const existingEvidenceIds = new Set(prev.evidence.map((e) => e.id));
      const { items: resolvedItems, evidence: resolvedEvidence } = reconcileImportIds(
        newItems,
        newEvidence,
        existingItemIds,
        existingEvidenceIds
      );
      return {
        items: [...resolvedItems, ...prev.items],
        evidence: [...resolvedEvidence, ...prev.evidence],
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      items: store.items,
      addItem,
      updateItem,
      deleteItem,
      resetItems,
      evidence: store.evidence,
      addEvidence,
      importItems,
    }),
    [store, addItem, updateItem, deleteItem, resetItems, addEvidence, importItems]
  );

  return <KnowledgeContext.Provider value={value}>{children}</KnowledgeContext.Provider>;
}

export function useKnowledgeStore(): KnowledgeContextValue {
  const ctx = useContext(KnowledgeContext);
  if (!ctx) {
    throw new Error("useKnowledgeStore must be used within a KnowledgeProvider");
  }
  return ctx;
}