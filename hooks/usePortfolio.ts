"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { RAW_HOLDINGS, STOCKS, PORTFOLIO_HISTORY } from "@/lib/mockData";
import type { Holding, RawHolding, PortfolioSummary } from "@/types/portfolio";
import type { ChartDataPoint } from "@/types/chart";

// ─── Derived computation ───────────────────────────────────────────────────────
function computeHoldings(
  rawHoldings: RawHolding[],
  quotes: Record<string, { price: number; change: number; changePct: number }>
): Holding[] {
  const enriched = rawHoldings.map((h) => {
    const q = quotes[h.ticker];
    const currentPrice = q?.price ?? h.avgCost;
    const marketValue = currentPrice * h.shares;
    const totalCost = h.avgCost * h.shares;
    const unrealizedGain = marketValue - totalCost;
    const unrealizedGainPct = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
    const dayChange = (q?.change ?? 0) * h.shares;
    const dayChangePct = q?.changePct ?? 0;
    return { ...h, currentPrice, marketValue, totalCost, unrealizedGain, unrealizedGainPct, allocationPct: 0, dayChange, dayChangePct };
  });
  const totalValue = enriched.reduce((s, h) => s + h.marketValue, 0);
  return enriched.map((h) => ({
    ...h,
    allocationPct: totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0,
  }));
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
    totalGainPct: totalCost > 0 ? (totalGain / totalCost) * 100 : 0,
    dayGain,
    dayGainPct: totalValue - dayGain > 0 ? (dayGain / (totalValue - dayGain)) * 100 : 0,
    cashBalance: 4_280.50,
  };
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function usePortfolio() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [history] = useState<ChartDataPoint[]>(PORTFOLIO_HISTORY);

  const loadPortfolio = useCallback(async () => {
    setIsLoading(true);

    try {
      if (session?.user?.id) {
        // ── Authenticated: load real data ──────────────────────────────────
        const holdingsRes = await fetch("/api/portfolio");

        if (holdingsRes.ok) {
          const dbHoldings: Array<{
            id: string; ticker: string; name: string; sector: string;
            shares: number; avg_cost: number;
          }> = await holdingsRes.json();

          if (dbHoldings.length > 0) {
            // Batch-fetch live quotes
            const tickers = [...new Set(dbHoldings.map((h) => h.ticker))];
            const quotesRes = await fetch(`/api/stocks/quotes?tickers=${tickers.join(",")}`);
            const quotesMap = quotesRes.ok ? await quotesRes.json() : {};

            const rawHoldings: RawHolding[] = dbHoldings.map((h) => ({
              id: h.id,
              ticker: h.ticker,
              name: h.name,
              sector: h.sector,
              shares: h.shares,
              avgCost: h.avg_cost,
            }));

            const computed = computeHoldings(rawHoldings, quotesMap);
            setHoldings(computed);
            setSummary(computeSummary(computed));
            setIsLoading(false);
            return;
          }
        }
      }
    } catch {
      // Fall through to mock data
    }

    // ── Unauthenticated or DB empty: use mock data with live prices ────────
    try {
      const tickers = RAW_HOLDINGS.map((h) => h.ticker);
      const quotesRes = await fetch(`/api/stocks/quotes?tickers=${tickers.join(",")}`);
      const quotesMap = quotesRes.ok ? await quotesRes.json() : {};

      // Merge live prices with mock holdings if available
      const fallbackQuotes: Record<string, { price: number; change: number; changePct: number }> = {};
      for (const stock of STOCKS) {
        fallbackQuotes[stock.ticker] = { price: stock.price, change: stock.change, changePct: stock.changePct };
      }
      const merged = { ...fallbackQuotes, ...quotesMap };

      const computed = computeHoldings(RAW_HOLDINGS, merged);
      setHoldings(computed);
      setSummary(computeSummary(computed));
    } catch {
      // Pure mock fallback
      const mockQuotes: Record<string, { price: number; change: number; changePct: number }> = {};
      for (const stock of STOCKS) {
        mockQuotes[stock.ticker] = { price: stock.price, change: stock.change, changePct: stock.changePct };
      }
      const computed = computeHoldings(RAW_HOLDINGS, mockQuotes);
      setHoldings(computed);
      setSummary(computeSummary(computed));
    }
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    if (status !== "loading") {
      loadPortfolio();
    }
  }, [loadPortfolio, status]);

  return { holdings, summary, history, isLoading, refetch: loadPortfolio };
}
