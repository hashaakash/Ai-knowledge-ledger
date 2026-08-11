"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ConfidenceLevel } from "./types";

// ============================================================================
// Settings store
// ============================================================================
// Kept separate from KnowledgeProvider on purpose: this holds UI preferences
// (how the app behaves/looks), not knowledge content. Two small contexts
// with clear boundaries are simpler to reason about than one big one.
//
// None of this persists past a refresh — there's no backend yet, so it
// can't. Each setting below is explicit about whether it's actually wired
// into app behavior right now, or just a frontend-only preview.
// ============================================================================

interface SettingsContextValue {
  // Knowledge > "Default confidence behavior" — actually wired: this is the
  // starting confidence value pre-filled in the "Add Memory" dialog.
  defaultConfidence: ConfidenceLevel;
  setDefaultConfidence: (value: ConfidenceLevel) => void;

  // Knowledge > memory-related preference — actually wired: toggles whether
  // tags render on memory cards across ledger pages.
  showTagsOnCards: boolean;
  setShowTagsOnCards: (value: boolean) => void;

  // Knowledge > "Auto-categorization preference" — NOT wired to any real
  // behavior. Real auto-categorization needs the AI extraction pipeline,
  // which is out of scope for this phase. Kept as a labeled preview toggle.
  autoCategorize: boolean;
  setAutoCategorize: (value: boolean) => void;

  // General > "Application preferences" — NOT wired. There's no dark mode
  // implementation in the project to hook into, so this stays a visible,
  // clearly-labeled no-op rather than a fake theme switcher.
  compactDensity: boolean;
  setCompactDensity: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [defaultConfidence, setDefaultConfidence] = useState<ConfidenceLevel>("medium");
  const [showTagsOnCards, setShowTagsOnCards] = useState(true);
  const [autoCategorize, setAutoCategorize] = useState(false);
  const [compactDensity, setCompactDensity] = useState(false);

  const value = useMemo(
    () => ({
      defaultConfidence,
      setDefaultConfidence,
      showTagsOnCards,
      setShowTagsOnCards,
      autoCategorize,
      setAutoCategorize,
      compactDensity,
      setCompactDensity,
    }),
    [defaultConfidence, showTagsOnCards, autoCategorize, compactDensity]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}