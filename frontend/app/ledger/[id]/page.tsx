import { notFound } from "next/navigation";
import { getItemsForLedger } from "@/lib/dashboard-utils";
import { getLedgerById } from "@/lib/ledger-utils";
import { AppShell } from "@/components/layout/app-shell";
import { LedgerDetailView } from "@/components/ledger/ledger-detail-view";

// Next.js 16 passes route params as a Promise, so it must be awaited here
// before use — this only affects this server component, not any client
// component below it.
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

  const items = getItemsForLedger(ledger.id);

  return (
    <AppShell>
      <LedgerDetailView ledger={ledger} initialItems={items} />
    </AppShell>
  );
}