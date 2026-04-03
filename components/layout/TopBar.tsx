"use client";
import { Bell, Search } from "lucide-react";
import { useInsights } from "@/hooks/useInsights";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { newCount } = useInsights();

  return (
    <header className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 h-8 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-400 w-48 hover:border-zinc-300 transition-colors cursor-pointer">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">Search ticker…</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition-colors">
          <Bell className="w-4 h-4 text-zinc-500" />
          {newCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Disclaimer badge */}
        <div className="hidden lg:flex items-center h-6 px-2.5 bg-amber-50 border border-amber-200 rounded-full">
          <span className="text-[10px] font-medium text-amber-700">Not financial advice</span>
        </div>
      </div>
    </header>
  );
}
