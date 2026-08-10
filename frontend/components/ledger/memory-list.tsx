import { Inbox, Plus } from "lucide-react";
import type { KnowledgeItem } from "@/lib/types";
import { MemoryCard } from "@/components/ledger/memory-card";
import { Button } from "@/components/ui/button";

interface MemoryListProps {
  items: KnowledgeItem[];
  /** Whether the ledger has any memories at all, before search/filter is applied — distinguishes "no memories yet" from "no results for this filter". */
  hasAnyMemories: boolean;
  onSelect: (item: KnowledgeItem) => void;
  onAddMemory: () => void;
}

export function MemoryList({ items, hasAnyMemories, onSelect, onAddMemory }: MemoryListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-muted-foreground">
          <Inbox className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium">
          {hasAnyMemories ? "No memories match your filters." : "No memories in this ledger yet."}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {hasAnyMemories
            ? "Try adjusting your search or filters."
            : "Add your first memory to start building this ledger."}
        </p>
        {!hasAnyMemories && (
          <Button size="sm" className="mt-4" onClick={onAddMemory}>
            <Plus className="h-4 w-4" />
            Add Memory
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MemoryCard key={item.id} item={item} onClick={() => onSelect(item)} />
      ))}
    </div>
  );
}