import { useLocalPrice } from "@/lib/currency";

/** Shows a USD price converted to the visitor's local currency (approximate). */
export function Price({ usd, className }: { usd: number | string; className?: string }) {
  const { format } = useLocalPrice();
  const n = typeof usd === "string" ? parseFloat(usd.replace(/[^0-9.]/g, "")) : usd;
  if (!Number.isFinite(n)) return <span className={className}>{String(usd)}</span>;
  return <span className={className}>{format(n)}</span>;
}

/** Small note shown only when prices are converted from USD. */
export function LocalPriceNote() {
  const { converted, currency } = useLocalPrice();
  if (!converted) return null;
  return <p className="text-xs text-muted-foreground">Approximate price in {currency} at today's rate · charged in USD at checkout</p>;
}
