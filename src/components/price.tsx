import { useMoney, useCurrencyStore, CURRENCIES, isCurrency } from "@/lib/currency";

/** Shows a GBP catalog price in the shopper's chosen currency. */
export function Price({ gbp, className }: { gbp: number | string; className?: string }) {
  const { format } = useMoney();
  const n = typeof gbp === "string" ? parseFloat(gbp.replace(/[^0-9.]/g, "")) : gbp;
  if (!Number.isFinite(n)) return <span className={className}>{String(gbp)}</span>;
  return <span className={className}>{format(n)}</span>;
}

const LABELS: Record<string, string> = { GBP: "£ GBP", USD: "$ USD", EUR: "€ EUR" };

export function CurrencyPicker({ className = "" }: { className?: string }) {
  const { currency } = useMoney();
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  return (
    <select
      aria-label="Currency"
      value={currency}
      onChange={(e) => isCurrency(e.target.value) && setCurrency(e.target.value)}
      className={`h-9 rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground ${className}`}
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>{LABELS[c]}</option>
      ))}
    </select>
  );
}
