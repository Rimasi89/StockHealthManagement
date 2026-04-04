"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import AreaChartComponent from "@/components/charts/AreaChartComponent";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { formatPct, formatCurrency } from "@/lib/formatters";
import type { ChartDataPoint, TimeRange } from "@/types/chart";

const RANGES: TimeRange[] = ["1W", "1M", "3M", "1Y", "ALL"];

export default function PortfolioSnapshot() {
  const [range, setRange] = useState<TimeRange>("1M");
  const [history, setHistory] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/portfolio/history?range=${range}`)
      .then((r) => r.json())
      .then((data: ChartDataPoint[]) => {
        if (!cancelled) {
          setHistory(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [range]);

  const first = history[0]?.value ?? 0;
  const last = history[history.length - 1]?.value ?? 0;
  const pctChange = first > 0 ? ((last - first) / first) * 100 : 0;
  const positive = pctChange >= 0;

  return (
    <Card
      title="Portfolio Value"
      action={
        <div className="flex gap-0.5 bg-zinc-50 p-0.5 rounded-lg">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                range === r
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      {isLoading ? (
        <Skeleton className="w-full h-56" />
      ) : history.length === 0 ? (
        <div className="flex items-center justify-center h-56 text-sm text-zinc-400">
          No price data available for this range
        </div>
      ) : (
        <>
          {/* Value + change summary */}
          <div className="flex items-end gap-3 mb-4">
            <span className="text-2xl font-bold font-mono tabular-nums text-zinc-900">
              {formatCurrency(last)}
            </span>
            <span className={`text-sm font-medium mb-0.5 ${positive ? "text-emerald-600" : "text-red-500"}`}>
              {positive ? "▲" : "▼"} {formatPct(Math.abs(pctChange), false)} this period
            </span>
          </div>

          <AreaChartComponent
            data={history}
            color={positive ? "#10b981" : "#ef4444"}
            height={200}
          />

          <p className="text-xs text-zinc-400 mt-3">
            Based on your actual holdings ·{" "}
            <span className={positive ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
              {positive ? "+" : ""}{formatCurrency(last - first)}
            </span>{" "}
            in this period
          </p>
        </>
      )}
    </Card>
  );
}
