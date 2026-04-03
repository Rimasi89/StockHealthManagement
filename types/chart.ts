export interface ChartDataPoint {
  date: string;
  value: number;
  volume?: number;
}

export interface OHLCPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
