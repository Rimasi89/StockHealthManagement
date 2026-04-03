import type { TimeRange } from "@/types/chart";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Portfolio", href: "/portfolio", icon: "Briefcase" },
  { label: "Analysis", href: "/analysis", icon: "LineChart" },
  { label: "Insights", href: "/insights", icon: "Sparkles" },
];

export const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export const SECTOR_COLORS: Record<string, string> = {
  Technology: "#6366f1",
  Healthcare: "#10b981",
  Finance: "#3b82f6",
  "Consumer Discretionary": "#f59e0b",
  Energy: "#ef4444",
  Industrials: "#8b5cf6",
  "Communication Services": "#06b6d4",
  "Consumer Staples": "#84cc16",
  Materials: "#f97316",
  Utilities: "#64748b",
};

export const CHART_THEME = {
  gridColor: "#f4f4f5",
  tooltipBg: "#18181b",
  primaryStroke: "#4f46e5",
  positiveStroke: "#10b981",
  negativeStroke: "#ef4444",
  neutralStroke: "#94a3b8",
  tickColor: "#a1a1aa",
  tickSize: 11,
};
