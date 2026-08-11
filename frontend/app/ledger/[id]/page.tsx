import { notFound } from "next/navigation";
import { getLedgerById } from "@/lib/ledger-utils";
import { AppShell } from "@/components/layout/app-shell";
import { LedgerDetailView } from "@/components/ledger/ledger-detail-view";

// Next.js 16 passes route params as a Promise, so it must be awaited here
// before use — this only affects this server component, not any client
// component below it.
//
// This no longer fetches items itself: LedgerDetailView pulls the live
// item list from the shared knowledge store (via useKnowledgeStore), since
// items can now change at runtime through Import or Add Memory and a
// server component can't see client-side state.
export default async function LedgerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ledger = getLedgerById(id);
  if (!ledger) {
    notFound();
  }

  return (
    <AppShell>
      <LedgerDetailView ledger={ledger} />
    </AppShell>
  );
}