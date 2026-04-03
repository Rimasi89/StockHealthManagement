"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatPct } from "@/lib/formatters";

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieDataItem[];
  height?: number;
}

export default function PieChartComponent({ data, height = 200 }: PieChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={height * 0.3}
            outerRadius={height * 0.44}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [formatCurrency(v), ""]}
            contentStyle={{
              background: "#18181b", border: "none", borderRadius: 10,
              color: "#fff", fontSize: 11, padding: "6px 10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-zinc-600 truncate max-w-[120px]">{item.name}</span>
            </div>
            <span className="font-medium text-zinc-800 font-mono ml-2">
              {formatPct((item.value / data.reduce((s, d) => s + d.value, 0)) * 100, false)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
