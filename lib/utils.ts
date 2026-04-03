import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-red-500";
  return "text-zinc-500";
}

export function getChangeBg(value: number): string {
  if (value > 0) return "bg-emerald-50 text-emerald-700";
  if (value < 0) return "bg-red-50 text-red-600";
  return "bg-zinc-100 text-zinc-600";
}

/** Deterministic pseudo-random based on a seed string */
export function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + index;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

/** Generate a price series with realistic random walk */
export function generatePriceSeries(
  base: number,
  days: number,
  volatility: number = 0.02,
  seed: string = "default"
): number[] {
  const series: number[] = [base];
  for (let i = 1; i < days; i++) {
    const r = seededRandom(seed, i);
    const change = (r - 0.5) * 2 * volatility * series[i - 1];
    series.push(Math.max(series[i - 1] + change, 1));
  }
  return series;
}

export function clampValue(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
