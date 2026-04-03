export type InsightCategory = "opportunity" | "risk" | "rebalance" | "trend";
export type SentimentLevel = "bullish" | "neutral" | "bearish";

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  body: string;
  tickers: string[];
  sentiment: SentimentLevel;
  date: string;
  isNew: boolean;
}

export interface SentimentData {
  bullPct: number;
  bearPct: number;
  neutralPct: number;
  label: SentimentLevel;
}
