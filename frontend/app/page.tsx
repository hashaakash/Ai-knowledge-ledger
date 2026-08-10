import {
  Brain,
  FolderKanban,
  Sparkles,
  Target,
  Upload,
  Download,
} from "lucide-react";

import { ledgers } from "@/lib/mock-data/ledgers";
import { getDashboardStats } from "@/lib/dashboard-utils";

import { Sidebar } from "@/components/layout/sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { LedgerCard } from "@/components/ledger/ledger-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";

import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = getDashboardStats();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <PageHeader
            title="Your Knowledge"
            subtitle="Everything your AI has learned about your journey, organized in one place."
            actions={
              <>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                  Import Conversations
                </Button>

                <Button size="sm">
                  <Download className="h-4 w-4" />
                  Export Knowledge
                </Button>
              </>
            }
          />

          {/* Summary stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Total Memories"
              value={stats.totalMemories}
              icon={Brain}
            />

            <StatCard
              label="Categories"
              value={stats.totalCategories}
              icon={FolderKanban}
            />

            <StatCard
              label="Skills"
              value={stats.totalSkills}
              icon={Sparkles}
            />

            <StatCard
              label="Goals"
              value={stats.totalGoals}
              icon={Target}
            />
          </div>

          {/* Knowledge Categories */}
          <div className="mt-10">
            <h2 className="text-sm font-semibold tracking-tight">
              Knowledge Categories
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {ledgers.map((ledger) => (
                <LedgerCard
                  key={ledger.id}
                  ledger={ledger}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-12 mt-10">
            <h2 className="text-sm font-semibold tracking-tight">
              Recent Activity
            </h2>

            <div className="mt-3">
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}