import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { INSIGHTS } from "@/lib/mockData";
import { AlertTriangle, TrendingUp, RefreshCw, Activity } from "lucide-react";
import Link from "next/link";
import type { InsightCategory } from "@/types/insight";

const CATEGORY_ICONS: Record<InsightCategory, React.ReactNode> = {
  opportunity: <TrendingUp className="w-3.5 h-3.5" />,
  risk:        <AlertTriangle className="w-3.5 h-3.5" />,
  rebalance:   <RefreshCw className="w-3.5 h-3.5" />,
  trend:       <Activity className="w-3.5 h-3.5" />,
};

const CATEGORY_COLOR: Record<InsightCategory, "info" | "warning" | "neutral" | "positive"> = {
  opportunity: "positive",
  risk:        "warning",
  rebalance:   "info",
  trend:       "neutral",
};

export default function QuickInsights() {
  const topInsights = INSIGHTS.filter((i) => i.isNew).slice(0, 3);

  return (
    <Card
      title="AI Coach"
      action={
        <Link href="/insights" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          View all →
        </Link>
      }
    >
      <div className="space-y-3">
        {topInsights.map((insight) => (
          <div key={insight.id} className="flex gap-3 p-3 bg-zinc-50 rounded-xl">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              insight.category === "risk" ? "bg-amber-100 text-amber-600" :
              insight.category === "opportunity" ? "bg-emerald-100 text-emerald-600" :
              "bg-indigo-100 text-indigo-600"
            }`}>
              {CATEGORY_ICONS[insight.category]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-800 leading-snug">{insight.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">{insight.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-400 mt-4 pt-3 border-t border-zinc-100">
        ⚠ For informational purposes only. Not financial advice.
      </p>
    </Card>
  );
}
