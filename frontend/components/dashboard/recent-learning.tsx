import Link from "next/link";
import type { KnowledgeItem, Ledger } from "@/lib/types";
import { getRecentActivity, formatItemType, formatRelativeDate, getConfidenceBadgeClasses } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui/card";

interface RecentLearningProps {
  items: KnowledgeItem[];
  ledgers: Ledger[];
  limit?: number;
}

/**
 * Reuses getRecentActivity() — the same aggregation that already powers the
 * existing "Recent Activity" section below — rather than recomputing the
 * same sort/enrich logic a second time. This section adds confidence and
 * makes each row a real link.
 *
 * Clicking a row navigates to the item's ledger page, not directly to the
 * memory's own detail drawer — the ledger detail page doesn't currently
 * read a URL parameter to auto-open a specific memory, and adding that
 * wasn't in scope here since it would mean touching the ledger detail
 * experience itself.
 */
export function RecentLearning({ items, ledgers, limit = 6 }: RecentLearningProps) {
  const activity = getRecentActivity(items, ledgers, limit);

  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">Recent Learning</h2>
      <Card className="mt-3 divide-y">
        {activity.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Nothing yet — add or import a memory to see it here.
          </p>
        ) : (
          activity.map((entry) => (
            <Link
              key={entry.id}
              href={`/ledger/${entry.ledgerId}`}
              className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatItemType(entry.type)} · {entry.ledgerName}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getConfidenceBadgeClasses(entry.confidence)}`}>
                  {entry.confidence}
                </span>
                <span className="text-xs text-muted-foreground">{formatRelativeDate(entry.updatedAt)}</span>
              </div>
            </Link>
          ))
        )}
      </Card>
    </div>
  );
}