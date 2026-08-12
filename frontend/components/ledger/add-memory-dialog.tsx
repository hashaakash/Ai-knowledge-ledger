"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ConfidenceLevel, Evidence, KnowledgeItem, KnowledgeItemType } from "@/lib/types";
import { ledgers } from "@/lib/mock-data/ledgers";
import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/ui/button";

interface AddMemoryDialogProps {
  open: boolean;
  /** Ledger this dialog was opened from — pre-selected, but changeable via the Ledger field below. */
  defaultLedgerId: string;
  onClose: () => void;
  onAdd: (item: KnowledgeItem) => void;
  onAddEvidence: (entries: Evidence[]) => void;
}

const ITEM_TYPES: KnowledgeItemType[] = [
  "topic",
  "skill",
  "strength",
  "weakness",
  "mistake",
  "preference",
  "goal",
  "project",
];

const CONFIDENCE_LEVELS: ConfidenceLevel[] = ["low", "medium", "high"];

const fieldClasses =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * A centered modal built with plain fixed-position divs — same reasoning as
 * MemoryDetail: no verified Base UI Dialog to build against. Writes only to
 * the shared KnowledgeProvider (via onAdd / onAddEvidence); there's no
 * backend yet, so nothing here persists past a page refresh.
 */
export function AddMemoryDialog({ open, defaultLedgerId, onClose, onAdd, onAddEvidence }: AddMemoryDialogProps) {
  // Settings > Knowledge > "Default confidence behavior" — pre-fills the
  // confidence field instead of always starting at a hardcoded value.
  const { defaultConfidence } = useSettings();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<KnowledgeItemType>("topic");
  const [ledgerId, setLedgerId] = useState(defaultLedgerId);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(defaultConfidence);
  const [tagsInput, setTagsInput] = useState("");

  // Evidence is optional — collapsed behind a toggle rather than always-on
  // fields, so the common case (no evidence yet) stays a short form.
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceSnippet, setEvidenceSnippet] = useState("");
  const [evidenceSource, setEvidenceSource] = useState("");
  const [evidenceDate, setEvidenceDate] = useState(today());

  if (!open) return null;

  const resetAndClose = () => {
    setTitle("");
    setDescription("");
    setType("topic");
    setLedgerId(defaultLedgerId);
    setConfidence(defaultConfidence);
    setTagsInput("");
    setShowEvidence(false);
    setEvidenceSnippet("");
    setEvidenceSource("");
    setEvidenceDate(today());
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const now = new Date().toISOString();
    const evidenceIds: string[] = [];

    if (showEvidence && evidenceSnippet.trim()) {
      const newEvidence: Evidence = {
        id: `ev-manual-${Date.now()}`,
        snippet: evidenceSnippet.trim(),
        sourceLabel: evidenceSource.trim() || "Manually added",
        date: evidenceDate || today(),
      };
      onAddEvidence([newEvidence]);
      evidenceIds.push(newEvidence.id);
    }

    const newItem: KnowledgeItem = {
      id: `${ledgerId}-manual-${Date.now()}`,
      ledgerId,
      type,
      title: title.trim(),
      description: description.trim(),
      confidence,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      evidenceIds,
      createdAt: now,
      updatedAt: now,
    };

    onAdd(newItem);
    resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={resetAndClose} />

      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-lg border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Add Memory</h2>
          <Button variant="ghost" size="icon" onClick={resetAndClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <input
              className={`mt-1 ${fieldClasses}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Comfortable with recursion"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              className={`mt-1 ${fieldClasses} min-h-20 resize-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did the AI learn about you here?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select
                className={`mt-1 ${fieldClasses}`}
                value={type}
                onChange={(e) => setType(e.target.value as KnowledgeItemType)}
              >
                {ITEM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Confidence</label>
              <select
                className={`mt-1 ${fieldClasses}`}
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
              >
                {CONFIDENCE_LEVELS.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Ledger</label>
            <select
              className={`mt-1 ${fieldClasses}`}
              value={ledgerId}
              onChange={(e) => setLedgerId(e.target.value)}
            >
              {ledgers.map((ledger) => (
                <option key={ledger.id} value={ledger.id}>
                  {ledger.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Tags</label>
            <input
              className={`mt-1 ${fieldClasses}`}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="comma, separated, tags"
            />
          </div>

          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowEvidence((v) => !v)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {showEvidence ? "− Remove evidence" : "+ Add supporting evidence (optional)"}
            </button>

            {showEvidence && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Snippet</label>
                  <textarea
                    className={`mt-1 ${fieldClasses} min-h-16 resize-none`}
                    value={evidenceSnippet}
                    onChange={(e) => setEvidenceSnippet(e.target.value)}
                    placeholder="The excerpt this memory is based on"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Source</label>
                    <input
                      className={`mt-1 ${fieldClasses}`}
                      value={evidenceSource}
                      onChange={(e) => setEvidenceSource(e.target.value)}
                      placeholder="e.g. ChatGPT conversation"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Date</label>
                    <input
                      type="date"
                      className={`mt-1 ${fieldClasses}`}
                      value={evidenceDate}
                      onChange={(e) => setEvidenceDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <Button variant="outline" size="sm" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!title.trim()}>
            Add Memory
          </Button>
        </div>
      </div>
    </div>
  );
}