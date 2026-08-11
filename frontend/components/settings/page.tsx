"use client";

import { useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { ledgers } from "@/lib/mock-data/ledgers";
import { useKnowledgeStore } from "@/lib/knowledge-context";
import { useSettings } from "@/lib/settings-context";
import { exportAsJSON, exportAsMarkdown } from "@/lib/export-utils";
import type { ConfidenceLevel } from "@/lib/types";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsSection } from "@/components/settings/settings-section";
import { SettingsRow } from "@/components/settings/settings-row";
import { Toggle } from "@/components/settings/toggle";
import { ImportDialog } from "@/components/data/import-dialog";
import { Button } from "@/components/ui/button";

const selectClasses =
  "rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium outline-none focus:border-foreground/30";

export default function SettingsPage() {
  const { items, addItems, resetItems } = useKnowledgeStore();
  const {
    defaultConfidence,
    setDefaultConfidence,
    showTagsOnCards,
    setShowTagsOnCards,
    autoCategorize,
    setAutoCategorize,
    compactDensity,
    setCompactDensity,
  } = useSettings();

  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleReset = () => {
    const confirmed = window.confirm(
      "This discards any memories you've added or imported this session and restores the original mock data. Continue?"
    );
    if (confirmed) resetItems();
  };

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        subtitle="Frontend preferences for this session — nothing here is saved yet."
      />

      <div className="mt-6 space-y-8 pb-12">
        <SettingsSection title="General" description="Application preferences.">
          <SettingsRow
            label="Compact density"
            description="Tighter spacing throughout the app."
            previewOnly
          >
            <Toggle checked={compactDensity} onChange={setCompactDensity} label="Compact density" />
          </SettingsRow>
          <SettingsRow
            label="Appearance"
            description="This project doesn't have a dark mode implementation yet — nothing to toggle here."
            previewOnly
          >
            <span className="text-xs text-muted-foreground">System default</span>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Knowledge" description="How new memories are handled.">
          <SettingsRow
            label="Default confidence"
            description="Starting confidence for new memories added via \u201cAdd Memory.\u201d"
          >
            <select
              value={defaultConfidence}
              onChange={(e) => setDefaultConfidence(e.target.value as ConfidenceLevel)}
              className={selectClasses}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </SettingsRow>
          <SettingsRow
            label="Auto-categorization"
            description="Automatically suggest a ledger for new memories. Needs the AI extraction pipeline, which isn't built yet."
            previewOnly
          >
            <Toggle checked={autoCategorize} onChange={setAutoCategorize} label="Auto-categorization" />
          </SettingsRow>
          <SettingsRow label="Show tags on memory cards" description="Display tags on the ledger memory grid.">
            <Toggle checked={showTagsOnCards} onChange={setShowTagsOnCards} label="Show tags on memory cards" />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          title="Data"
          description={`${items.length} ${items.length === 1 ? "memory" : "memories"} in this session.`}
        >
          <SettingsRow label="Import knowledge" description="Add memories from a JSON file.">
            <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </SettingsRow>
          <SettingsRow label="Export as JSON" description="Full data, re-importable into this app.">
            <Button variant="outline" size="sm" onClick={() => exportAsJSON(items, ledgers)}>
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </SettingsRow>
          <SettingsRow label="Export as Markdown" description="Readable summary, grouped by ledger.">
            <Button variant="outline" size="sm" onClick={() => exportAsMarkdown(items, ledgers)}>
              <Download className="h-4 w-4" />
              Export Markdown
            </Button>
          </SettingsRow>
          <SettingsRow
            label="Reset to mock data"
            description="Discard changes made this session and restore the original data."
          >
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </SettingsRow>
        </SettingsSection>
      </div>

      <ImportDialog open={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={addItems} />
    </AppShell>
  );
}