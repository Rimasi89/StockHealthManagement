"use client";
import { useState } from "react";
import Card from "@/components/ui/Card";
import AreaChartComponent from "@/components/charts/AreaChartComponent";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { formatPct } from "@/lib/formatters";
import type { ChartDataPoint, TimeRange } from "@/types/chart";

const RANGES: TimeRange[] = ["1W", "1M", "3M", "1Y", "ALL"];

interface PortfolioSnapshotProps {
  history: ChartDataPoint[];
  isLoading: boolean;
}

export default function PortfolioSnapshot({ history, isLoading }: PortfolioSnapshotProps) {
  const [range, setRange] = useState<TimeRange>("1M");

  const rangeMap: Record<TimeRange, number> = { "1D": 1, "1W": 7, "1M": 30, "3M": 90, "1Y": 252, ALL: 999 };
  const days = rangeMap[range];
  const sliced = history.slice(-Math.min(days, history.length));
  const pctChange = sliced.length > 1
    ? ((sliced[sliced.length - 1].value - sliced[0].value) / sliced[0].value) * 100
    : 0;
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
      ) : (
        <>
          <AreaChartComponent data={sliced} height={224} />
          <p className="text-xs text-zinc-400 mt-3">
            Portfolio{" "}
            <span className={positive ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
              {positive ? "grew" : "declined"} {formatPct(Math.abs(pctChange), false)}
            </span>{" "}
            in this period
          </p>
        </>
      )}
    </Card>
  );
}
