// ============================================================================
// Ledger color mapping
// ============================================================================
// Ledger.color is a free-text keyword like "violet" or "emerald". We can't
// build Tailwind class names dynamically at runtime (e.g. `bg-${color}-500`)
// because Tailwind only includes classes it can see as literal strings at
// build time. So instead, every color a Ledger might use is mapped here,
// explicitly, to a fixed set of classes. Adding a new ledger color later
// just means adding one more entry to this object.
// ============================================================================

export interface LedgerColorClasses {
  /** Solid background, used behind the ledger icon. */
  iconBg: string;
  /** Icon color on top of iconBg. */
  iconText: string;
  /** Confidence bar fill color. */
  barFill: string;
  /** Subtle text accent, e.g. for the ledger name on hover. */
  textAccent: string;
}

const LEDGER_COLOR_MAP: Record<string, LedgerColorClasses> = {
  violet: {
    iconBg: "bg-violet-50 dark:bg-violet-950",
    iconText: "text-violet-600 dark:text-violet-400",
    barFill: "bg-violet-500",
    textAccent: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    iconText: "text-emerald-600 dark:text-emerald-400",
    barFill: "bg-emerald-500",
    textAccent: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
  },
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconText: "text-blue-600 dark:text-blue-400",
    barFill: "bg-blue-500",
    textAccent: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
  },
  amber: {
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconText: "text-amber-600 dark:text-amber-400",
    barFill: "bg-amber-500",
    textAccent: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
  },
  rose: {
    iconBg: "bg-rose-50 dark:bg-rose-950",
    iconText: "text-rose-600 dark:text-rose-400",
    barFill: "bg-rose-500",
    textAccent: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
  },
};

const FALLBACK_COLOR: LedgerColorClasses = {
  iconBg: "bg-slate-100 dark:bg-slate-800",
  iconText: "text-slate-600 dark:text-slate-400",
  barFill: "bg-slate-500",
  textAccent: "group-hover:text-slate-600 dark:group-hover:text-slate-400",
};

export function getLedgerColorClasses(color: string): LedgerColorClasses {
  return LEDGER_COLOR_MAP[color] ?? FALLBACK_COLOR;
}