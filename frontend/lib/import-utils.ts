import { ledgers } from "./mock-data/ledgers";
import { makeUniqueId } from "./id-utils";
import type { ConfidenceLevel, Evidence, KnowledgeItem, KnowledgeItemType, Ledger } from "./types";

// ============================================================================
// Import: format detection, parsing/shape validation, conversion, and id
// reconciliation
// ============================================================================
// Two supported input formats:
//
//   "internal" — this app's own export shape: { knowledgeItems, evidence }
//   (or a bare KnowledgeItem[] array). Goes through the original
//   validate-each-field pipeline, unchanged.
//
//   "chatgpt"  — a raw ChatGPT conversations.json export: an array of
//   conversation objects ({ uuid, name, chat_messages, ... }). These don't
//   have title/description/ledgerId/etc. at all, so instead of trying to
//   "validate" them as malformed KnowledgeItems (which is the bug this file
//   was rewritten to fix), they go through a dedicated conversion step that
//   builds a KnowledgeItem + Evidence out of each conversation.
//
// Both formats funnel into the same reconcileImportIds() at the end, so
// duplicate-id handling (see id-utils.ts) is identical either way.
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

export type ImportFormat = "internal" | "chatgpt";

export interface ImportError {
  index: number;
  reason: string;
}

export interface ParsedImportBatch {
  format: ImportFormat;
  items: KnowledgeItem[];
  itemErrors: ImportError[];
  evidence: Evidence[];
  evidenceErrors: ImportError[];
  /** Only meaningful for format "chatgpt" — the raw count of conversation objects found in the file, before any were skipped. Lets the UI say "5 conversations found" even if a couple turned out unusable. */
  sourceCount?: number;
}

export type ParseImportResult = { ok: true; batch: ParsedImportBatch } | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// ----------------------------------------------------------------------------
// Format detection
// ----------------------------------------------------------------------------

function looksLikeChatGPTConversation(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return typeof value.uuid === "string" && typeof value.name === "string" && Array.isArray(value.chat_messages);
}

/**
 * "internal" is the safe default for anything that isn't unambiguously a
 * ChatGPT export — this keeps the existing internal-format behavior (and
 * its error messages) exactly as they were for every case except the one
 * this rewrite specifically targets.
 */
export function detectImportFormat(parsed: unknown): ImportFormat | "unknown" {
  if (isRecord(parsed) && Array.isArray(parsed.knowledgeItems)) return "internal";

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return "internal";
    const sample = parsed.find(isRecord) ?? parsed[0];
    return looksLikeChatGPTConversation(sample) ? "chatgpt" : "internal";
  }

  return "unknown";
}

export function parseAndValidateImport(raw: string): ParseImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, message: "This file isn't valid JSON. Check for a trailing comma or missing bracket." };
  }

  const format = detectImportFormat(parsed);

  if (format === "unknown") {
    return {
      ok: false,
      message:
        'Expected a ChatGPT conversations.json export, a JSON array of knowledge items, or an object with a "knowledgeItems" array.',
    };
  }

  if (format === "chatgpt") {
    return parseChatGPTExport(parsed as unknown[]);
  }

  return parseInternalExport(parsed);
}

// ----------------------------------------------------------------------------
// Internal format (unchanged behavior from before this rewrite)
// ----------------------------------------------------------------------------

