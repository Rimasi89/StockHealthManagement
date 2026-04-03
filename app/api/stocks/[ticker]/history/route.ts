import { NextRequest, NextResponse } from "next/server";
import type { TimeRange } from "@/types/chart";

const cache = new Map<string, { data: unknown; expiresAt: number }>();

// Map app time ranges to Yahoo Finance chart API params
const RANGE_CONFIG: Record<TimeRange, { range: string; interval: string; ttl: number }> = {
  "1D":  { range: "1d",  interval: "5m",  ttl: 60_000 },
  "1W":  { range: "5d",  interval: "1d",  ttl: 300_000 },
  "1M":  { range: "1mo", interval: "1d",  ttl: 600_000 },
  "3M":  { range: "3mo", interval: "1d",  ttl: 1_800_000 },
  "1Y":  { range: "1y",  interval: "1wk", ttl: 3_600_000 },
  "ALL": { range: "5y",  interval: "1mo", ttl: 3_600_000 },
};

const YF_CHART = "https://query1.finance.yahoo.com/v8/finance/chart";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker.toUpperCase();
  const range = (req.nextUrl.searchParams.get("range") ?? "1M") as TimeRange;
  const cfg = RANGE_CONFIG[range] ?? RANGE_CONFIG["1M"];
  const cacheKey = `${ticker}-${range}`;

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const url = `${YF_CHART}/${ticker}?range=${cfg.range}&interval=${cfg.interval}&includePrePost=false`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) throw new Error(`Yahoo returned ${res.status}`);
    const json = await res.json();

    const result = json?.chart?.result?.[0];
    if (!result) throw new Error("Empty chart response");

    const timestamps: number[] = result.timestamp ?? [];
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

    const data = timestamps
      .map((ts, i) => ({
        date: range === "1D"
          ? new Date(ts * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
          : new Date(ts * 1000).toISOString().slice(0, 10),
        value: closes[i] != null ? Math.round(closes[i] * 100) / 100 : null,
      }))
      .filter((d) => d.value != null) as { date: string; value: number }[];

    cache.set(cacheKey, { data, expiresAt: Date.now() + cfg.ttl });
    return NextResponse.json(data);
  } catch (err) {
    console.error(`History fetch failed for ${ticker}:`, err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 502 });
  }
}
