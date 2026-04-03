"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { ChartDataPoint } from "@/types/chart";
import { CHART_THEME } from "@/lib/constants";
import { formatVolume, formatDate } from "@/lib/formatters";

interface BarChartProps {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
  isVolume?: boolean;
  isTime?: boolean;
}

export default function BarChartComponent({
  data,
  color = CHART_THEME.primaryStroke,
  height = 64,
  isVolume = true,
  isTime = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 2, right: 4, bottom: 0, left: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="0" stroke={CHART_THEME.gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: CHART_THEME.tickColor, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          tickFormatter={(v: string) => isTime ? v : formatDate(v, "short")}
        />
        <YAxis hide tickFormatter={isVolume ? (v: number) => formatVolume(v) : undefined} />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          formatter={(v: number) => [isVolume ? formatVolume(v) : v, isVolume ? "Volume" : "Value"]}
          contentStyle={{
            background: "#18181b", border: "none", borderRadius: 10,
            color: "#fff", fontSize: 11, padding: "6px 10px",
          }}
          labelStyle={{ color: "#a1a1aa", marginBottom: 2 }}
          labelFormatter={(l: string) => isTime ? l : formatDate(l, "short")}
        />
        <Bar dataKey={isVolume ? "volume" : "value"} radius={[2, 2, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={color} fillOpacity={0.6} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
