import { formatCurrency, formatDate } from "@/lib/formatters";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name?: string }>;
  label?: string;
  isCurrency?: boolean;
  isTime?: boolean;
}

export default function ChartTooltip({ active, payload, label, isCurrency = true, isTime }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg border border-zinc-700">
      <p className="text-zinc-400 mb-1">
        {isTime ? label : label ? formatDate(label, "short") : ""}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono font-medium">
          {isCurrency ? formatCurrency(p.value) : p.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
}
