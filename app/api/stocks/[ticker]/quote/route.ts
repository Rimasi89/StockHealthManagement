import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 60_000; // 1 minute

// Yahoo Finance public REST API — free, no API key required
const YF_BASE = "https://query1.finance.yahoo.com/v7/finance/quote";

export async function GET(
  _req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker.toUpperCase();

  const cached = cache.get(ticker);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(`${YF_BASE}?symbols=${ticker}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume,averageDailyVolume3Month,marketCap,trailingPE,fiftyTwoWeekHigh,fiftyTwoWeekLow,trailingAnnualDividendYield,shortName,sector,exchange`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Yahoo returned ${res.status}`);
    const json = await res.json();
    const r = json?.quoteResponse?.result?.[0];
    if (!r) throw new Error("Empty response");

    const data = {
      ticker,
      name: r.shortName ?? ticker,
      sector: r.sector ?? "Unknown",
      exchange: r.exchange ?? "NASDAQ",
      price: r.regularMarketPrice ?? 0,
      change: r.regularMarketChange ?? 0,
      changePct: r.regularMarketChangePercent ?? 0,
      volume: r.regularMarketVolume ?? 0,
      avgVolume: r.averageDailyVolume3Month ?? 0,
      marketCap: r.marketCap ?? 0,
      peRatio: r.trailingPE ?? 0,
      week52High: r.fiftyTwoWeekHigh ?? 0,
      week52Low: r.fiftyTwoWeekLow ?? 0,
      dividendYield: (r.trailingAnnualDividendYield ?? 0) * 100,
    };

    cache.set(ticker, { data, expiresAt: Date.now() + CACHE_TTL });
    return NextResponse.json(data);
  } catch (err) {
    console.error(`Quote fetch failed for ${ticker}:`, err);
    return NextResponse.json({ error: "Failed to fetch quote — using cached data" }, { status: 502 });
  }
}
