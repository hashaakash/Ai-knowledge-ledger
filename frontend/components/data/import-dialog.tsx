"use client";

import { useRef, useState } from "react";
import { AlertTriangle, FileJson, Upload, X } from "lucide-react";
import type { KnowledgeItem } from "@/lib/types";
import { parseAndValidateImport, type ImportParseResult } from "@/lib/import-utils";
import { formatItemType } from "@/lib/dashboard-utils";
import { Button } from "@/components/ui/button";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (items: KnowledgeItem[]) => void;
}

/**
 * Same self-contained-modal approach as AddMemoryDialog/MemoryDetail, for
 * the same reason: no verified Base UI Dialog to build against yet.
 *
 * Flow: pick a .json file -> read it as text -> parseAndValidateImport() ->
 * show a preview (valid count + any skipped rows with a reason) -> confirm
 * appends the valid items to the shared knowledge store. A parse failure
 * (bad JSON, wrong shape) shows an inline error instead of throwing.
 */
export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ImportParseResult | null>(null);

  if (!open) return null;

  const reset = () => {
    setFileName(null);
    setResult(null);
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
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setResult(parseAndValidateImport(text));
    };
    reader.onerror = () => {
      setResult({ ok: false, message: "Couldn't read that file. Try again." });
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    if (result?.ok && result.valid.length > 0) {
      onImport(result.valid);
    }
    closeAndReset();
  };

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
                A knowledge-item array, or a file exported from this app
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

          {result && !result.ok && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900 dark:bg-red-950">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-xs leading-relaxed text-red-700 dark:text-red-400">{result.message}</p>
            </div>
          )}

          {result && result.ok && (
            <div className="mt-4 space-y-3">
              <p className="text-sm">
                <span className="font-medium text-foreground">{result.valid.length}</span>{" "}
                <span className="text-muted-foreground">
                  {result.valid.length === 1 ? "memory" : "memories"} ready to import
                </span>
                {result.errors.length > 0 && (
                  <span className="text-muted-foreground">
                    {" "}
                    · {result.errors.length} skipped
                  </span>
                )}
              </p>

              {result.valid.length > 0 && (
                <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-md border p-2">
                  {result.valid.map((item, i) => (
                    <div key={`${item.id}-${i}`} className="rounded bg-accent/40 px-2.5 py-1.5 text-xs">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="text-muted-foreground"> · {formatItemType(item.type)}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.errors.length > 0 && (
                <details className="rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground">
                  <summary className="cursor-pointer font-medium">
                    {result.errors.length} skipped row{result.errors.length === 1 ? "" : "s"}
                  </summary>
                  <div className="mt-1.5 space-y-1">
                    {result.errors.map((err) => (
                      <p key={err.index}>
                        Row {err.index + 1}: {err.reason}
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
          <Button size="sm" onClick={handleConfirm} disabled={!result?.ok || result.valid.length === 0}>
            <Upload className="h-4 w-4" />
            Import {result?.ok && result.valid.length > 0 ? result.valid.length : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}