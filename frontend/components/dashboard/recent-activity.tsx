import type { KnowledgeItem, Ledger } from "@/lib/types";
import { getRecentActivity, formatRelativeDate, formatItemType } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui/card";

interface RecentActivityProps {
  items: KnowledgeItem[];
  ledgers: Ledger[];
  limit?: number;
}

export function RecentActivity({ items, ledgers, limit = 6 }: RecentActivityProps) {
  const activity = getRecentActivity(items, ledgers, limit);

  if (activity.length === 0) {
    return (
      <Card className="px-4 py-6 text-center text-sm text-muted-foreground">
        Nothing yet — add or import a memory to see activity here.
      </Card>
    );
  }

  return (
    <Card className="divide-y">
      {activity.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">
              <span className="font-medium">{formatItemType(entry.type)} updated</span>
              <span className="text-muted-foreground"> — {entry.title}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{entry.ledgerName}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeDate(entry.updatedAt)}
          </span>
        </div>
      ))}
    </Card>
  );
}