function parseInternalExport(parsed: unknown): ParseImportResult {
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

  const rawEvidence: unknown[] = isRecord(parsed) && Array.isArray(parsed.evidence) ? parsed.evidence : [];

  const items: KnowledgeItem[] = [];
  const itemErrors: ImportError[] = [];
  rawItems.forEach((raw, index) => {
    const result = validateItem(raw, index);
    if ("error" in result) itemErrors.push({ index, reason: result.error });
    else items.push(result.item);
  });

  const evidence: Evidence[] = [];
  const evidenceErrors: ImportError[] = [];
  rawEvidence.forEach((raw, index) => {
    const result = validateEvidence(raw, index);
    if ("error" in result) evidenceErrors.push({ index, reason: result.error });
    else evidence.push(result.entry);
  });

  return { ok: true, batch: { format: "internal", items, itemErrors, evidence, evidenceErrors } };
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

function validateEvidence(raw: unknown, index: number): { entry: Evidence } | { error: string } {
  if (!isRecord(raw)) return { error: "Not a valid object" };

  if (typeof raw.snippet !== "string" || !raw.snippet.trim()) {
    return { error: 'Missing or invalid "snippet"' };
  }
  if (typeof raw.sourceLabel !== "string" || !raw.sourceLabel.trim()) {
    return { error: 'Missing or invalid "sourceLabel"' };
  }

  const entry: Evidence = {
    id: typeof raw.id === "string" && raw.id.trim() ? raw.id : `ev-import-${Date.now()}-${index}`,
    snippet: raw.snippet.trim(),
    sourceLabel: raw.sourceLabel.trim(),
    date: typeof raw.date === "string" && raw.date.trim() ? raw.date : new Date().toISOString().slice(0, 10),
  };

  return { entry };
}

// ----------------------------------------------------------------------------
// ChatGPT conversations.json format
// ----------------------------------------------------------------------------
// We intentionally do NOT call an AI here — this is deterministic, local
// conversion. Every conversation becomes exactly one "topic" KnowledgeItem
// at "low" confidence, preserving its title/content as the initial memory.
// A future phase can replace/enhance this step with real extraction that
// identifies skills/strengths/goals/etc. from the conversation content —
// this function is the one place that would change.
// ----------------------------------------------------------------------------

/** Keyword -> ledger mapping, using only ledger ids that actually exist in lib/mock-data/ledgers.ts. There's no separate "Backend" ledger, so backend-related keywords are folded into "web-dev" (its own description already covers backend/API work). */
const LEDGER_KEYWORDS: Record<string, string[]> = {
  dsa: [
    "dsa", "algorithm", "leetcode", "binary search", "recursion", "dynamic programming",
    "graph", "tree", "array", "sorting", "two pointers", "sliding window",
  ],
  linux: ["linux", "ubuntu", "mint", "terminal", "bash", "shell", "systemd", "driver", "bluetooth"],
  "web-dev": [
    "react", "next.js", "nextjs", "javascript", "typescript", "tailwind", "css", "html", "shadcn",
    "node", "express", "golang", "go", "rust", "api", "database", "postgres", "backend",
  ],
  blockchain: ["solidity", "ethereum", "smart contract", "foundry", "hardhat", "chainlink", "defi", "web3"],
  career: ["interview", "resume", "job search", "career", "offer letter", "salary negotiation"],
};

/** Fallback for a conversation that matches no keyword at all — "web-dev" is the broadest of the five existing categories, so an unmatched but clearly technical conversation lands somewhere reasonable rather than being rejected. */
const FALLBACK_LEDGER_ID = "web-dev";

function matchLedgerForConversation(conversation: Record<string, unknown>, ledgerList: Ledger[]): string {
  const validIds = new Set(ledgerList.map((ledger) => ledger.id));
  const name = typeof conversation.name === "string" ? conversation.name : "";
  const summary = typeof conversation.summary === "string" ? conversation.summary : "";
  const messageText = getRepresentativeMessageText(conversation);
  const haystack = `${name} ${summary} ${messageText}`.toLowerCase();

  let bestLedgerId: string | null = null;
  let bestScore = 0;

  for (const [ledgerId, keywords] of Object.entries(LEDGER_KEYWORDS)) {
    if (!validIds.has(ledgerId)) continue; // never match a ledger id that isn't actually in the current ledgers list
    const score = keywords.reduce((count, keyword) => (haystack.includes(keyword) ? count + 1 : count), 0);
    if (score > bestScore) {
      bestScore = score;
      bestLedgerId = ledgerId;
    }
  }

  if (bestLedgerId) return bestLedgerId;
  if (validIds.has(FALLBACK_LEDGER_ID)) return FALLBACK_LEDGER_ID;
  return ledgerList[0]?.id ?? FALLBACK_LEDGER_ID;
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "about", "into", "your", "have", "using", "help",
]);

/** Simple, local, deterministic keyword extraction — no NLP library, per "do not over-engineer this." */
function generateTagsFromText(text: string, max = 5): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
  return Array.from(new Set(words)).slice(0, max);
}

function slugify(text: string, maxLength = 60): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.slice(0, maxLength) || "untitled";
}

