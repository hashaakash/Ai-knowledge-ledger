import type { ConfidenceLevel, KnowledgeItemType } from "./types";

// ============================================================================
// Shared memory-form constants
// ============================================================================
// Pulled out of add-memory-dialog.tsx and edit-memory-dialog.tsx, which had
// defined these identically and independently. Purely mechanical — same
// values, same styling, just one source instead of two so they can't drift
// out of sync if a new KnowledgeItemType is ever added.
// ============================================================================

export const ITEM_TYPES: KnowledgeItemType[] = [
  "topic",
  "skill",
  "strength",
  "weakness",
  "mistake",
  "preference",
  "goal",
  "project",
];

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = ["low", "medium", "high"];

export const memoryFieldClasses =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30";