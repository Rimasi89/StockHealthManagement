"use client";
import TopBar from "@/components/layout/TopBar";
import KpiGrid from "@/components/dashboard/KpiGrid";
import PortfolioSnapshot from "@/components/dashboard/PortfolioSnapshot";
import MarketMovers from "@/components/dashboard/MarketMovers";
import QuickInsights from "@/components/dashboard/QuickInsights";
import { usePortfolio } from "@/hooks/usePortfolio";
import { formatCurrency, formatPct, formatDate } from "@/lib/formatters";
import { getChangeColor } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";

export default function DashboardPage() {
  const { summary, isLoading } = usePortfolio();
  const today = formatDate(new Date().toISOString(), "long");

  return (
    <>
      <TopBar title="Dashboard" subtitle={today} />
      <main className="p-6 md:p-8 pb-24 md:pb-8 space-y-6">
        <KpiGrid summary={summary} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioSnapshot />
          </div>
          <div>
            <MarketMovers />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <QuickInsights />
          </div>
          <div className="lg:col-span-2">
            <HoldingsMini />
          </div>
        </div>
      </main>
    </>
  );
}

function HoldingsMini() {
  const { holdings, isLoading } = usePortfolio();

  return (
    <div className="bg-white rounded-2xl shadow-card border border-zinc-100">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-50">
        <h2 className="text-sm font-semibold text-zinc-800">Top Holdings</h2>
        <Link href="/portfolio" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          See all →
        </Link>
      </div>
      <div className="divide-y divide-zinc-50">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <Skeleton className="h-3 w-12" />
                <div className="flex-1"><Skeleton className="h-3 w-full" /></div>
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          : holdings.slice(0, 5).map((h) => (
              <div key={h.id} className="flex items-center gap-4 px-6 py-3 hover:bg-zinc-50/50 transition-colors">
                <span className="text-sm font-bold text-zinc-900 font-mono w-14 shrink-0">{h.ticker}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">{h.shares} sh</span>
                    <span className="text-[10px] text-zinc-300">·</span>
                    <span className="text-xs text-zinc-400">{h.allocationPct.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1.5 h-1 bg-zinc-100 rounded-full overflow-hidden w-full max-w-[120px]">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.min(h.allocationPct * 2.5, 100)}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-zinc-900 font-mono">{formatCurrency(h.marketValue)}</p>
                  <p className={`text-xs ${getChangeColor(h.unrealizedGainPct)}`}>
                    {formatPct(h.unrealizedGainPct)}
                  </p>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}
