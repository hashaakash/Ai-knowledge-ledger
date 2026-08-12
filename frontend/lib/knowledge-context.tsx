"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { knowledgeItems as seedKnowledgeItems } from "./mock-data/knowledge-items";
import { evidence as seedEvidence } from "./mock-data/evidence";
import type { Evidence, KnowledgeItem } from "./types";

// ============================================================================
// Knowledge store
// ============================================================================
// The one piece of genuinely shared client state in the app. Holds both
// KnowledgeItems and Evidence together (rather than two separate contexts)
// because they're not independent: a new memory can now be created with a
// piece of supporting evidence attached in the same action, and that only
// works cleanly if both live behind one provider.
//
// Still no persistence — in-memory for the tab's lifetime, seeded from mock
// data, resets on refresh. That's intentional at this stage.
// ============================================================================

interface KnowledgeContextValue {
  items: KnowledgeItem[];
  /** Add a single item (used by "Add Memory"). */
  addItem: (item: KnowledgeItem) => void;
  /** Add many items at once (used by Import). */
  addItems: (items: KnowledgeItem[]) => void;
  /** Patch an existing item; updatedAt is set automatically so callers never have to remember to. */
  updateItem: (id: string, updates: Partial<Omit<KnowledgeItem, "id" | "ledgerId" | "createdAt">>) => void;
  /** Remove an item entirely (used by Delete). */
  deleteItem: (id: string) => void;
  /** Discard all changes and go back to the original mock data. */
  resetItems: () => void;

  evidence: Evidence[];
  /** Add one or more evidence records (used when "Add Memory" includes supporting evidence). */
  addEvidence: (entries: Evidence[]) => void;
}

const KnowledgeContext = createContext<KnowledgeContextValue | null>(null);

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<KnowledgeItem[]>(seedKnowledgeItems);
  const [evidence, setEvidence] = useState<Evidence[]>(seedEvidence);

  const addItem = useCallback((item: KnowledgeItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const addItems = useCallback((newItems: KnowledgeItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<Omit<KnowledgeItem, "id" | "ledgerId" | "createdAt">>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        )
      );
    },
    []
  );

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetItems = useCallback(() => {
    setItems(seedKnowledgeItems);
    setEvidence(seedEvidence);
  }, []);

  const addEvidence = useCallback((entries: Evidence[]) => {
    setEvidence((prev) => [...entries, ...prev]);
  }, []);

  const value = useMemo(
    () => ({ items, addItem, addItems, updateItem, deleteItem, resetItems, evidence, addEvidence }),
    [items, addItem, addItems, updateItem, deleteItem, resetItems, evidence, addEvidence]
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