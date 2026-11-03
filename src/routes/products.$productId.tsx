import { useEffect, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { SiteShell } from "@/components/site-shell";
import { useCartStore } from "@/stores/cart";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import { CURRENCY, PRODUCT_ID, PRODUCT_NAME, VARIANTS, formatGbp } from "@/lib/injector";
import injectorImg from "@/assets/injector-device.jpg";

const TITLE = `${PRODUCT_NAME} — Single £164 or 2-Pack £230 | PeptidePen`;
const DESCRIPTION =
  "Order the reusable needle-free injector. Comes with nozzles, adapters and a carry case. Free UK delivery in 3–7 days.";

export const Route = createFileRoute("/products/$productId")({
  validateSearch: z.object({ option: z.string().optional() }),
  loader: ({ params }) => {
    if (params.productId !== PRODUCT_ID) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://getpeptidepen.com/products/${PRODUCT_ID}` }],
  }),
  component: ProductPage,
});

const FEATURES = [
  "Needle-free delivery with a quick pulse",
  "Reusable device with single-use sterile nozzles",
  "Vial and ampoule adapters included",
  "Carry case and illustrated quick-start guide",
  "Free UK delivery, ships in 3–7 days",
];

function ProductPage() {
  const { option } = Route.useSearch();
  const [idx, setIdx] = useState(() => Math.max(0, VARIANTS.findIndex((v) => v.sku === option)));
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const selected = VARIANTS[idx];

  useEffect(() => {
    trackViewItem({ item_id: PRODUCT_ID, item_name: PRODUCT_NAME, item_variant: selected.name, price: selected.price, currency: CURRENCY });
  }, [selected]);

  const handleAdd = async () => {
    await addItem({
      variantId: `${PRODUCT_ID}:${selected.sku}`,
      productId: PRODUCT_ID,
      title: PRODUCT_NAME,
      variantTitle: selected.name,
      image: injectorImg,
      price: { amount: selected.price.toFixed(2), currencyCode: CURRENCY },
      quantity: qty,
    });
    trackAddToCart({ item_id: PRODUCT_ID, item_name: PRODUCT_NAME, item_variant: selected.name, price: selected.price, quantity: qty, currency: CURRENCY });
    toast.success(`Added to cart — ${PRODUCT_NAME}`, { description: selected.name });
  };

  return (
    <SiteShell>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid gap-10 lg:grid-cols-2 items-start">
        <div className="aspect-square rounded-3xl border border-border bg-card overflow-hidden lg:sticky lg:top-24">
          <img src={injectorImg} alt={PRODUCT_NAME} width={1024} height={1024} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-7">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">{PRODUCT_NAME}</h1>
            <p className="text-3xl font-black">{formatGbp(selected.price)}</p>
            <p className="text-muted-foreground">
              A reusable device that delivers with a quick, gentle pulse instead of a needle.
            </p>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Choose an option</legend>
            <div className="grid grid-cols-2 gap-3">
              {VARIANTS.map((v, i) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-pressed={i === idx}
                  className={`rounded-2xl border p-4 text-left transition-colors ${i === idx ? "border-primary bg-accent" : "border-border bg-card hover:border-foreground/40"}`}
                >
                  <span className="block font-black uppercase">{v.name}</span>
                  <span className="block text-lg font-black">{formatGbp(v.price)}</span>
                  <span className="block text-xs text-muted-foreground">{v.note}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border bg-card">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 text-lg">−</button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="h-12 w-12 text-lg">+</button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:bg-foreground hover:text-background transition-colors"
            >
              Add to cart — {formatGbp(selected.price * qty)}
            </button>
          </div>

          <ul className="space-y-2 border-t border-border pt-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3 text-sm">
                <span className="text-primary font-black">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
