import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function Card({ title, action, children, className, noPadding }: CardProps) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-card border border-zinc-100", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-50">
          {title && <h2 className="text-sm font-semibold text-zinc-800">{title}</h2>}
          {action && <div className="text-xs">{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && "p-6")}>{children}</div>
    </div>
  );
}
