"use client";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LineChartComponent from "@/components/charts/LineChartComponent";
import BarChartComponent from "@/components/charts/BarChartComponent";
import Skeleton from "@/components/ui/Skeleton";
import { useStockData } from "@/hooks/useStockData";
import { STOCKS } from "@/lib/mockData";
import { CHART_THEME, TIME_RANGES } from "@/lib/constants";
import { formatCurrency, formatPct, formatMarketCap, formatVolume, formatNumber } from "@/lib/formatters";
import { getChangeColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TimeRange } from "@/types/chart";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

type Indicator = "volume" | "rsi" | "macd";

export default function AnalysisPage() {
  const [ticker, setTicker] = useState("AAPL");
  const [range, setRange] = useState<TimeRange>("1M");
  const [indicators, setIndicators] = useState<Set<Indicator>>(new Set<Indicator>(["volume"]));
  const { data, technicals, quote, isLoading } = useStockData(ticker, range);

  const toggleIndicator = (ind: Indicator) => {
    setIndicators((prev) => {
      const next = new Set(prev);
      if (next.has(ind)) next.delete(ind);
      else next.add(ind);
      return next;
    });
  };

  const isTime = range === "1D";
  const priceColor = (quote?.changePct ?? 0) >= 0 ? CHART_THEME.positiveStroke : CHART_THEME.negativeStroke;

  // Build volume data from technicals
  const volumeData = technicals.slice(-30).map((t) => ({ date: t.date, value: t.volume, volume: t.volume }));
  const rsiData = technicals.slice(-30);
  const macdData = technicals.slice(-30);

  // Signal analysis
  const latestRsi = technicals[technicals.length - 1]?.rsi ?? 50;
  const signal = latestRsi > 70 ? "overbought" : latestRsi < 30 ? "oversold" : "neutral";
  const signalVariant = signal === "oversold" ? "positive" : signal === "overbought" ? "negative" : "neutral";
  const signalText = signal === "oversold" ? "Potential buy zone" : signal === "overbought" ? "Potential sell zone" : "Neutral territory";

  return (
    <>
      <TopBar title="Stock Analysis" subtitle="Technical indicators & price charts" />
      <main className="p-6 md:p-8 pb-24 md:pb-8 space-y-6">

        {/* Selector row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="h-10 px-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm font-mono"
          >
            {STOCKS.map((s) => (
              <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
            ))}
          </select>

          {quote && !isLoading && (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-zinc-900 tabular-nums">
                {formatCurrency(quote.price)}
              </span>
              <span className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(quote.changePct)}`}>
                {quote.changePct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {formatPct(quote.changePct)} today
              </span>
            </div>
          )}
        </div>

        {/* Quote metrics */}
        {quote && !isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Market Cap", value: formatMarketCap(quote.marketCap) },
              { label: "P/E Ratio", value: quote.peRatio > 0 ? quote.peRatio.toFixed(1) + "x" : "N/A" },
              { label: "52W High", value: formatCurrency(quote.week52High) },
              { label: "52W Low", value: formatCurrency(quote.week52Low) },
              { label: "Volume", value: formatVolume(quote.volume) },
              { label: "Dividend Yield", value: quote.dividendYield > 0 ? formatPct(quote.dividendYield, false) : "None" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl border border-zinc-100 shadow-card px-4 py-3">
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold font-mono text-zinc-900">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        )}

        {/* Price chart */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-card">
          {/* Chart controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-zinc-50">
            <div className="flex gap-0.5 bg-zinc-50 p-0.5 rounded-lg">
              {TIME_RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    range === r ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              {(["volume", "rsi", "macd"] as Indicator[]).map((ind) => (
                <label key={ind} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indicators.has(ind)}
                    onChange={() => toggleIndicator(ind)}
                    className="w-3.5 h-3.5 accent-indigo-600"
                  />
                  <span className="text-xs text-zinc-500 uppercase font-medium">{ind}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4">
            {isLoading
              ? <Skeleton className="w-full h-72" />
              : <LineChartComponent data={data} color={priceColor} height={288} isTime={isTime} />
            }

            {/* Volume */}
            {indicators.has("volume") && volumeData.length > 0 && !isLoading && (
              <div className="mt-3 pt-3 border-t border-zinc-50">
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide mb-2 px-1">Volume</p>
                <BarChartComponent data={volumeData} color={CHART_THEME.neutralStroke} height={56} isVolume />
              </div>
            )}

            {/* RSI */}
            {indicators.has("rsi") && rsiData.length > 0 && !isLoading && (
              <div className="mt-3 pt-3 border-t border-zinc-50">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">RSI (14)</p>
                  <Badge variant={signalVariant}>{signalText}</Badge>
                </div>
                <div className="relative">
                  <LineChartComponent
                    data={rsiData.map((t) => ({ date: t.date, value: t.rsi }))}
                    color="#8b5cf6"
                    height={72}
                  />
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between px-[60px] py-1">
                    <div className="border-t border-red-200 border-dashed w-full" style={{ marginTop: "12%" }} />
                    <div className="border-t border-emerald-200 border-dashed w-full" style={{ marginBottom: "12%" }} />
                  </div>
                </div>
              </div>
            )}

            {/* MACD */}
            {indicators.has("macd") && macdData.length > 0 && !isLoading && (
              <div className="mt-3 pt-3 border-t border-zinc-50">
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide mb-2 px-1">MACD</p>
                <LineChartComponent
                  data={macdData.map((t) => ({ date: t.date, value: t.macdLine }))}
                  color="#f59e0b"
                  height={72}
                />
              </div>
            )}
          </div>
        </div>

        {/* Signal card */}
        <Card title="Signal Summary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SignalItem
              title="Trend"
              value={quote && (quote.changePct) > 0 ? "Bullish" : "Bearish"}
              description={`Price is ${Math.abs(quote?.changePct ?? 0).toFixed(2)}% ${(quote?.changePct ?? 0) >= 0 ? "above" : "below"} yesterday's close`}
              positive={(quote?.changePct ?? 0) >= 0}
            />
            <SignalItem
              title="Momentum (RSI)"
              value={signal === "oversold" ? "Bullish" : signal === "overbought" ? "Bearish" : "Neutral"}
              description={`RSI at ${latestRsi.toFixed(1)} — ${signalText.toLowerCase()}`}
              positive={signal === "oversold"}
              neutral={signal === "neutral"}
            />
            <SignalItem
              title="Valuation"
              value={(quote?.peRatio ?? 0) > 40 ? "Stretched" : (quote?.peRatio ?? 0) > 20 ? "Fair" : "Attractive"}
              description={`P/E of ${quote?.peRatio.toFixed(1)}x vs market average of ~22x`}
              positive={(quote?.peRatio ?? 50) < 22}
              neutral={(quote?.peRatio ?? 50) >= 22 && (quote?.peRatio ?? 50) <= 40}
            />
          </div>
          <p className="text-[10px] text-zinc-400 mt-5 pt-4 border-t border-zinc-100">
            ⚠ Signals are for educational purposes only. Always do your own research. Not financial advice.
          </p>
        </Card>
      </main>
    </>
  );
}

function SignalItem({ title, value, description, positive, neutral }: {
  title: string; value: string; description: string; positive?: boolean; neutral?: boolean;
}) {
  const color = neutral ? "text-zinc-600" : positive ? "text-emerald-600" : "text-red-500";
  const bg = neutral ? "bg-zinc-50" : positive ? "bg-emerald-50" : "bg-red-50";
  return (
    <div className={`p-4 rounded-xl ${bg}`}>
      <p className="text-xs font-medium text-zinc-500 mb-1">{title}</p>
      <p className={`text-base font-bold ${color} mb-1`}>{value}</p>
      <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
