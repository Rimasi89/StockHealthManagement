"use client";
import { useState } from "react";
import { INSIGHTS, SENTIMENT } from "@/lib/mockData";
import type { InsightCategory, SentimentLevel } from "@/types/insight";

interface InsightFilters {
  category?: InsightCategory | "all";
  sentiment?: SentimentLevel | "all";
}

export function useInsights(filters: InsightFilters = {}) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const markAsRead = (id: string) => setReadIds((prev) => new Set([...prev, id]));
  const markAllAsRead = () => setReadIds(new Set(INSIGHTS.map((i) => i.id)));

  const filtered = INSIGHTS.filter((insight) => {
    if (filters.category && filters.category !== "all" && insight.category !== filters.category) return false;
    if (filters.sentiment && filters.sentiment !== "all" && insight.sentiment !== filters.sentiment) return false;
    return true;
  }).map((i) => ({ ...i, isNew: i.isNew && !readIds.has(i.id) }));

  const newCount = INSIGHTS.filter((i) => i.isNew && !readIds.has(i.id)).length;

  return { insights: filtered, sentiment: SENTIMENT, newCount, markAsRead, markAllAsRead };
}
