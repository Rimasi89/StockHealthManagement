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
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(PRICE_SERIES[ticker]?.[range] ?? []);
      setTechnicals(TECHNICAL_DATA[ticker] ?? []);
      setQuote(STOCKS.find((s) => s.ticker === ticker) ?? null);
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [ticker, range]);

  return { data, technicals, quote, isLoading };
}
