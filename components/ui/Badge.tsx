import { cn } from "@/lib/utils";

type Variant = "positive" | "negative" | "neutral" | "info" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  positive: "bg-emerald-50 text-emerald-700",
  negative: "bg-red-50 text-red-600",
  neutral:  "bg-zinc-100 text-zinc-600",
  info:     "bg-indigo-50 text-indigo-700",
  warning:  "bg-amber-50 text-amber-700",
};

export default function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium leading-none",
      VARIANTS[variant],
      className
    )}>
      {children}
    </span>
  );
}
