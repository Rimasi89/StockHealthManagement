"use client";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PieChartComponent from "@/components/charts/PieChartComponent";
import Skeleton from "@/components/ui/Skeleton";
import { usePortfolio } from "@/hooks/usePortfolio";
import { formatCurrency, formatPct, formatDate } from "@/lib/formatters";
import { getChangeColor } from "@/lib/utils";
import { SECTOR_COLORS } from "@/lib/constants";
import { TRANSACTIONS } from "@/lib/mockData";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

export default function PortfolioPage() {
  const { holdings, summary, isLoading } = usePortfolio();
  const [showAdd, setShowAdd] = useState(false);

  // Sector allocation for pie chart
  const sectorMap: Record<string, number> = {};
  holdings.forEach((h) => {
    sectorMap[h.sector] = (sectorMap[h.sector] ?? 0) + h.marketValue;
  });
  const pieData = Object.entries(sectorMap).map(([name, value]) => ({
    name, value, color: SECTOR_COLORS[name] ?? "#94a3b8",
  }));

  return (
    <>
      <TopBar title="Portfolio" subtitle="Your investment positions" />
      <main className="p-6 md:p-8 pb-24 md:pb-8 space-y-6">

        {/* Summary banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Market Value", value: summary ? formatCurrency(summary.totalValue) : "—", sub: null },
            { label: "Total Invested", value: summary ? formatCurrency(summary.totalCost) : "—", sub: null },
            { label: "Unrealized Gain", value: summary ? formatCurrency(summary.totalGain) : "—", sub: summary ? formatPct(summary.totalGainPct) : null, positive: (summary?.totalGain ?? 0) >= 0 },
            { label: "Today's P&L", value: summary ? formatCurrency(summary.dayGain) : "—", sub: summary ? formatPct(summary.dayGainPct) : null, positive: (summary?.dayGain ?? 0) >= 0 },
          ].map(({ label, value, sub, positive }) => (
            <div key={label} className="bg-white rounded-2xl border border-zinc-100 shadow-card p-5">
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide mb-2">{label}</p>
              {isLoading
                ? <Skeleton className="h-7 w-28 mb-1" />
                : <p className={`text-xl font-semibold font-mono tabular-nums ${sub ? getChangeColor(positive ? 1 : -1) : "text-zinc-900"}`}>{value}</p>
              }
              {sub && !isLoading && (
                <p className={`text-xs mt-0.5 ${getChangeColor(positive ? 1 : -1)}`}>{sub}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation chart */}
          <Card title="Allocation by Sector">
            {isLoading
              ? <Skeleton className="w-full h-64" />
              : <PieChartComponent data={pieData} height={160} />
            }
          </Card>

          {/* Holdings table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-card">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-50">
                <h2 className="text-sm font-semibold text-zinc-800">Holdings</h2>
                <Button size="sm" onClick={() => setShowAdd(true)}>
                  <Plus size={13} /> Add Position
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-50">
                      {["Stock", "Shares", "Avg Cost", "Current", "Value", "Gain/Loss", "Alloc"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading
                      ? [...Array(6)].map((_, i) => (
                          <tr key={i} className="border-b border-zinc-50">
                            {[...Array(7)].map((_, j) => (
                              <td key={j} className="px-4 py-3">
                                <Skeleton className={`h-3 ${j === 0 ? "w-16" : "w-12"}`} />
                              </td>
                            ))}
                          </tr>
                        ))
                      : holdings.map((h) => (
                          <tr key={h.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-bold text-zinc-900 font-mono text-sm">{h.ticker}</p>
                              <p className="text-xs text-zinc-400 truncate max-w-[100px]">{h.name}</p>
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-zinc-700">{h.shares}</td>
                            <td className="px-4 py-3 text-sm font-mono text-zinc-700">{formatCurrency(h.avgCost)}</td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-mono text-zinc-900">{formatCurrency(h.currentPrice)}</p>
                              <p className={`text-xs ${getChangeColor(h.dayChangePct)}`}>
                                {formatPct(h.dayChangePct)} today
                              </p>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold font-mono text-zinc-900">
                              {formatCurrency(h.marketValue)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {h.unrealizedGain >= 0
                                  ? <TrendingUp size={12} className="text-emerald-500" />
                                  : <TrendingDown size={12} className="text-red-500" />
                                }
                                <div>
                                  <p className={`text-xs font-medium ${getChangeColor(h.unrealizedGain)}`}>
                                    {formatCurrency(h.unrealizedGain)}
                                  </p>
                                  <p className={`text-[10px] ${getChangeColor(h.unrealizedGainPct)}`}>
                                    {formatPct(h.unrealizedGainPct)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-400 rounded-full"
                                    style={{ width: `${Math.min(h.allocationPct, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500 font-mono">
                                  {h.allocationPct.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <Card title="Recent Transactions">
          <div className="space-y-2">
            {TRANSACTIONS.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-2">
                <Badge variant={t.type === "BUY" ? "positive" : "negative"}>{t.type}</Badge>
                <span className="font-mono font-semibold text-sm text-zinc-900 w-14">{t.ticker}</span>
                <span className="text-sm text-zinc-500 flex-1">
                  {t.shares} shares @ {formatCurrency(t.price)}
                </span>
                <span className="text-xs text-zinc-400">{formatDate(t.date)}</span>
                <span className="text-sm font-medium font-mono text-zinc-700 text-right">
                  {formatCurrency(t.shares * t.price)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Add position modal */}
        {showAdd && <AddPositionModal onClose={() => setShowAdd(false)} />}
      </main>
    </>
  );
}

function AddPositionModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ ticker: "", shares: "", avgCost: "", date: "" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-dropdown w-full max-w-md p-6 z-10">
        <h2 className="text-base font-semibold text-zinc-900 mb-5">Add Position</h2>
        <div className="space-y-4">
          {[
            { label: "Ticker Symbol", key: "ticker", placeholder: "e.g. AAPL" },
            { label: "Number of Shares", key: "shares", placeholder: "e.g. 10" },
            { label: "Average Cost per Share ($)", key: "avgCost", placeholder: "e.g. 172.50" },
            { label: "Purchase Date", key: "date", placeholder: "YYYY-MM-DD" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-zinc-600 mb-1.5">{label}</label>
              <input
                className="w-full h-10 px-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={onClose}>Add Position</Button>
        </div>
        <p className="text-[10px] text-zinc-400 text-center mt-3">
          Demo mode — changes are not persisted
        </p>
      </div>
    </div>
  );
}
