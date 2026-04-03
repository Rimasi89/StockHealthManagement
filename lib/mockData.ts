import type { StockQuote, MarketMover, TechnicalIndicator } from "@/types/stock";
import type { RawHolding, Transaction } from "@/types/portfolio";
import type { ChartDataPoint, TimeRange } from "@/types/chart";
import type { Insight, SentimentData } from "@/types/insight";
import { generatePriceSeries, seededRandom } from "@/lib/utils";

// ─── Stock Universe ────────────────────────────────────────────────────────────
export const STOCKS: StockQuote[] = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", exchange: "NASDAQ", price: 213.49, change: 2.31, changePct: 1.09, volume: 58_200_000, avgVolume: 61_000_000, marketCap: 3_290_000_000_000, peRatio: 33.2, week52High: 237.23, week52Low: 164.08, dividendYield: 0.44 },
  { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", exchange: "NASDAQ", price: 415.32, change: -3.18, changePct: -0.76, volume: 21_400_000, avgVolume: 23_000_000, marketCap: 3_082_000_000_000, peRatio: 36.8, week52High: 468.35, week52Low: 362.90, dividendYield: 0.67 },
  { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Technology", exchange: "NASDAQ", price: 875.40, change: 18.72, changePct: 2.19, volume: 43_100_000, avgVolume: 45_000_000, marketCap: 2_155_000_000_000, peRatio: 68.4, week52High: 974.00, week52Low: 402.10, dividendYield: 0.03 },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", exchange: "NASDAQ", price: 191.75, change: 0.95, changePct: 0.50, volume: 36_500_000, avgVolume: 40_000_000, marketCap: 2_008_000_000_000, peRatio: 42.1, week52High: 201.20, week52Low: 118.35, dividendYield: 0 },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Communication Services", exchange: "NASDAQ", price: 172.63, change: -1.24, changePct: -0.71, volume: 24_800_000, avgVolume: 28_000_000, marketCap: 2_147_000_000_000, peRatio: 24.3, week52High: 191.75, week52Low: 130.67, dividendYield: 0 },
  { ticker: "META", name: "Meta Platforms Inc.", sector: "Communication Services", exchange: "NASDAQ", price: 504.22, change: 7.84, changePct: 1.58, volume: 15_600_000, avgVolume: 18_000_000, marketCap: 1_285_000_000_000, peRatio: 25.9, week52High: 531.49, week52Low: 295.00, dividendYield: 0.32 },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Consumer Discretionary", exchange: "NASDAQ", price: 248.50, change: -8.22, changePct: -3.20, volume: 92_000_000, avgVolume: 105_000_000, marketCap: 791_000_000_000, peRatio: 56.7, week52High: 414.50, week52Low: 138.80, dividendYield: 0 },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", sector: "Finance", exchange: "NYSE", price: 206.84, change: 1.12, changePct: 0.54, volume: 11_200_000, avgVolume: 13_000_000, marketCap: 595_000_000_000, peRatio: 12.1, week52High: 220.80, week52Low: 148.27, dividendYield: 2.22 },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", exchange: "NYSE", price: 147.22, change: -0.48, changePct: -0.33, volume: 8_400_000, avgVolume: 9_500_000, marketCap: 355_000_000_000, peRatio: 15.8, week52High: 168.85, week52Low: 143.13, dividendYield: 3.25 },
  { ticker: "V", name: "Visa Inc.", sector: "Finance", exchange: "NYSE", price: 276.50, change: 1.84, changePct: 0.67, volume: 7_800_000, avgVolume: 8_200_000, marketCap: 568_000_000_000, peRatio: 29.4, week52High: 290.96, week52Low: 223.60, dividendYield: 0.77 },
  { ticker: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", exchange: "NYSE", price: 112.34, change: -1.96, changePct: -1.71, volume: 18_700_000, avgVolume: 20_000_000, marketCap: 452_000_000_000, peRatio: 13.9, week52High: 126.34, week52Low: 95.77, dividendYield: 3.36 },
  { ticker: "UNH", name: "UnitedHealth Group", sector: "Healthcare", exchange: "NYSE", price: 489.30, change: 3.15, changePct: 0.65, volume: 4_200_000, avgVolume: 4_800_000, marketCap: 453_000_000_000, peRatio: 21.3, week52High: 558.47, week52Low: 446.00, dividendYield: 1.57 },
  { ticker: "HD", name: "The Home Depot Inc.", sector: "Consumer Discretionary", exchange: "NYSE", price: 342.80, change: 0.62, changePct: 0.18, volume: 3_800_000, avgVolume: 4_200_000, marketCap: 341_000_000_000, peRatio: 22.8, week52High: 395.96, week52Low: 295.39, dividendYield: 2.41 },
  { ticker: "PG", name: "Procter & Gamble Co.", sector: "Consumer Staples", exchange: "NYSE", price: 164.43, change: 0.29, changePct: 0.18, volume: 7_100_000, avgVolume: 7_500_000, marketCap: 388_000_000_000, peRatio: 24.6, week52High: 176.08, week52Low: 152.07, dividendYield: 2.39 },
  { ticker: "CAT", name: "Caterpillar Inc.", sector: "Industrials", exchange: "NYSE", price: 358.20, change: 4.40, changePct: 1.24, volume: 2_900_000, avgVolume: 3_200_000, marketCap: 178_000_000_000, peRatio: 17.1, week52High: 418.49, week52Low: 259.44, dividendYield: 1.49 },
];

