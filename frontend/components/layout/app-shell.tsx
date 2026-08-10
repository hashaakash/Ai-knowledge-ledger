import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

/**
 * The Sidebar + scrollable main-content wrapper shared by every top-level
 * page. Pulled out of app/page.tsx so /ledger/[id] (and future pages) don't
 * copy-paste the same shell markup — this is purely structural, it doesn't
 * change how the Dashboard looks.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:pl-60">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}