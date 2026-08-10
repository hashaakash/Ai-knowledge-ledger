import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ============================================================================
// Icon lookup
// ============================================================================
// Ledger.icon stores a lucide-react icon *name* as a string (e.g. "Binary"),
// not a component — this keeps the mock data (and later, API responses)
// plain JSON-serializable. This function turns that string back into the
// actual component to render. If a ledger ever references an icon name that
// doesn't exist in lucide-react, we fall back to a generic icon instead of
// crashing the page.
// ============================================================================

export function getIcon(name: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? LucideIcons.HelpCircle;
}