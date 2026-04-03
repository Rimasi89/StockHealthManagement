"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, LineChart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Portfolio",  href: "/portfolio",  Icon: Briefcase },
  { label: "Analysis",  href: "/analysis",   Icon: LineChart },
  { label: "Insights",  href: "/insights",   Icon: Sparkles },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-100 flex">
      {NAV_ITEMS.map(({ label, href, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={cn(
            "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
            active ? "text-indigo-600" : "text-zinc-400"
          )}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
