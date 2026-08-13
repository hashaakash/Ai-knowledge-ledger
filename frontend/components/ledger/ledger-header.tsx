"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import type { Ledger } from "@/lib/types";
import { getIcon } from "@/lib/icon-map";
import { getLedgerColorClasses } from "@/lib/ledger-colors";
import { formatRelativeDate } from "@/lib/dashboard-utils";
import { Button } from "@/components/ui/button";

interface LedgerHeaderProps {
  ledger: Ledger;
  itemCount: number;
  confidence: number;
  onAddMemory: () => void;
}

export function LedgerHeader({ ledger, itemCount, confidence, onAddMemory }: LedgerHeaderProps) {
  const Icon = getIcon(ledger.icon);
  const colors = getLedgerColorClasses(ledger.color);

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Knowledge
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${colors.iconBg}`}>
            <Icon className={`h-5 w-5 ${colors.iconText}`} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{ledger.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{ledger.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{itemCount} {itemCount === 1 ? "memory" : "memories"}</span>
              <span aria-hidden>·</span>
              <span>{confidence}% confidence</span>
              <span aria-hidden>·</span>
              <span>Updated {formatRelativeDate(ledger.lastUpdated)}</span>
            </div>
          </div>
        </div>

        <Button size="sm" onClick={onAddMemory} className="shrink-0">
          <Plus className="h-4 w-4" />
          Add Memory
        </Button>
      </div>
    </div>
  );
}