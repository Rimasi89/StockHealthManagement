import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ className, width, height, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-zinc-100 rounded-lg", className)}
      style={{ width, height, ...style }}
    />
  );
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3" style={{ width: `${60 + i * 10}%` }} />
      ))}
    </div>
  );
}