// ─── Raw Holdings (user's portfolio) ──────────────────────────────────────────
export const RAW_HOLDINGS: RawHolding[] = [
  { id: "h1", ticker: "AAPL", name: "Apple Inc.", sector: "Technology", shares: 50, avgCost: 172.50 },
  { id: "h2", ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", shares: 20, avgCost: 380.00 },
  { id: "h3", ticker: "NVDA", name: "NVIDIA Corp.", sector: "Technology", shares: 15, avgCost: 620.00 },
  { id: "h4", ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", shares: 30, avgCost: 168.00 },
  { id: "h5", ticker: "JPM", name: "JPMorgan Chase & Co.", sector: "Finance", shares: 25, avgCost: 185.40 },
  { id: "h6", ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", shares: 40, avgCost: 155.20 },
  { id: "h7", ticker: "V", name: "Visa Inc.", sector: "Finance", shares: 18, avgCost: 245.00 },
  { id: "h8", ticker: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", shares: 35, avgCost: 105.80 },
];

// ─── Portfolio History (365 days) ─────────────────────────────────────────────
function buildPortfolioHistory(): ChartDataPoint[] {
  const series = generatePriceSeries(95000, 365, 0.012, "portfolio");
  const points: ChartDataPoint[] = [];
  const now = new Date("2026-04-04");
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    points.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(series[364 - i] * 100) / 100,
    });
  }
  return points;
}
export const PORTFOLIO_HISTORY = buildPortfolioHistory();

// ─── Price Series per ticker per range ────────────────────────────────────────
function buildPriceSeries(ticker: string, currentPrice: number): Record<TimeRange, ChartDataPoint[]> {
  const configs: Record<TimeRange, { days: number; vol: number }> = {
    "1D": { days: 78, vol: 0.003 },
    "1W": { days: 7, vol: 0.008 },
    "1M": { days: 30, vol: 0.015 },
    "3M": { days: 90, vol: 0.018 },
    "1Y": { days: 252, vol: 0.022 },
    ALL:  { days: 500, vol: 0.025 },
  };
  const result = {} as Record<TimeRange, ChartDataPoint[]>;
  for (const [range, cfg] of Object.entries(configs) as [TimeRange, { days: number; vol: number }][]) {
    const series = generatePriceSeries(currentPrice * 0.82, cfg.days, cfg.vol, ticker + range);
    // Scale so last value is near currentPrice
    const scale = currentPrice / series[series.length - 1];
    const now = new Date("2026-04-04");
    result[range] = series.map((v, i) => {
      const d = new Date(now);
      if (range === "1D") {
        const minutes = (i - 77) * 5;
        d.setMinutes(d.getMinutes() + minutes);
        return { date: d.toISOString().slice(11, 16), value: Math.round(v * scale * 100) / 100 };
      }
      d.setDate(d.getDate() - (cfg.days - 1 - i));
      return { date: d.toISOString().slice(0, 10), value: Math.round(v * scale * 100) / 100 };
    });
  }
  return result;
}

export const PRICE_SERIES: Record<string, Record<TimeRange, ChartDataPoint[]>> = {};
for (const stock of STOCKS) {
  PRICE_SERIES[stock.ticker] = buildPriceSeries(stock.ticker, stock.price);
}

// ─── Technical Indicators ─────────────────────────────────────────────────────
function buildTechnicals(ticker: string, days = 90): TechnicalIndicator[] {
  const result: TechnicalIndicator[] = [];
  const now = new Date("2026-04-04");
  for (let i = days - 1; i >= 0; i--) {
    const r = seededRandom(ticker + "tech", i);
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const rsi = 30 + r * 50;
    const macdLine = (r - 0.5) * 4;
    const signalLine = macdLine * 0.85 + (seededRandom(ticker, i + 1000) - 0.5) * 0.5;
    result.push({
      date: d.toISOString().slice(0, 10),
      rsi: Math.round(rsi * 10) / 10,
      macdLine: Math.round(macdLine * 100) / 100,
      signalLine: Math.round(signalLine * 100) / 100,
      histogram: Math.round((macdLine - signalLine) * 100) / 100,
      volume: Math.round((seededRandom(ticker + "vol", i) * 80_000_000 + 10_000_000)),
    });
  }
  return result;
}

export const TECHNICAL_DATA: Record<string, TechnicalIndicator[]> = {};
for (const stock of STOCKS) {
  TECHNICAL_DATA[stock.ticker] = buildTechnicals(stock.ticker);
}

// ─── Market Movers ────────────────────────────────────────────────────────────
export const MARKET_MOVERS: { gainers: MarketMover[]; losers: MarketMover[] } = {
  gainers: [
    { ticker: "NVDA", name: "NVIDIA Corp.", price: 875.40, changePct: 2.19, sparkline: [820, 832, 841, 845, 860, 868, 875] },
    { ticker: "META", name: "Meta Platforms", price: 504.22, changePct: 1.58, sparkline: [488, 491, 495, 498, 500, 502, 504] },
    { ticker: "AAPL", name: "Apple Inc.", price: 213.49, changePct: 1.09, sparkline: [207, 208, 210, 211, 212, 213, 213] },
    { ticker: "CAT",  name: "Caterpillar", price: 358.20, changePct: 1.24, sparkline: [350, 352, 354, 355, 357, 358, 358] },
    { ticker: "V",    name: "Visa Inc.", price: 276.50, changePct: 0.67, sparkline: [272, 273, 274, 275, 275, 276, 276] },
  ],
  losers: [
    { ticker: "TSLA", name: "Tesla Inc.", price: 248.50, changePct: -3.20, sparkline: [260, 257, 255, 253, 251, 250, 248] },
    { ticker: "XOM",  name: "Exxon Mobil", price: 112.34, changePct: -1.71, sparkline: [116, 115, 114, 114, 113, 113, 112] },
    { ticker: "MSFT", name: "Microsoft", price: 415.32, changePct: -0.76, sparkline: [419, 418, 418, 417, 416, 416, 415] },
    { ticker: "GOOGL",name: "Alphabet Inc.", price: 172.63, changePct: -0.71, sparkline: [175, 174, 174, 173, 173, 173, 172] },
    { ticker: "JNJ",  name: "Johnson & Johnson", price: 147.22, changePct: -0.33, sparkline: [148, 148, 147, 147, 147, 147, 147] },
  ],
};

// ─── AI Insights ──────────────────────────────────────────────────────────────
export const INSIGHTS: Insight[] = [
  {
    id: "i1", category: "risk", isNew: true, sentiment: "bearish",
    date: "2026-04-04", tickers: ["AAPL", "MSFT", "NVDA"],
    title: "Tech concentration is high",
    body: "Your portfolio has 68% exposure to the Technology sector. Historically, concentrated portfolios can amplify volatility. Consider diversifying into healthcare or consumer staples to smooth out potential downturns.",
  },
  {
    id: "i2", category: "opportunity", isNew: true, sentiment: "bullish",
    date: "2026-04-04", tickers: ["NVDA"],
    title: "NVDA showing bullish momentum",
    body: "NVIDIA has broken above its 50-day moving average with above-average volume. The RSI at 62 suggests room to run before reaching overbought territory. The AI infrastructure build-out continues to drive demand for their chips.",
  },
  {
    id: "i3", category: "rebalance", isNew: false, sentiment: "neutral",
    date: "2026-04-03", tickers: ["XOM", "JNJ"],
    title: "Consider adding defensive positions",
    body: "With equity markets near all-time highs and volatility ticking up, your energy (XOM) and healthcare (JNJ) holdings act as a cushion. You might consider slightly increasing these positions to reduce overall beta.",
  },
  {
    id: "i4", category: "trend", isNew: false, sentiment: "bearish",
    date: "2026-04-03", tickers: ["TSLA"],
    title: "Tesla below key moving averages",
    body: "TSLA has traded below its 200-day moving average for three consecutive weeks. Delivery figures missed estimates last quarter. The position is -3.2% today. Consider whether your original thesis still holds.",
  },
  {
    id: "i5", category: "opportunity", isNew: false, sentiment: "bullish",
    date: "2026-04-02", tickers: ["JPM", "V"],
    title: "Financials benefit from rate environment",
    body: "JPMorgan and Visa are positioned well in the current rate environment. Net interest margins remain elevated for banks, and consumer spending data shows resilient card volumes for payment networks.",
  },
  {
    id: "i6", category: "rebalance", isNew: false, sentiment: "neutral",
    date: "2026-04-01", tickers: ["AMZN"],
    title: "Amazon at a reasonable valuation",
    body: "After the recent pullback, AMZN trades at roughly 42x earnings — below its 5-year average of 55x. AWS growth reacceleration and improving retail margins make this a potentially attractive entry zone.",
  },
  {
    id: "i7", category: "risk", isNew: false, sentiment: "bearish",
    date: "2026-03-31", tickers: ["TSLA", "NVDA"],
    title: "High-beta names add portfolio volatility",
    body: "TSLA and NVDA together represent significant high-beta exposure. If broader market sentiment shifts, these positions can move sharply. Ensure your position sizes reflect your risk tolerance.",
  },
  {
    id: "i8", category: "trend", isNew: false, sentiment: "bullish",
    date: "2026-03-30", tickers: ["META"],
    title: "Meta's ad revenue trend is improving",
    body: "Meta reported strong Q4 ad revenue growth driven by Reels monetization and AI-enhanced targeting. The stock is up 58% YTD. Current P/E of 26x is reasonable given earnings growth trajectory.",
  },
];

// ─── Sentiment ────────────────────────────────────────────────────────────────
export const SENTIMENT: SentimentData = {
  bullPct: 54,
  neutralPct: 27,
  bearPct: 19,
  label: "bullish",
};

// ─── Transactions ─────────────────────────────────────────────────────────────
export const TRANSACTIONS: Transaction[] = [
  { id: "t1",  date: "2026-04-01", ticker: "AAPL", type: "BUY",  shares: 10, price: 208.50 },
  { id: "t2",  date: "2026-03-28", ticker: "NVDA", type: "BUY",  shares: 5,  price: 855.00 },
  { id: "t3",  date: "2026-03-20", ticker: "TSLA", type: "SELL", shares: 8,  price: 265.00 },
  { id: "t4",  date: "2026-03-15", ticker: "META", type: "SELL", shares: 5,  price: 495.00 },
  { id: "t5",  date: "2026-03-10", ticker: "JPM",  type: "BUY",  shares: 10, price: 198.00 },
  { id: "t6",  date: "2026-03-05", ticker: "AMZN", type: "BUY",  shares: 15, price: 175.40 },
  { id: "t7",  date: "2026-02-28", ticker: "MSFT", type: "BUY",  shares: 5,  price: 395.00 },
  { id: "t8",  date: "2026-02-20", ticker: "JNJ",  type: "BUY",  shares: 20, price: 152.00 },
  { id: "t9",  date: "2026-02-14", ticker: "V",    type: "BUY",  shares: 8,  price: 240.00 },
  { id: "t10", date: "2026-02-05", ticker: "XOM",  type: "BUY",  shares: 15, price: 108.50 },
];
