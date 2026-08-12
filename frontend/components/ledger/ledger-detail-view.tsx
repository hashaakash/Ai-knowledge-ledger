"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ConfidenceLevel, KnowledgeItemType, Ledger } from "@/lib/types";
import { computeConfidence, getItemsForLedger } from "@/lib/dashboard-utils";
import { useKnowledgeStore } from "@/lib/knowledge-context";
import { LedgerHeader } from "@/components/ledger/ledger-header";
import { MemoryList } from "@/components/ledger/memory-list";
import { MemoryDetail } from "@/components/ledger/memory-detail";
import { AddMemoryDialog } from "@/components/ledger/add-memory-dialog";
import { EditMemoryDialog } from "@/components/ledger/edit-memory-dialog";

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
  // Items come from the shared knowledge store, filtered to this ledger.
  // Any Import, Add Memory, Edit, or Delete anywhere in the app is visible
  // here immediately because everyone reads from the same store.
  const { items: allItems, evidence, addItem, addEvidence, updateItem, deleteItem } = useKnowledgeStore();
  const items = useMemo(() => getItemsForLedger(allItems, ledger.id), [allItems, ledger.id]);

  const [search, setSearch] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceLevel | "all">("all");
  const [typeFilter, setTypeFilter] = useState<KnowledgeItemType | "all">("all");
  const [tagFilter, setTagFilter] = useState<string | "all">("all");

  // Storing the id (not a snapshot of the item) means the drawer always
  // reflects the live item from the store — an Edit shows up in the open
  // drawer immediately, and a Delete makes the drawer close on its own
  // (the lookup below just returns null once the item is gone).
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const itemTypesInLedger = useMemo(
    () => Array.from(new Set(items.map((item) => item.type))),
    [items]
  );
  const tagsInLedger = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.tags))).sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        query.length === 0 ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      const matchesConfidence = confidenceFilter === "all" || item.confidence === confidenceFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesTag = tagFilter === "all" || item.tags.includes(tagFilter);
      return matchesQuery && matchesConfidence && matchesType && matchesTag;
    });
  }, [items, search, confidenceFilter, typeFilter, tagFilter]);

  const handleDelete = () => {
    if (!selectedItem) return;
    const confirmed = window.confirm(`Delete "${selectedItem.title}"? This can't be undone.`);
    if (confirmed) {
      deleteItem(selectedItem.id);
      setSelectedItemId(null);
    }
  };

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
            placeholder="Search title or description..."
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

          {tagsInLedger.length > 0 && (
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground outline-none focus:border-foreground/30"
            >
              <option value="all">All tags</option>
              {tagsInLedger.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
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
          onSelect={(item) => setSelectedItemId(item.id)}
          onAddMemory={() => setIsAddOpen(true)}
        />
      </div>

      {/* The drawer is hidden (rather than unmounted) while the edit dialog
          is open, to avoid two overlapping modal overlays. selectedItemId
          stays set, so the drawer reappears with the freshly-saved item the
          moment the edit dialog closes. */}
      {!isEditOpen && (
        <MemoryDetail
          item={selectedItem}
          ledgerName={ledger.name}
          evidence={evidence}
          onClose={() => setSelectedItemId(null)}
          onEdit={() => setIsEditOpen(true)}
          onDelete={handleDelete}
        />
      )}

      <EditMemoryDialog
        open={isEditOpen}
        item={selectedItem}
        onClose={() => setIsEditOpen(false)}
        onSave={updateItem}
      />

      <AddMemoryDialog
        open={isAddOpen}
        defaultLedgerId={ledger.id}
        onClose={() => setIsAddOpen(false)}
        onAdd={addItem}
        onAddEvidence={addEvidence}
      />
    </div>
  );
}