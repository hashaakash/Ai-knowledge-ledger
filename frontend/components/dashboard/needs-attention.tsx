import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { KnowledgeItem, Ledger } from "@/lib/types";
import { getNeedsAttentionItems, formatItemType, getConfidenceBadgeClasses } from "@/lib/dashboard-utils";
import { Card } from "@/components/ui/card";

interface NeedsAttentionProps {
  items: KnowledgeItem[];
  ledgers: Ledger[];
}

/**
 * Purely rule-based (see getNeedsAttentionItems in dashboard-utils.ts) — no
 * AI. With the current seed data this section legitimately shows the empty
 * state: no seed weakness/mistake is low-confidence, no two seed mistakes
 * share a tag, and every seed goal was updated within the last two weeks.
 * That's correct behavior, not a bug — the rules were verified separately
 * against constructed test data.
 */
export function NeedsAttention({ items, ledgers }: NeedsAttentionProps) {
  const ledgerById = new Map(ledgers.map((ledger) => [ledger.id, ledger]));
  const entries = getNeedsAttentionItems(items);

  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">Needs Attention</h2>
      <Card className="mt-3 divide-y">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>
          </div>
        ) : (
          entries.map(({ item, reason }) => {
            const ledger = ledgerById.get(item.ledgerId);
            return (
              <Link
                key={item.id}
                href={`/ledger/${item.ledgerId}`}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${getConfidenceBadgeClasses(item.confidence)}`}>
                      {item.confidence}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{reason}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatItemType(item.type)} · {ledger?.name ?? item.ledgerId}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </Card>
    </div>
  );
}