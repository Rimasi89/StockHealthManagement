"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, defs, linearGradient, stop,
} from "recharts";
import type { ChartDataPoint } from "@/types/chart";
import ChartTooltip from "@/components/ui/ChartTooltip";
import { CHART_THEME } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface AreaChartProps {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
  isTime?: boolean;
}

export default function AreaChartComponent({
  data,
  color = CHART_THEME.primaryStroke,
  height = 220,
  isTime = false,
}: AreaChartProps) {
  const gradientId = "areaGrad";
  const minVal = Math.min(...data.map((d) => d.value)) * 0.995;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.005;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" stroke={CHART_THEME.gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: CHART_THEME.tickColor, fontSize: CHART_THEME.tickSize }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          tickFormatter={(v: string) => isTime ? v : formatDate(v, "short")}
        />
        <YAxis
          domain={[minVal, maxVal]}
          tick={{ fill: CHART_THEME.tickColor, fontSize: CHART_THEME.tickSize }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v, true)}
          width={58}
        />
        <Tooltip
          content={<ChartTooltip isCurrency isTime={isTime} />}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 2" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