function truncate(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}\u2026`;
}

function toDateOnly(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

/** Prefers the first human message (the actual question/context, not the AI's reply); falls back to any message with text; returns "" if the conversation has no usable message content at all — callers must handle that case rather than assume non-empty. */
function getRepresentativeMessageText(conversation: Record<string, unknown>): string {
  const messages = Array.isArray(conversation.chat_messages) ? conversation.chat_messages : [];

  const human = messages.find(
    (m): m is Record<string, unknown> => isRecord(m) && m.sender === "human" && typeof m.text === "string" && m.text.trim().length > 0
  );
  if (human && typeof human.text === "string") return human.text.trim();

  const anyWithText = messages.find(
    (m): m is Record<string, unknown> => isRecord(m) && typeof m.text === "string" && m.text.trim().length > 0
  );
  if (anyWithText && typeof anyWithText.text === "string") return anyWithText.text.trim();

  return "";
}

/** Builds the core KnowledgeItem fields from a conversation. evidenceIds is left empty — the caller (parseChatGPTExport) wires it up after generating the matching Evidence record, since the evidence id is derived from this item's id. */
export function convertConversationToKnowledgeItem(
  conversation: Record<string, unknown>,
  index: number,
  ledgerList: Ledger[]
): KnowledgeItem {
  const name = typeof conversation.name === "string" && conversation.name.trim() ? conversation.name.trim() : `Untitled conversation ${index + 1}`;
  const ledgerId = matchLedgerForConversation(conversation, ledgerList);
  const id = `${ledgerId}-${slugify(name)}`;

  const summary = typeof conversation.summary === "string" ? conversation.summary.trim() : "";
  const description = summary.length > 0
    ? truncate(summary, 300)
    : truncate(getRepresentativeMessageText(conversation), 200) || "Imported from a ChatGPT conversation.";

  const createdAtRaw = typeof conversation.created_at === "string" ? conversation.created_at : new Date().toISOString();
  const createdAt = createdAtRaw;
  const updatedAt = typeof conversation.updated_at === "string" ? conversation.updated_at : createdAtRaw;

  return {
    id,
    ledgerId,
    type: "topic",
    title: name,
    description,
    confidence: "low",
    tags: generateTagsFromText(name),
    evidenceIds: [],
    createdAt,
    updatedAt,
  };
}

/** Builds one Evidence record per conversation — deliberately not one per message, per "do not create hundreds of evidence records." itemId ties the evidence id back to the KnowledgeItem it supports. */
export function convertConversationToEvidence(conversation: Record<string, unknown>, itemId: string): Evidence {
  const name = typeof conversation.name === "string" && conversation.name.trim() ? conversation.name.trim() : "Untitled conversation";
  const messageText = getRepresentativeMessageText(conversation);
  const snippet = truncate(messageText, 300) || "No message content was captured for this conversation.";
  const createdAtRaw = typeof conversation.created_at === "string" ? conversation.created_at : new Date().toISOString();

  return {
    id: `ev-${itemId}`,
    snippet,
    sourceLabel: `ChatGPT conversation: ${name}`,
    date: toDateOnly(createdAtRaw),
  };
}

function parseChatGPTExport(conversations: unknown[]): ParseImportResult {
  if (conversations.length === 0) {
    return { ok: false, message: "This ChatGPT export doesn't contain any conversations." };
  }

  const items: KnowledgeItem[] = [];
  const itemErrors: ImportError[] = [];
  const evidence: Evidence[] = [];

  conversations.forEach((raw, index) => {
    if (!isRecord(raw)) {
      itemErrors.push({ index, reason: "Not a valid conversation object" });
      return;
    }
    if (typeof raw.name !== "string" || !raw.name.trim()) {
      itemErrors.push({ index, reason: "Conversation has no name/title" });
      return;
    }

    // A conversation with zero messages is still a valid, importable
    // conversation (it has a name) — getRepresentativeMessageText and the
    // truncate() fallbacks inside both converters below handle that case
    // without producing an empty title/snippet or throwing.
    const item = convertConversationToKnowledgeItem(raw, index, ledgers);
    const evidenceEntry = convertConversationToEvidence(raw, item.id);
    item.evidenceIds = [evidenceEntry.id];

    items.push(item);
    evidence.push(evidenceEntry);
  });

  return {
    ok: true,
    batch: { format: "chatgpt", items, itemErrors, evidence, evidenceErrors: [], sourceCount: conversations.length },
  };
}

// ----------------------------------------------------------------------------
// ID reconciliation — shared by both formats
// ----------------------------------------------------------------------------

/**
 * Resolves every id collision in a shape-valid batch against a snapshot of
 * ids already in the store: evidence ids first (building a rename map),
 * then item ids — and while walking items, rewrites any evidenceIds entry
 * that pointed at a renamed evidence id, so the relationship survives the
 * rename intact. IDs that don't collide pass through completely unchanged.
 *
 * Pure — takes plain Sets, returns new arrays, touches no state. Used for
 * both formats, and called twice per import (once for the preview, once
 * again inside KnowledgeProvider at commit time — see knowledge-context.tsx).
 */
export function reconcileImportIds(
  items: KnowledgeItem[],
  evidence: Evidence[],
  existingItemIds: Set<string>,
  existingEvidenceIds: Set<string>
): { items: KnowledgeItem[]; evidence: Evidence[] } {
  const evidenceIdsSeen = new Set(existingEvidenceIds);
  const evidenceIdRemap = new Map<string, string>();

  const resolvedEvidence = evidence.map((entry) => {
    const resolvedId = makeUniqueId(entry.id, evidenceIdsSeen, "import");
    evidenceIdsSeen.add(resolvedId);
    if (resolvedId !== entry.id) evidenceIdRemap.set(entry.id, resolvedId);
    return resolvedId === entry.id ? entry : { ...entry, id: resolvedId };
  });

  const itemIdsSeen = new Set(existingItemIds);

  const resolvedItems = items.map((item) => {
    const resolvedId = makeUniqueId(item.id, itemIdsSeen, "import");
    itemIdsSeen.add(resolvedId);

    const remappedEvidenceIds = item.evidenceIds.map((id) => evidenceIdRemap.get(id) ?? id);
    const evidenceIdsChanged = remappedEvidenceIds.some((id, i) => id !== item.evidenceIds[i]);

    if (resolvedId === item.id && !evidenceIdsChanged) return item;
    return { ...item, id: resolvedId, evidenceIds: remappedEvidenceIds };
  });

  return { items: resolvedItems, evidence: resolvedEvidence };
}