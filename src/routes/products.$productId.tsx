import { useEffect, useState } from "react";
import { createFileRoute, notFound, redirect, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { useCartStore } from "@/stores/cart";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import { CURRENCY, getInjectorProduct, formatGbp } from "@/lib/injector";
import injectorImg from "@/assets/injector-device.jpg";

// Pre-selected option is passed in navigation state (not the URL) so product
// URLs stay clean, e.g. /products/08f6ee52 rather than ?option=single.
declare module "@tanstack/react-router" {
  interface HistoryState {
    option?: string;
  }
}

export const Route = createFileRoute("/products/$productId")({
  beforeLoad: ({ search, params }) => {
    // Old links carried ?option=…; send them to the clean URL. Other params
    // (e.g. gclid/utm_*) are kept so ad attribution isn't lost.
    const s = search as Record<string, unknown>;
    if ("option" in s) {
      const { option: _drop, ...rest } = s;
      throw redirect({
        to: "/products/$productId",
        params,
        search: rest as never,
        statusCode: 301,
        replace: true,
      });
    }
  },
  loader: ({ params }) => {
    const product = getInjectorProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    const product = loaderData?.product;
    const title = product?.title ?? "Needle-Free Injector | PeptidePen";
    const description =
      product?.description ??
      "A reusable needle-free injector. Free UK delivery in 3–7 days.";
    const url = `https://getpeptidepen.com/products/${params.productId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
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
  const { product } = Route.useLoaderData();
  const option = useLocation({ select: (l) => l.state.option });
  const variants = product.variants;
  const [idx, setIdx] = useState(() => Math.max(0, variants.findIndex((v) => v.sku === option)));
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const selected = variants[idx];

  useEffect(() => {
    trackViewItem({ item_id: product.id, item_name: product.name, item_variant: selected.name, price: selected.price, currency: CURRENCY });
  }, [selected, product]);

  const handleAdd = async () => {
    await addItem({
      variantId: `${product.id}:${selected.sku}`,
      productId: product.id,
      title: product.name,
      variantTitle: selected.name,
      image: injectorImg,
      price: { amount: selected.price.toFixed(2), currencyCode: CURRENCY },
      quantity: qty,
    });
    trackAddToCart({ item_id: product.id, item_name: product.name, item_variant: selected.name, price: selected.price, quantity: qty, currency: CURRENCY });
    toast.success(`Added to cart — ${product.name}`, { description: selected.name });
  };

  return (
    <SiteShell>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid gap-10 lg:grid-cols-2 items-start">
        <div className="aspect-square rounded-3xl border border-border bg-card overflow-hidden lg:sticky lg:top-24">
          <img src={injectorImg} alt={product.name} width={1024} height={1024} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-7">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">{product.name}</h1>
            <p className="text-3xl font-black">{formatGbp(selected.price)}</p>
            <p className="text-muted-foreground">
              A reusable device that delivers with a quick, gentle pulse instead of a needle.
            </p>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Choose an option</legend>
            <div className="grid grid-cols-2 gap-3">
              {variants.map((v, i) => (
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
