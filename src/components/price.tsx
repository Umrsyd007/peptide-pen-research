import { useLocalPrice } from "@/lib/currency";

/** Shows a USD price converted to the visitor's local currency (approximate). */
export function Price({ usd, className }: { usd: number | string; className?: string }) {
  const { format } = useLocalPrice();
  const n = typeof usd === "string" ? parseFloat(usd.replace(/[^0-9.]/g, "")) : usd;
  if (!Number.isFinite(n)) return <span className={className}>{String(usd)}</span>;
  return <span className={className}>{format(n)}</span>;
}
