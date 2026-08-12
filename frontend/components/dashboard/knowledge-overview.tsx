import { Brain, TrendingUp, ThumbsUp, AlertTriangle, RefreshCw, Target, Rocket } from "lucide-react";
import type { KnowledgeItem } from "@/lib/types";
import { getKnowledgeOverviewStats } from "@/lib/dashboard-utils";
import { StatCard } from "@/components/dashboard/stat-card";

interface KnowledgeOverviewProps {
  items: KnowledgeItem[];
}

/**
 * A deeper stat set than the original four-card summary row (Total
 * Memories/Categories/Skills/Goals), which is left untouched above this.
 * Reuses the existing StatCard component as-is — same visual language,
 * just more of it.
 */
export function KnowledgeOverview({ items }: KnowledgeOverviewProps) {
  const stats = getKnowledgeOverviewStats(items);

  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">Knowledge Overview</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Memories" value={stats.totalMemories} icon={Brain} />
        <StatCard label="Avg. Confidence" value={stats.averageConfidence} icon={TrendingUp} />
        <StatCard label="Strengths" value={stats.strengths} icon={ThumbsUp} />
        <StatCard label="Weaknesses" value={stats.weaknesses} icon={AlertTriangle} />
        <StatCard label="Recurring Mistakes" value={stats.recurringMistakes} icon={RefreshCw} />
        <StatCard label="Active Goals" value={stats.activeGoals} icon={Target} />
        <StatCard label="Projects" value={stats.projects} icon={Rocket} />
      </div>
    </div>
  );
}