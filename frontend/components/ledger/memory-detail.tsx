"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { KnowledgeItem } from "@/lib/types";
import { formatItemType, getConfidenceBadgeClasses } from "@/lib/dashboard-utils";
import { getEvidenceForItem } from "@/lib/ledger-utils";
import { Button } from "@/components/ui/button";

interface MemoryDetailProps {
  item: KnowledgeItem | null;
  ledgerName: string;
  onClose: () => void;
}

/**
 * A right-side detail drawer, built with plain fixed-position divs rather
 * than a shared Sheet/Dialog primitive from components/ui. The project's
 * real Base UI Sheet/Dialog components weren't available to inspect when
 * this was written, so this stays fully self-contained to avoid guessing at
 * an API (e.g. `asChild`) that might not exist in the Base UI variant. If
 * you already have a working Sheet component, swapping this markup for it
 * later is a contained change — the props here (`item`, `onClose`) would
 * stay the same.
 */
export function MemoryDetail({ item, ledgerName, onClose }: MemoryDetailProps) {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const evidence = getEvidenceForItem(item);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-background shadow-lg">
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {ledgerName} · {formatItemType(item.type)}
            </span>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">{item.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-foreground">{item.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getConfidenceBadgeClasses(item.confidence)}`}>
              {item.confidence} confidence
            </span>
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-accent px-2.5 py-1 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="mt-0.5 font-medium">
                {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last updated</p>
              <p className="mt-0.5 font-medium">
                {new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {evidence.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Evidence</p>
              <div className="mt-2 space-y-3">
                {evidence.map((entry) => (
                  <div key={entry.id} className="rounded-md border bg-accent/40 p-3">
                    <p className="text-xs leading-relaxed text-foreground">{entry.snippet}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">{entry.sourceLabel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}