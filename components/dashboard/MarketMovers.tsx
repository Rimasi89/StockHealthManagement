"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SparklineChart from "@/components/charts/SparklineChart";
import Skeleton from "@/components/ui/Skeleton";
import { MARKET_MOVERS } from "@/lib/mockData";
import { formatCurrency, formatPct } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { MarketMover } from "@/types/stock";

export default function MarketMovers() {
  const [tab, setTab] = useState<"gainers" | "losers">("gainers");
  const [data, setData] = useState<{ gainers: MarketMover[]; losers: MarketMover[] }>(MARKET_MOVERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/market/movers")
      .then((r) => r.json())
      .then((d) => {
        if (d?.gainers && d?.losers) setData(d);
      })
      .catch(() => {/* keep mock */})
      .finally(() => setIsLoading(false));
  }, []);

  const movers = data[tab];

  return (
    <Card
      title="Market Movers"
      action={
        <div className="flex gap-0.5 bg-zinc-50 p-0.5 rounded-lg">
          {(["gainers", "losers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors",
                tab === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-1 -mx-1">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="flex-1">
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="h-7 w-14" />
                <div className="text-right">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))
          : movers.map((m) => (
              <div key={m.ticker} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 font-mono">{m.ticker}</p>
                  <p className="text-xs text-zinc-400 truncate">{m.name}</p>
                </div>
                <SparklineChart
                  data={m.sparkline}
                  color={m.changePct >= 0 ? "#10b981" : "#ef4444"}
                  width={52}
                  height={28}
                />
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-zinc-900 font-mono">{formatCurrency(m.price)}</p>
                  <Badge variant={m.changePct >= 0 ? "positive" : "negative"}>
                    {formatPct(m.changePct)}
                  </Badge>
                </div>
              </div>
            ))
        }
      </div>
    </Card>
  );
}
