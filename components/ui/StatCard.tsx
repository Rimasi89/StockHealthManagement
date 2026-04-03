import { ReactNode } from "react";
import { cn, getChangeBg } from "@/lib/utils";
import { formatCurrency, formatPct } from "@/lib/formatters";
import SparklineChart from "@/components/charts/SparklineChart";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaPct?: number;
  sparklineData?: number[];
  icon?: ReactNode;
  isCurrency?: boolean;
  className?: string;
}

export default function StatCard({
  label, value, delta, deltaPct, sparklineData, icon, className,
}: StatCardProps) {
  const hasChange = delta !== undefined || deltaPct !== undefined;
  const positive = (delta ?? deltaPct ?? 0) >= 0;

  return (
    <div className={cn("bg-white rounded-2xl shadow-card border border-zinc-100 p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
        {icon && <div className="text-zinc-300">{icon}</div>}
      </div>

      <p className="text-2xl font-semibold text-zinc-900 font-mono tabular-nums tracking-tight mb-3">
        {value}
      </p>

      <div className="flex items-end justify-between">
        {hasChange && (
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
            getChangeBg(delta ?? deltaPct ?? 0)
          )}>
            {positive ? "▲" : "▼"}
            {deltaPct !== undefined
              ? formatPct(Math.abs(deltaPct))
              : delta !== undefined
              ? formatCurrency(Math.abs(delta))
              : ""}
          </span>
        )}
        {sparklineData && (
          <SparklineChart
            data={sparklineData}
            color={positive ? "#10b981" : "#ef4444"}
            width={72}
            height={32}
          />
        )}
      </div>
    </div>
  );
}
