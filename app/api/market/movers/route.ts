import { NextResponse } from "next/server";
import { STOCKS } from "@/lib/mockData";
import type { MarketMover } from "@/types/stock";

const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 60_000; // 1 minute

const YF_BASE = "https://query1.finance.yahoo.com/v7/finance/quote";

export async function GET() {
  const cached = cache.get("movers");
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  const tickers = STOCKS.map((s) => s.ticker);
  const symbols = tickers.join(",");

  try {
    const res = await fetch(
      `${YF_BASE}?symbols=${symbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,shortName`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
    );

    if (!res.ok) throw new Error(`Yahoo returned ${res.status}`);

    const json = await res.json();
    const results: Array<{
      symbol: string;
      regularMarketPrice?: number;
      regularMarketChange?: number;
      regularMarketChangePercent?: number;
      shortName?: string;
    }> = json?.quoteResponse?.result ?? [];

    if (!results.length) throw new Error("Empty response");

    const quotes = results.map((r) => {
      const price = r.regularMarketPrice ?? 0;
      const change = r.regularMarketChange ?? 0;
      const prevClose = price - change;
      // Build a simple 7-point sparkline: prev close → current price with slight curve
      const sparkline = Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        return Math.round((prevClose + change * t) * 100) / 100;
      });

      return {
        ticker: r.symbol,
        name: r.shortName ?? r.symbol,
        price,
        changePct: r.regularMarketChangePercent ?? 0,
        sparkline,
      } satisfies MarketMover;
    });

    const sorted = [...quotes].sort((a, b) => b.changePct - a.changePct);
    const gainers = sorted.filter((q) => q.changePct > 0).slice(0, 5);
    const losers = sorted.filter((q) => q.changePct < 0).slice(-5).reverse();

    const data = { gainers, losers };
    cache.set("movers", { data, expiresAt: Date.now() + CACHE_TTL });
    return NextResponse.json(data);
  } catch (err) {
    console.error("Market movers fetch failed:", err);
    // Fall back to mock data
    const { MARKET_MOVERS } = await import("@/lib/mockData");
    return NextResponse.json(MARKET_MOVERS);
  }
}
