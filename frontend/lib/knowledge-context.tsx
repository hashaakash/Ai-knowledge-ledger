"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { knowledgeItems as seedKnowledgeItems } from "./mock-data/knowledge-items";
import type { KnowledgeItem } from "./types";

// ============================================================================
// Knowledge store
// ============================================================================
// This is the one piece of genuinely *shared* client state in the app. It
// exists because, as of this feature, multiple independent parts of the UI
// need to see the same list of knowledge items and stay in sync when it
// changes:
//   - the Dashboard (stats, ledger cards, recent activity)
//   - each /ledger/[id] page (its own filtered slice, plus "Add Memory")
//   - Settings (Import / Export / Reset)
//
// Before this feature, each page held its own local copy — that was fine
// when only one page ever mutated anything. Now that Import (from either
// the Dashboard header or Settings) needs to be visible everywhere else,
// a shared source of truth is the smallest thing that actually works,
// which is why this is a plain React Context instead of a state library.
//
// This still isn't persistence — it's in-memory for the tab's lifetime,
// seeded from the mock data, and resets on refresh. That's intentional at
// this stage; real persistence is backend work.
// ============================================================================

interface KnowledgeContextValue {
  items: KnowledgeItem[];
  /** Add a single item (used by the per-ledger "Add Memory" dialog). */
  addItem: (item: KnowledgeItem) => void;
  /** Add many items at once (used by Import). */
  addItems: (items: KnowledgeItem[]) => void;
  /** Discard all changes and go back to the original mock data. */
  resetItems: () => void;
}

const KnowledgeContext = createContext<KnowledgeContextValue | null>(null);

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<KnowledgeItem[]>(seedKnowledgeItems);

  const addItem = useCallback((item: KnowledgeItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const addItems = useCallback((newItems: KnowledgeItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
  }, []);

  const resetItems = useCallback(() => {
    setItems(seedKnowledgeItems);
  }, []);

  const value = useMemo(
    () => ({ items, addItem, addItems, resetItems }),
    [items, addItem, addItems, resetItems]
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