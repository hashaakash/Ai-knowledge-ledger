import type { KnowledgeItem, Ledger } from "./types";
import { formatItemType } from "./dashboard-utils";

// ============================================================================
// Export
// ============================================================================
// Pure browser-side: builds a string, wraps it in a Blob, and triggers a
// download via a throwaway <a download> link. No backend involved. The JSON
// shape here intentionally matches what parseAndValidateImport() accepts, so
// exporting from one ledger and importing it elsewhere round-trips cleanly —
// a small but real step toward the "portable knowledge package" concept.
// ============================================================================

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function timestampForFilename(): string {
  return new Date().toISOString().slice(0, 10);
}

export function exportAsJSON(items: KnowledgeItem[], ledgers: Ledger[]) {
  const payload = {
    exportedAt: new Date().toISOString(),
    ledgers,
    knowledgeItems: items,
  };
  downloadFile(
    `ai-knowledge-ledger-${timestampForFilename()}.json`,
    JSON.stringify(payload, null, 2),
    "application/json"
  );
}

export function exportAsMarkdown(items: KnowledgeItem[], ledgers: Ledger[]) {
  const lines: string[] = [`# AI Knowledge Ledger Export`, ``, `_Exported ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}_`, ``];

  for (const ledger of ledgers) {
    const ledgerItems = items.filter((item) => item.ledgerId === ledger.id);
    if (ledgerItems.length === 0) continue;

    lines.push(`## ${ledger.name}`, ``, ledger.description, ``);

    for (const item of ledgerItems) {
      const tags = item.tags.length > 0 ? ` \`${item.tags.join("`, `")}\`` : "";
      lines.push(`- **${item.title}** (${formatItemType(item.type)}, ${item.confidence} confidence)${tags}`);
      lines.push(`  ${item.description}`);
    }
    lines.push("");
  }

  downloadFile(`ai-knowledge-ledger-${timestampForFilename()}.md`, lines.join("\n"), "text/markdown");
}