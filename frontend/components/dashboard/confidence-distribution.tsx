import type { KnowledgeItem } from "@/lib/types";
import { getConfidenceDistribution, getConfidenceBarColor } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui/card";

interface ConfidenceDistributionProps {
  items: KnowledgeItem[];
}

const LEVEL_LABEL = { low: "Low", medium: "Medium", high: "High" } as const;

/** Same bar pattern as KnowledgeDistribution, but colored to match the confidence badges used everywhere else in the app (emerald/amber/slate). */
export function ConfidenceDistribution({ items }: ConfidenceDistributionProps) {
  const distribution = getConfidenceDistribution(items);

  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">Confidence Distribution</h2>
      <Card className="mt-3 p-4">
        <div className="space-y-3">
          {distribution.map((entry) => (
            <div key={entry.level}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{LEVEL_LABEL[entry.level]}</span>
                <span className="text-muted-foreground">
                  {entry.count} · {entry.percentage}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-accent">
                <div
                  className={`h-full rounded-full ${getConfidenceBarColor(entry.level)}`}
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