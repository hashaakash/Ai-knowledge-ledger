"use client";

import { useState } from "react";
import { Brain, FolderKanban, Sparkles, Target, Upload, Download } from "lucide-react";
import { ledgers } from "@/lib/mock-data/ledgers";
import { getDashboardStats, getLedgerConfidence, getLedgerLastUpdated, getItemsForLedger } from "@/lib/dashboard-utils";
import { useKnowledgeStore } from "@/lib/knowledge-context";
import { exportAsJSON } from "@/lib/export-utils";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { LedgerCard } from "@/components/ledger/ledger-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { KnowledgeOverview } from "@/components/dashboard/knowledge-overview";
import { KnowledgeDistribution } from "@/components/dashboard/knowledge-distribution";
import { ConfidenceDistribution } from "@/components/dashboard/confidence-distribution";
import { RecentLearning } from "@/components/dashboard/recent-learning";
import { NeedsAttention } from "@/components/dashboard/needs-attention";
import { ImportDialog } from "@/components/data/import-dialog";
import { Button } from "@/components/ui/button";

// This page reads from the shared knowledge store now (not the static mock
// module directly), so it needs to be a client component. Everything below
// — stats, per-ledger counts/confidence, recent activity — is still
// *computed*, just from live data instead of a fixed import.
export default function DashboardPage() {
  const { items, evidence, importItems } = useKnowledgeStore();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const stats = getDashboardStats(items, ledgers);

  return (
    <AppShell>
      <PageHeader
        title="Your Knowledge"
        subtitle="Everything your AI has learned about your journey, organized in one place."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
              <Upload className="h-4 w-4" />
              Import Conversations
            </Button>
            <Button size="sm" onClick={() => exportAsJSON(items, ledgers, evidence)}>
              <Download className="h-4 w-4" />
              Export Knowledge
            </Button>
          </>
        }
      />

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Memories" value={stats.totalMemories} icon={Brain} />
        <StatCard label="Categories" value={stats.totalCategories} icon={FolderKanban} />
        <StatCard label="Skills" value={stats.totalSkills} icon={Sparkles} />
        <StatCard label="Goals" value={stats.totalGoals} icon={Target} />
      </div>

      {/* Knowledge categories */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold tracking-tight">Knowledge Categories</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ledgers.map((ledger) => (
            <LedgerCard
              key={ledger.id}
              ledger={ledger}
              itemCount={getItemsForLedger(items, ledger.id).length}
              confidence={getLedgerConfidence(items, ledger.id)}
              lastUpdated={getLedgerLastUpdated(items, ledger)}
            />
          ))}
        </div>
      </div>

      {/* Knowledge Overview — deeper stats, additive to the summary row above */}
      <div className="mt-10">
        <KnowledgeOverview items={items} />
      </div>

      {/* Type + confidence distribution */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <KnowledgeDistribution items={items} />
        <ConfidenceDistribution items={items} />
      </div>

      {/* Needs Attention */}
      <div className="mt-10">
        <NeedsAttention items={items} ledgers={ledgers} />
      </div>

      {/* Recent Learning */}
      <div className="mt-10">
        <RecentLearning items={items} ledgers={ledgers} limit={6} />
      </div>

      {/* Recent activity */}
      <div className="mt-10 mb-12">
        <h2 className="text-sm font-semibold tracking-tight">Recent Activity</h2>
        <div className="mt-3">
          <RecentActivity items={items} ledgers={ledgers} limit={6} />
        </div>
      </div>

      <ImportDialog
        open={isImportOpen}
        existingItems={items}
        existingEvidence={evidence}
        onClose={() => setIsImportOpen(false)}
        onImport={importItems}
      />
    </AppShell>
  );
}