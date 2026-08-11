"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ConfidenceLevel, KnowledgeItem, KnowledgeItemType, Ledger } from "@/lib/types";
import { computeConfidence, getItemsForLedger } from "@/lib/dashboard-utils";
import { useKnowledgeStore } from "@/lib/knowledge-context";
import { LedgerHeader } from "@/components/ledger/ledger-header";
import { MemoryList } from "@/components/ledger/memory-list";
import { MemoryDetail } from "@/components/ledger/memory-detail";
import { AddMemoryDialog } from "@/components/ledger/add-memory-dialog";

interface LedgerDetailViewProps {
  ledger: Ledger;
}

const CONFIDENCE_FILTERS: Array<{ label: string; value: ConfidenceLevel | "all" }> = [
  { label: "All", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export function LedgerDetailView({ ledger }: LedgerDetailViewProps) {
  // Items now come from the shared knowledge store (not a local copy),
  // filtered down to this ledger. This is what makes an item Imported from
  // Settings, or added here via "Add Memory", show up consistently on the
  // Dashboard too — everyone reads from the same place. There's still no
  // backend, so the store itself resets on refresh, same as before.
  const { items: allItems, addItem } = useKnowledgeStore();
  const items = useMemo(() => getItemsForLedger(allItems, ledger.id), [allItems, ledger.id]);

  const [search, setSearch] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceLevel | "all">("all");
  const [typeFilter, setTypeFilter] = useState<KnowledgeItemType | "all">("all");
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const itemTypesInLedger = useMemo(
    () => Array.from(new Set(items.map((item) => item.type))),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        query.length === 0 ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesConfidence = confidenceFilter === "all" || item.confidence === confidenceFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesQuery && matchesConfidence && matchesType;
    });
  }, [items, search, confidenceFilter, typeFilter]);

  return (
    <div>
      <LedgerHeader
        ledger={ledger}
        itemCount={items.length}
        confidence={computeConfidence(items)}
        onAddMemory={() => setIsAddOpen(true)}
      />

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories..."
            className="w-full rounded-md border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-foreground/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border p-0.5">
            {CONFIDENCE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setConfidenceFilter(filter.value)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  confidenceFilter === filter.value
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {itemTypesInLedger.length > 1 && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as KnowledgeItemType | "all")}
              className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground outline-none focus:border-foreground/30"
            >
              <option value="all">All types</option>
              {itemTypesInLedger.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="mt-4">
        <MemoryList
          items={filteredItems}
          hasAnyMemories={items.length > 0}
          onSelect={setSelectedItem}
          onAddMemory={() => setIsAddOpen(true)}
        />
      </div>

      <MemoryDetail item={selectedItem} ledgerName={ledger.name} onClose={() => setSelectedItem(null)} />

      <AddMemoryDialog
        open={isAddOpen}
        ledgerId={ledger.id}
        onClose={() => setIsAddOpen(false)}
        onAdd={addItem}
      />
    </div>
  );
}