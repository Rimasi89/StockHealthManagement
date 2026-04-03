export function formatCurrency(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1_000_000_000_000)
      return `$${(n / 1_000_000_000_000).toFixed(1)}T`;
    if (Math.abs(n) >= 1_000_000_000)
      return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(n) >= 1_000_000)
      return `$${(n / 1_000_000).toFixed(1)}M`;
    if (Math.abs(n) >= 1_000)
      return `$${(n / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPct(n: number, signed = true): string {
  const prefix = signed && n > 0 ? "+" : "";
  return `${prefix}${n.toFixed(2)}%`;
}

export function formatVolume(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

export function formatMarketCap(n: number): string {
  if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n}`;
}

export function formatDate(iso: string, style: "short" | "medium" | "long" = "medium"): string {
  const date = new Date(iso);
  if (style === "short") return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (style === "long") return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
