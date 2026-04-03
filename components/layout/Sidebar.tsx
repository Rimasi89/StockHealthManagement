"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Briefcase, LineChart, Sparkles,
  TrendingUp, Settings, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/dashboard",  Icon: LayoutDashboard },
  { label: "Portfolio",  href: "/portfolio",  Icon: Briefcase },
  { label: "Analysis",  href: "/analysis",   Icon: LineChart },
  { label: "Insights",  href: "/insights",   Icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen bg-white border-r border-zinc-100 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-zinc-100">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-zinc-900 text-[15px] tracking-tight">StockCoach</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5", active ? "text-indigo-600" : "text-zinc-400")} size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-800 truncate">My Portfolio</p>
            <p className="text-[11px] text-zinc-400">Demo Account</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
