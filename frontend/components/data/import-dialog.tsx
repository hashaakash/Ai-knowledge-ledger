"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle, FileJson, MessageSquare, Upload, X } from "lucide-react";
import type { Evidence, KnowledgeItem } from "@/lib/types";
import { parseAndValidateImport, reconcileImportIds, type ParseImportResult } from "@/lib/import-utils";
import { ledgers } from "@/lib/mock-data/ledgers";
import { formatItemType, getConfidenceBadgeClasses } from "@/lib/dashboard-utils";
import { Button } from "@/components/ui/button";

interface ImportDialogProps {
  open: boolean;
  /** Live snapshot of what's already in the store, used to preview the ids that will actually be used — re-checked again at commit time inside KnowledgeProvider.importItems, so this doesn't need to be perfectly fresh. */
  existingItems: KnowledgeItem[];
  existingEvidence: Evidence[];
  onClose: () => void;
  onImport: (items: KnowledgeItem[], evidence: Evidence[]) => void;
}

/**
 * Same self-contained-modal approach as AddMemoryDialog/MemoryDetail, for
 * the same reason: no verified Base UI Dialog to build against yet.
 *
 * Flow: pick a .json file -> read it as text -> parseAndValidateImport()
 * (shape check) -> reconcileImportIds() (id-collision check, against the
 * existing store) -> show a preview of what will actually be added -> on
 * confirm, hand the already-reconciled items/evidence to onImport(), which
 * re-reconciles once more against live state at the moment of commit.
 */
export function ImportDialog({ open, existingItems, existingEvidence, onClose, onImport }: ImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseImportResult | null>(null);

  const existingItemIds = useMemo(() => new Set(existingItems.map((i) => i.id)), [existingItems]);
  const existingEvidenceIds = useMemo(() => new Set(existingEvidence.map((e) => e.id)), [existingEvidence]);

  // The actual ids that will land in the store, computed once per parsed
  // file. This is what the preview shows — if a "career-goal-..." id
  // already exists, this is where it becomes "career-goal-...-import-1".
  const reconciled = useMemo(() => {
    if (!parseResult?.ok) return null;
    return reconcileImportIds(parseResult.batch.items, parseResult.batch.evidence, existingItemIds, existingEvidenceIds);
  }, [parseResult, existingItemIds, existingEvidenceIds]);

  if (!open) return null;

  const reset = () => {
    setFileName(null);
    setParseResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeAndReset = () => {
    reset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setParseResult(parseAndValidateImport(text));
    };
    reader.onerror = () => {
      setParseResult({ ok: false, message: "Couldn't read that file. Try again." });
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (reconciled && reconciled.items.length > 0) {
      onImport(reconciled.items, reconciled.evidence);
    }
    closeAndReset();
  };

  const totalErrors = parseResult?.ok
    ? parseResult.batch.itemErrors.length + parseResult.batch.evidenceErrors.length
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={closeAndReset} />

      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-lg border bg-background shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight">Import Knowledge</h2>
          <Button variant="ghost" size="icon" onClick={closeAndReset} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!fileName && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed py-10 text-center transition-colors hover:border-foreground/30"
            >
              <FileJson className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">Choose a JSON file</span>
              <span className="text-xs text-muted-foreground">
                A ChatGPT conversations.json export, or a file exported from this app
              </span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          {fileName && (
            <div className="flex items-center justify-between rounded-md border bg-accent/40 px-3 py-2">
              <span className="truncate text-xs text-muted-foreground">{fileName}</span>
              <button
                type="button"
                onClick={reset}
                className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Change file
              </button>
            </div>
          )}

          {parseResult && !parseResult.ok && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900 dark:bg-red-950">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-xs leading-relaxed text-red-700 dark:text-red-400">{parseResult.message}</p>
            </div>
          )}

          {parseResult && parseResult.ok && reconciled && (
            <div className="mt-4 space-y-3">
              {parseResult.batch.format === "chatgpt" ? (
                <div className="flex items-start gap-2 rounded-md border bg-accent/40 px-3 py-2.5">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-medium text-foreground">ChatGPT conversation export detected</p>
                    <p className="mt-0.5 text-muted-foreground">
                      {parseResult.batch.sourceCount ?? reconciled.items.length} conversation
                      {(parseResult.batch.sourceCount ?? reconciled.items.length) === 1 ? "" : "s"} found ·{" "}
                      {reconciled.items.length} {reconciled.items.length === 1 ? "memory" : "memories"} ready to
                      import
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm">
                  <span className="font-medium text-foreground">{reconciled.items.length}</span>{" "}
                  <span className="text-muted-foreground">
                    {reconciled.items.length === 1 ? "memory" : "memories"} ready to import
                  </span>
                  {reconciled.evidence.length > 0 && (
                    <span className="text-muted-foreground">
                      {" "}
                      · {reconciled.evidence.length} evidence record{reconciled.evidence.length === 1 ? "" : "s"}
                    </span>
                  )}
                </p>
              )}

              {totalErrors > 0 && (
                <p className="text-xs text-muted-foreground">
                  {totalErrors} row{totalErrors === 1 ? "" : "s"} skipped — see details below
                </p>
              )}

              {reconciled.items.length > 0 && (
                <div className="max-h-52 space-y-1.5 overflow-y-auto rounded-md border p-2">
                  {reconciled.items.map((item) => {
                    const ledger = ledgers.find((l) => l.id === item.ledgerId);
                    return (
                      <div key={item.id} className="rounded bg-accent/40 px-2.5 py-1.5">
                        <p className="text-xs font-medium text-foreground">{item.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {formatItemType(item.type)}
                          </span>
                          <span className="rounded-full border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {ledger?.name ?? item.ledgerId}
                          </span>
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getConfidenceBadgeClasses(item.confidence)}`}>
                            {item.confidence}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {totalErrors > 0 && (
                <details className="rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground">
                  <summary className="cursor-pointer font-medium">
                    {totalErrors} skipped row{totalErrors === 1 ? "" : "s"}
                  </summary>
                  <div className="mt-1.5 space-y-1">
                    {parseResult.batch.itemErrors.map((err) => (
                      <p key={`item-${err.index}`}>
                        Row {err.index + 1}: {err.reason}
                      </p>
                    ))}
                    {parseResult.batch.evidenceErrors.map((err) => (
                      <p key={`evidence-${err.index}`}>
                        Evidence row {err.index + 1}: {err.reason}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <Button variant="outline" size="sm" onClick={closeAndReset}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={!reconciled || reconciled.items.length === 0}>
            <Upload className="h-4 w-4" />
            Import {reconciled && reconciled.items.length > 0 ? reconciled.items.length : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}