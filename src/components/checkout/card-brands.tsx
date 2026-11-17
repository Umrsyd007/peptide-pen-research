import { cn } from "@/lib/utils";

const BRANDS = [
  { b: "VISA", c: "border-border bg-background text-brand-visa" },
  { b: "Mastercard", c: "border-brand-mastercard/30 bg-background text-brand-mastercard" },
  { b: "AMEX", c: "border-brand-amex bg-brand-amex text-brand-on" },
  { b: "Apple Pay", c: "border-brand-apple bg-brand-apple text-brand-on" },
  { b: "G Pay", c: "border-border bg-background text-foreground" },
];

export function CardBrands({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-xs", className)}>
      <span className="text-muted-foreground">We accept:</span>
      {BRANDS.map(({ b, c }) => (
        <span key={b} className={cn("rounded-md border px-3 py-1.5 font-semibold", c)}>{b}</span>
      ))}
    </div>
  );
}
