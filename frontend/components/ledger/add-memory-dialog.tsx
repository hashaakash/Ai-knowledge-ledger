"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ConfidenceLevel, KnowledgeItem, KnowledgeItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface AddMemoryDialogProps {
  open: boolean;
  ledgerId: string;
  onClose: () => void;
  onAdd: (item: KnowledgeItem) => void;
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

/**
 * A centered modal built with plain fixed-position divs, for the same reason
 * MemoryDetail avoids components/ui/sheet — the real Base UI Dialog wasn't
 * available to inspect. Only writes to local state (via onAdd); there's no
 * backend yet, so nothing here persists past a page refresh.
 */
export function AddMemoryDialog({ open, ledgerId, onClose, onAdd }: AddMemoryDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<KnowledgeItemType>("topic");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("medium");
  const [tagsInput, setTagsInput] = useState("");

  if (!open) return null;

  const resetAndClose = () => {
    setTitle("");
    setDescription("");
    setType("topic");
    setConfidence("medium");
    setTagsInput("");
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const now = new Date().toISOString();
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
      evidenceIds: [],
      createdAt: now,
      updatedAt: now,
    };

    onAdd(newItem);
    resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={resetAndClose} />

      <div className="relative w-full max-w-md rounded-lg border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Add Memory</h2>
          <Button variant="ghost" size="icon" onClick={resetAndClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 px-5 py-4">
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
            <label className="text-xs font-medium text-muted-foreground">Tags</label>
            <input
              className={`mt-1 ${fieldClasses}`}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="comma, separated, tags"
            />
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