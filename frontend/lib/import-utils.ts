import { ledgers } from "./mock-data/ledgers";
import type { ConfidenceLevel, KnowledgeItem, KnowledgeItemType } from "./types";

// ============================================================================
// Import validation
// ============================================================================
// Accepts either a bare array of items, or an object with a knowledgeItems
// array (i.e. the same shape exportAsJSON() produces) — so a file you
// exported from this app can be re-imported into another ledger without
// reshaping it by hand.
//
// Every field is checked individually and bad items are skipped with a
// reason rather than rejecting the whole file, so one malformed entry in a
// 50-item export doesn't block the other 49.
// ============================================================================

const VALID_TYPES: KnowledgeItemType[] = [
  "topic",
  "skill",
  "strength",
  "weakness",
  "mistake",
  "preference",
  "goal",
  "project",
];

const VALID_CONFIDENCE: ConfidenceLevel[] = ["low", "medium", "high"];
const VALID_LEDGER_IDS = new Set(ledgers.map((ledger) => ledger.id));

export interface ImportError {
  index: number;
  reason: string;
}

export interface ImportParseSuccess {
  ok: true;
  valid: KnowledgeItem[];
  errors: ImportError[];
}

export interface ImportParseFailure {
  ok: false;
  message: string;
}

export type ImportParseResult = ImportParseSuccess | ImportParseFailure;

export function parseAndValidateImport(raw: string): ImportParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, message: "This file isn't valid JSON. Check for a trailing comma or missing bracket." };
  }

  const rawItems: unknown[] | null = Array.isArray(parsed)
    ? parsed
    : isRecord(parsed) && Array.isArray(parsed.knowledgeItems)
      ? (parsed.knowledgeItems as unknown[])
      : null;

  if (!rawItems) {
    return {
      ok: false,
      message: 'Expected a JSON array of knowledge items, or an object with a "knowledgeItems" array.',
    };
  }

  if (rawItems.length === 0) {
    return { ok: false, message: "This file doesn't contain any items to import." };
  }

  const valid: KnowledgeItem[] = [];
  const errors: ImportError[] = [];

  rawItems.forEach((raw, index) => {
    const result = validateItem(raw, index);
    if ("error" in result) {
      errors.push({ index, reason: result.error });
    } else {
      valid.push(result.item);
    }
  });

  return { ok: true, valid, errors };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateItem(raw: unknown, index: number): { item: KnowledgeItem } | { error: string } {
  if (!isRecord(raw)) return { error: "Not a valid object" };

  if (typeof raw.title !== "string" || !raw.title.trim()) {
    return { error: 'Missing or invalid "title"' };
  }
  if (typeof raw.description !== "string") {
    return { error: 'Missing or invalid "description"' };
  }
  if (typeof raw.ledgerId !== "string" || !VALID_LEDGER_IDS.has(raw.ledgerId)) {
    return { error: `Unknown ledgerId "${String(raw.ledgerId)}"` };
  }
  if (typeof raw.type !== "string" || !VALID_TYPES.includes(raw.type as KnowledgeItemType)) {
    return { error: `Invalid type "${String(raw.type)}"` };
  }
  if (typeof raw.confidence !== "string" || !VALID_CONFIDENCE.includes(raw.confidence as ConfidenceLevel)) {
    return { error: `Invalid confidence "${String(raw.confidence)}"` };
  }

  const tags = Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === "string") : [];
  const evidenceIds = Array.isArray(raw.evidenceIds)
    ? raw.evidenceIds.filter((id): id is string => typeof id === "string")
    : [];
  const now = new Date().toISOString();

  const item: KnowledgeItem = {
    id: typeof raw.id === "string" && raw.id.trim() ? raw.id : `import-${Date.now()}-${index}`,
    ledgerId: raw.ledgerId,
    type: raw.type as KnowledgeItemType,
    title: raw.title.trim(),
    description: raw.description,
    confidence: raw.confidence as ConfidenceLevel,
    tags,
    evidenceIds,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : now,
  };

  return { item };
}