export interface Holding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  totalCost: number;
  unrealizedGain: number;
  unrealizedGainPct: number;
  allocationPct: number;
  dayChange: number;
  dayChangePct: number;
}

export interface RawHolding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
}

export interface Transaction {
  id: string;
  date: string;
  ticker: string;
  type: "BUY" | "SELL";
  shares: number;
  price: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPct: number;
  dayGain: number;
  dayGainPct: number;
  cashBalance: number;
}
