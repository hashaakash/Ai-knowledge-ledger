import type { KnowledgeItem } from "@/lib/types";
import { getTypeDistribution, formatItemType } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui/card";

interface KnowledgeDistributionProps {
  items: KnowledgeItem[];
}

/**
 * Simple horizontal bar rows — same visual pattern already used for the
 * confidence indicator on LedgerCard (thin bg-accent track, filled div sized
 * by inline width %) rather than a charting library. All rows use one bar
 * color so this doesn't introduce a new multi-color palette to the app.
 */
export function KnowledgeDistribution({ items }: KnowledgeDistributionProps) {
  const distribution = getTypeDistribution(items);

  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">Knowledge Type Distribution</h2>
      <Card className="mt-3 p-4">
        <div className="space-y-3">
          {distribution.map((entry) => (
            <div key={entry.type}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{formatItemType(entry.type)}</span>
                <span className="text-muted-foreground">
                  {entry.count} · {entry.percentage}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-accent">
                <div
                  className="h-full rounded-full bg-foreground/70"
                  style={{ width: `${entry.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}