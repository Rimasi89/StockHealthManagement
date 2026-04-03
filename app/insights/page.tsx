"use client";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useInsights } from "@/hooks/useInsights";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Activity,
  CheckCheck, Minus,
} from "lucide-react";
import type { InsightCategory, SentimentLevel } from "@/types/insight";

const CATEGORY_CONFIG: Record<InsightCategory, { label: string; icon: React.ReactNode; color: string }> = {
  opportunity: { label: "Opportunity", icon: <TrendingUp size={14} />, color: "bg-emerald-100 text-emerald-600" },
  risk:        { label: "Risk",        icon: <AlertTriangle size={14} />, color: "bg-amber-100 text-amber-600" },
  rebalance:   { label: "Rebalance",   icon: <RefreshCw size={14} />,    color: "bg-indigo-100 text-indigo-600" },
  trend:       { label: "Trend",       icon: <Activity size={14} />,     color: "bg-zinc-100 text-zinc-600" },
};

const SENTIMENT_BADGE: Record<SentimentLevel, "positive" | "negative" | "neutral"> = {
  bullish: "positive",
  bearish: "negative",
  neutral: "neutral",
};

const FILTERS: { label: string; value: InsightCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Opportunities", value: "opportunity" },
  { label: "Risks", value: "risk" },
  { label: "Rebalance", value: "rebalance" },
  { label: "Trends", value: "trend" },
];

export default function InsightsPage() {
  const [category, setCategory] = useState<InsightCategory | "all">("all");
  const { insights, sentiment, newCount, markAsRead, markAllAsRead } = useInsights({ category });

  return (
    <>
      <TopBar title="AI Coach & Insights" subtitle="Personalized investment guidance" />
      <main className="p-6 md:p-8 pb-24 md:pb-8 space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Insight feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-1.5 flex-wrap">
                {FILTERS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setCategory(value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      category === value
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {newCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck size={13} /> Mark all read
                </Button>
              )}
            </div>

            {/* Insight cards */}
            {insights.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center">
                <p className="text-zinc-400 text-sm">No insights match this filter.</p>
              </div>
            ) : (
              insights.map((insight) => {
                const cfg = CATEGORY_CONFIG[insight.category];
                return (
                  <div
                    key={insight.id}
                    onClick={() => markAsRead(insight.id)}
                    className="bg-white rounded-2xl border border-zinc-100 shadow-card p-5 cursor-pointer hover:border-zinc-200 transition-colors relative"
                  >
                    {insight.isNew && (
                      <div className="absolute top-4 left-4 w-2 h-2 bg-indigo-500 rounded-full" />
                    )}
                    <div className="flex items-start gap-4 pl-4">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", cfg.color)}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-medium text-zinc-400">{cfg.label}</span>
                          <Badge variant={SENTIMENT_BADGE[insight.sentiment]}>
                            {insight.sentiment}
                          </Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-zinc-900 mb-2 leading-snug">{insight.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{insight.body}</p>
                        <div className="flex items-center gap-2 flex-wrap mt-3">
                          {insight.tickers.map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[11px] font-mono font-medium">
                              {t}
                            </span>
                          ))}
                          <span className="text-[11px] text-zinc-400 ml-auto">{formatDate(insight.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Sentiment gauge */}
            <Card title="Market Sentiment">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-500">Overall</span>
                  <Badge variant={sentiment.label === "bullish" ? "positive" : sentiment.label === "bearish" ? "negative" : "neutral"}>
                    {sentiment.label}
                  </Badge>
                </div>
                {/* Bar */}
                <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                  <div className="bg-emerald-400 rounded-l-full transition-all" style={{ width: `${sentiment.bullPct}%` }} />
                  <div className="bg-zinc-200 transition-all" style={{ width: `${sentiment.neutralPct}%` }} />
                  <div className="bg-red-400 rounded-r-full transition-all" style={{ width: `${sentiment.bearPct}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 font-medium">Bull {sentiment.bullPct}%</span>
                  <span className="text-zinc-400">Neutral {sentiment.neutralPct}%</span>
                  <span className="text-red-500 font-medium">Bear {sentiment.bearPct}%</span>
                </div>
              </div>
            </Card>

            {/* Behavioral coaching */}
            <Card title="Behavioral Coach">
              <div className="space-y-3">
                {[
                  { icon: "🧘", label: "No panic selling detected", ok: true },
                  { icon: "📊", label: "Trade frequency is healthy", ok: true },
                  { icon: "⚖️", label: "Sector concentration is high", ok: false },
                  { icon: "💡", label: "Long-term horizon detected", ok: true },
                ].map(({ icon, label, ok }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-base">{icon}</span>
                    <span className="text-xs text-zinc-600 flex-1">{label}</span>
                    {ok
                      ? <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /></span>
                      : <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /></span>
                    }
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly summary */}
            <Card title="Weekly Summary">
              <div className="space-y-3 text-xs text-zinc-600">
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <p className="font-semibold text-zinc-800 mb-1">This week</p>
                  <ul className="space-y-1.5 list-disc list-inside text-zinc-500">
                    <li>Portfolio up <span className="text-emerald-600 font-medium">+1.8%</span></li>
                    <li>Best performer: <span className="font-mono font-semibold text-zinc-700">NVDA +2.2%</span></li>
                    <li>Worst performer: <span className="font-mono font-semibold text-zinc-700">TSLA −3.2%</span></li>
                    <li>2 new insights generated</li>
                  </ul>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  ⚠ All insights are AI-generated based on market data and are for informational purposes only. This is not financial advice.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
