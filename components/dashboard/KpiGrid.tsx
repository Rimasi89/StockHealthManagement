import type { PortfolioSummary } from "@/types/portfolio";
import StatCard from "@/components/ui/StatCard";
import Skeleton from "@/components/ui/Skeleton";
import { formatCurrency, formatPct } from "@/lib/formatters";
import { PORTFOLIO_HISTORY } from "@/lib/mockData";

interface KpiGridProps {
  summary: PortfolioSummary | null;
  isLoading: boolean;
}

export default function KpiGrid({ summary, isLoading }: KpiGridProps) {
  const sparklineValues = PORTFOLIO_HISTORY.slice(-14).map((d) => d.value);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Total Portfolio"
        value={formatCurrency(summary.totalValue)}
        delta={summary.totalGain}
        sparklineData={sparklineValues}
      />
      <StatCard
        label="Today's Gain / Loss"
        value={formatCurrency(summary.dayGain)}
        deltaPct={summary.dayGainPct}
      />
      <StatCard
        label="Total Return"
        value={formatPct(summary.totalGainPct, true)}
        deltaPct={summary.totalGainPct}
      />
      <StatCard
        label="Cash Balance"
        value={formatCurrency(summary.cashBalance)}
      />
    </div>
  );
}
