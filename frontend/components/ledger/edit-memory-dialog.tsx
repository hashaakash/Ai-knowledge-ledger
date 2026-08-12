"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ConfidenceLevel, KnowledgeItem, KnowledgeItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface EditMemoryDialogProps {
  open: boolean;
  item: KnowledgeItem | null;
  onClose: () => void;
  onSave: (
    id: string,
    updates: Pick<KnowledgeItem, "title" | "description" | "type" | "confidence" | "tags">
  ) => void;
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
 * Edit only covers title/description/type/confidence/tags, per spec — not
 * ledger and not evidence. Same self-contained-modal approach as
 * AddMemoryDialog, for the same Base UI reason.
 *
 * The form fields are re-synced from `item` whenever it changes (via the
 * effect below), since this component stays mounted across opens rather
 * than being remounted per item.
 */
export function EditMemoryDialog({ open, item, onClose, onSave }: EditMemoryDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<KnowledgeItemType>("topic");
  const [confidence, setConfidence] = useState<ConfidenceLevel>("medium");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (!item) return;
    setTitle(item.title);
    setDescription(item.description);
    setType(item.type);
    setConfidence(item.confidence);
    setTagsInput(item.tags.join(", "));
  }, [item]);

  if (!open || !item) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSave(item.id, {
      title: title.trim(),
      description: description.trim(),
      type,
      confidence,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-lg border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Edit Memory</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
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
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              className={`mt-1 ${fieldClasses} min-h-20 resize-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!title.trim()}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}