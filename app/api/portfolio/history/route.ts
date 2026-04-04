import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { RAW_HOLDINGS } from "@/lib/mockData";
import type { TimeRange } from "@/types/chart";

const RANGE_CONFIG: Record<TimeRange, { range: string; interval: string; ttl: number }> = {
  "1D":  { range: "1d",  interval: "5m",  ttl: 60_000 },
  "1W":  { range: "5d",  interval: "1d",  ttl: 300_000 },
  "1M":  { range: "1mo", interval: "1d",  ttl: 600_000 },
  "3M":  { range: "3mo", interval: "1d",  ttl: 1_800_000 },
  "1Y":  { range: "1y",  interval: "1wk", ttl: 3_600_000 },
  "ALL": { range: "5y",  interval: "1mo", ttl: 3_600_000 },
};

const YF_CHART = "https://query1.finance.yahoo.com/v8/finance/chart";
const cache = new Map<string, { data: unknown; expiresAt: number }>();

// Fetch price series for a single ticker
async function fetchPriceSeries(
  ticker: string,
  range: string,
  interval: string
): Promise<Array<{ date: string; price: number }>> {
  try {
    const res = await fetch(
      `${YF_CHART}/${ticker}?range=${range}&interval=${interval}&includePrePost=false`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return [];

    const timestamps: number[] = result.timestamp ?? [];
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

    return timestamps
      .map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().slice(0, 10),
        price: closes[i],
      }))
      .filter((d) => d.price != null && d.price > 0) as Array<{ date: string; price: number }>;
  } catch {
    return [];
  }
}

// For a given date, find the most recent available price (carry-forward)
function getCarryForwardPrice(
  sortedSeries: Array<{ date: string; price: number }>,
  targetDate: string
): number | null {
  let result: number | null = null;
  for (const { date, price } of sortedSeries) {
    if (date <= targetDate) result = price;
    else break;
  }
  return result;
}

export async function GET(req: NextRequest) {
  const range = (req.nextUrl.searchParams.get("range") ?? "1M") as TimeRange;
  const cfg = RANGE_CONFIG[range] ?? RANGE_CONFIG["1M"];

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? "anonymous";
  const cacheKey = `${userId}-${range}`;

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  // ── Load holdings ──────────────────────────────────────────────────────────
  let holdings: Array<{ ticker: string; shares: number; purchase_date?: string | null }> = [];

  if (session?.user?.id) {
    const supabase = createServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("holdings")
        .select("ticker, shares, purchase_date")
        .eq("user_id", session.user.id);
      if (data && data.length > 0) holdings = data;
    }
  }

  // Fall back to mock holdings if DB is empty or user is not signed in
  if (holdings.length === 0) {
    holdings = RAW_HOLDINGS.map((h) => ({ ticker: h.ticker, shares: h.shares }));
  }

  // ── Fetch price history for each unique ticker in parallel ─────────────────
  const tickers = [...new Set(holdings.map((h) => h.ticker))];
  const seriesMap: Record<string, Array<{ date: string; price: number }>> = {};

  await Promise.all(
    tickers.map(async (ticker) => {
      const series = await fetchPriceSeries(ticker, cfg.range, cfg.interval);
      if (series.length > 0) seriesMap[ticker] = series;
    })
  );

  // ── Build union of all dates ───────────────────────────────────────────────
  const allDates = new Set<string>();
  Object.values(seriesMap).forEach((s) => s.forEach((d) => allDates.add(d.date)));
  const sortedDates = [...allDates].sort();

  // ── Calculate portfolio value per date using carry-forward pricing ─────────
  const portfolioHistory = sortedDates
    .map((date) => {
      let totalValue = 0;
      let hasAnyPrice = false;

      for (const holding of holdings) {
        // Skip this holding if purchased after this date
        if (holding.purchase_date && holding.purchase_date > date) continue;

        const series = seriesMap[holding.ticker];
        if (!series) continue;

        const price = getCarryForwardPrice(series, date);
        if (price != null) {
          totalValue += holding.shares * price;
          hasAnyPrice = true;
        }
      }

      return hasAnyPrice ? { date, value: Math.round(totalValue * 100) / 100 } : null;
    })
    .filter(Boolean);

  cache.set(cacheKey, { data: portfolioHistory, expiresAt: Date.now() + cfg.ttl });
  return NextResponse.json(portfolioHistory);
}
