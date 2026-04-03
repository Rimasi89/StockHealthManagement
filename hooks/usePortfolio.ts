"use client";
import { useState, useEffect } from "react";
import { RAW_HOLDINGS, STOCKS, PORTFOLIO_HISTORY } from "@/lib/mockData";
import type { Holding, PortfolioSummary } from "@/types/portfolio";
import type { ChartDataPoint } from "@/types/chart";

function computeHoldings(): Holding[] {
  const quoteMap = Object.fromEntries(STOCKS.map((s) => [s.ticker, s]));
  const raw = RAW_HOLDINGS.map((h) => {
    const quote = quoteMap[h.ticker];
    const currentPrice = quote?.price ?? h.avgCost;
    const marketValue = currentPrice * h.shares;
    const totalCost = h.avgCost * h.shares;
    const unrealizedGain = marketValue - totalCost;
    const unrealizedGainPct = (unrealizedGain / totalCost) * 100;
    const dayChange = (quote?.change ?? 0) * h.shares;
    const dayChangePct = quote?.changePct ?? 0;
    return { ...h, currentPrice, marketValue, totalCost, unrealizedGain, unrealizedGainPct, allocationPct: 0, dayChange, dayChangePct };
  });
  const totalValue = raw.reduce((sum, h) => sum + h.marketValue, 0);
  return raw.map((h) => ({ ...h, allocationPct: (h.marketValue / totalValue) * 100 }));
}

function computeSummary(holdings: Holding[]): PortfolioSummary {
  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
  const totalCost = holdings.reduce((s, h) => s + h.totalCost, 0);
  const totalGain = totalValue - totalCost;
  const dayGain = holdings.reduce((s, h) => s + h.dayChange, 0);
  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPct: (totalGain / totalCost) * 100,
    dayGain,
    dayGainPct: (dayGain / (totalValue - dayGain)) * 100,
    cashBalance: 4_280.50,
  };
}

export function usePortfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const h = computeHoldings();
      setHoldings(h);
      setSummary(computeSummary(h));
      setHistory(PORTFOLIO_HISTORY);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { holdings, summary, history, isLoading };
}
