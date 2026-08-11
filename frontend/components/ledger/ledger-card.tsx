import Link from "next/link";
import type { Ledger } from "@/lib/types";
import { getIcon } from "@/lib/icon-map";
import { getLedgerColorClasses } from "@/lib/ledger-colors";
import { formatRelativeDate } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui/card";

interface LedgerCardProps {
  ledger: Ledger;
  /** Live item count, confidence, and last-updated — computed by the parent from the shared knowledge store, since a ledger's items can now change via Import/Add Memory. */
  itemCount: number;
  confidence: number;
  lastUpdated: string;
}

export function LedgerCard({ ledger, itemCount, confidence, lastUpdated }: LedgerCardProps) {
  const Icon = getIcon(ledger.icon);
  const colors = getLedgerColorClasses(ledger.color);

  return (
    <Link href={`/ledger/${ledger.id}`} className="group block">
      <Card className="h-full p-4 transition-colors hover:border-foreground/20">
        <div className="flex items-start justify-between">
          <div className={`flex h-9 w-9 items-center justify-center rounded-md ${colors.iconBg}`}>
            <Icon className={`h-4 w-4 ${colors.iconText}`} />
          </div>
          <span className="text-xs text-muted-foreground">{itemCount} memories</span>
        </div>

        <h3 className={`mt-3 text-sm font-semibold tracking-tight transition-colors ${colors.textAccent}`}>
          {ledger.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {ledger.description}
        </p>

        {/* Confidence indicator */}
        <div className="mt-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-accent">
            <div
              className={`h-full rounded-full ${colors.barFill}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{confidence}% confidence</span>
            <span>Updated {formatRelativeDate(lastUpdated)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}