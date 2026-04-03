"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, Briefcase, LineChart, Sparkles,
  TrendingUp, Settings, LogOut,
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
  const { data: session } = useSession();

  const userName = session?.user?.name ?? "Demo User";
  const userEmail = session?.user?.email ?? "demo@stockcoach.app";
  const userImage = session?.user?.image;
  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

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
              <Icon className={cn(active ? "text-indigo-600" : "text-zinc-400")} size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-zinc-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userImage} alt={userName} className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[11px] font-bold">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-800 truncate">{userName}</p>
            <p className="text-[10px] text-zinc-400 truncate">{userEmail}</p>
          </div>
        </div>

        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
