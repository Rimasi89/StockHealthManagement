export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  exchange: string;
}

export interface StockQuote extends Stock {
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  week52High: number;
  week52Low: number;
  avgVolume: number;
  dividendYield: number;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  sparkline: number[];
}

export interface TechnicalIndicator {
  date: string;
  rsi: number;
  macdLine: number;
  signalLine: number;
  histogram: number;
  volume: number;
}
