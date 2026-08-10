import type { KnowledgeItem } from "@/lib/types";
import { formatItemType, formatRelativeDate, getConfidenceBadgeClasses } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui/card";

interface MemoryCardProps {
  item: KnowledgeItem;
  onClick: () => void;
}

export function MemoryCard({ item, onClick }: MemoryCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="cursor-pointer p-4 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium leading-snug">{item.title}</h3>
        <span className="shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {formatItemType(item.type)}
        </span>
      </div>

      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {item.description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getConfidenceBadgeClasses(item.confidence)}`}>
            {item.confidence}
          </span>
          <span className="text-[11px] text-muted-foreground">{formatRelativeDate(item.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}