"use client";
import { useState, useEffect } from "react";
import { STOCKS, PRICE_SERIES, TECHNICAL_DATA } from "@/lib/mockData";
import type { StockQuote, TechnicalIndicator } from "@/types/stock";
import type { ChartDataPoint, TimeRange } from "@/types/chart";

export function useStockData(ticker: string, range: TimeRange) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [technicals, setTechnicals] = useState<TechnicalIndicator[]>([]);
  const [quote, setQuote] = useState<StockQuote | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function fetchData() {
      try {
        // Fetch live quote
        const quoteRes = await fetch(`/api/stocks/${ticker}/quote`);
        if (!quoteRes.ok) throw new Error("quote failed");
        const liveQuote = await quoteRes.json();

        // Fetch price history
        const histRes = await fetch(`/api/stocks/${ticker}/history?range=${range}`);
        if (!histRes.ok) throw new Error("history failed");
        const liveHistory: ChartDataPoint[] = await histRes.json();

        if (!cancelled) {
          setQuote(liveQuote as StockQuote);
          setData(liveHistory);
          setTechnicals(TECHNICAL_DATA[ticker] ?? []);
          setIsLoading(false);
        }
      } catch {
        // Graceful fallback to mock data
        if (!cancelled) {
          setData(PRICE_SERIES[ticker]?.[range] ?? []);
          setTechnicals(TECHNICAL_DATA[ticker] ?? []);
          setQuote(STOCKS.find((s) => s.ticker === ticker) ?? null);
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [ticker, range]);

  return { data, technicals, quote, isLoading };
}
