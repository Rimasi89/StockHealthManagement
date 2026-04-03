import { NextRequest, NextResponse } from "next/server";

const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 60_000;

const YF_BASE = "https://query1.finance.yahoo.com/v7/finance/quote";

// GET /api/stocks/quotes?tickers=AAPL,MSFT,NVDA
export async function GET(req: NextRequest) {
  const tickersParam = req.nextUrl.searchParams.get("tickers") ?? "";
  const tickers = tickersParam
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

  if (!tickers.length) return NextResponse.json({});

  const cacheKey = [...tickers].sort().join(",");
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const symbols = tickers.join(",");
    const res = await fetch(
      `${YF_BASE}?symbols=${symbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,shortName,sector`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    if (!res.ok) throw new Error(`Yahoo returned ${res.status}`);
    const json = await res.json();
    const results: Array<{
      symbol: string;
      regularMarketPrice?: number;
      regularMarketChange?: number;
      regularMarketChangePercent?: number;
      shortName?: string;
      sector?: string;
    }> = json?.quoteResponse?.result ?? [];

    const data: Record<string, unknown> = {};
    for (const r of results) {
      data[r.symbol] = {
        ticker: r.symbol,
        price: r.regularMarketPrice ?? 0,
        change: r.regularMarketChange ?? 0,
        changePct: r.regularMarketChangePercent ?? 0,
        name: r.shortName ?? r.symbol,
        sector: r.sector ?? "Unknown",
      };
    }

    cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL });
    return NextResponse.json(data);
  } catch (err) {
    console.error("Batch quote error:", err);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 502 });
  }
}
