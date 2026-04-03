"use client";
import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SparklineChart from "@/components/charts/SparklineChart";
import { MARKET_MOVERS } from "@/lib/mockData";
import { formatCurrency, formatPct } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function MarketMovers() {
  const [tab, setTab] = useState<"gainers" | "losers">("gainers");
  const movers = MARKET_MOVERS[tab];

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
        {movers.map((m) => (
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
        ))}
      </div>
    </Card>
  );
}
