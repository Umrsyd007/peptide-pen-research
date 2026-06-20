import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { getProduct, PRODUCTS } from "@/lib/products";
import { getDescription } from "@/lib/product-descriptions";
import { getVariants } from "@/lib/product-variants";
import { useShopifyCatalog, formatMoney, useShopifyImageForProduct } from "@/lib/shopify/catalog";
import { useCartStore } from "@/stores/cart";
import { CartDrawer } from "@/components/cart-drawer";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    const desc = p ? getDescription(p.id) : null;
    const title = p
      ? `${p.name} — ${desc?.tagline ? "Research Peptide Pen" : "Research Peptide Pen"}`
      : "Product — PeptidePen";
    const description = p && desc
      ? `${p.name}: ${desc.tagline} Pre-mixed pen, batch-matched COA. Research use only.`
      : "Research peptide pen with batch-matched COA. For research use only.";
    const url = `https://getpeptidepen.com/products/${params.productId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(p?.image ? [{ property: "og:image", content: `https://getpeptidepen.com${p.image}` }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.name,
                description,
                category: p.categories,
                image: p.image ? [`https://getpeptidepen.com${p.image}`] : undefined,
                url,
                brand: { "@type": "Brand", name: "PeptidePen" },
                offers: {
                  "@type": "Offer",
                  price: p.price.replace(/[^0-9.]/g, ""),
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url,
                },
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://getpeptidepen.com/" },
                  { "@type": "ListItem", position: 2, name: "Products", item: "https://getpeptidepen.com/products" },
                  { "@type": "ListItem", position: 3, name: p.name, item: url },
                ],
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-dvh flex items-center justify-center p-6 text-center">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="text-sm text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link to="/products" className="inline-block text-sm underline">
          Back to all products
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-dvh flex items-center justify-center p-6 text-center">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <button type="button" onClick={reset} className="text-sm underline">
          Try again
        </button>
      </div>
    </div>
  ),
  component: ProductDetailPage,
});

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "accent" | "success" }) {
  const tones = {
    default: "border-border bg-muted/40 text-muted-foreground",
    accent: "border-primary/40 bg-primary/10 text-primary",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] px-2.5 py-1 border rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link to="/" aria-label="PeptidePen home" className="flex items-center gap-2 shrink-0">
          <span className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">P</span>
          <span className="text-base sm:text-lg font-bold tracking-tight">PeptidePen</span>
        </Link>
        <nav className="hidden md:flex gap-7 text-sm" aria-label="Primary">
          <Link to="/products" className="text-foreground font-medium">Products</Link>
          {[["How it Works","how-it-works"],["Research","research"],["FAQ","faq"],["Contact","contact"]].map(([n,h]) => (
            <a key={h} href={`/#${h}`} className="text-muted-foreground hover:text-foreground transition-colors">{n}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#buy-box" className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            Order
          </a>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const desc = getDescription(product.id);
  const variants = getVariants(product.id);
  const defaultIdx = Math.max(0, variants.findIndex((v) => v.isDefault));
  const [variantIdx, setVariantIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx);
  const [qty, setQty] = useState(1);
  const selected = variants[variantIdx];
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  // Live Shopify data, mapped by SKU
  const catalog = useShopifyCatalog();
  const shopifyVariant = selected?.sku
    ? catalog.data?.get(selected.sku.trim())
    : undefined;

  const displayPrice = shopifyVariant
    ? formatMoney(shopifyVariant.price.amount, shopifyVariant.price.currencyCode)
    : (selected?.price ?? product.price);
  const displayPriceNum = shopifyVariant
    ? parseFloat(shopifyVariant.price.amount)
    : (selected?.priceNum ?? parseFloat(product.price.replace(/[^0-9.]/g, "")));
  const compareAt = shopifyVariant?.compareAtPrice
    ? formatMoney(
        shopifyVariant.compareAtPrice.amount,
        shopifyVariant.compareAtPrice.currencyCode,
      )
    : selected?.oldPrice;
  const inStock = shopifyVariant ? shopifyVariant.availableForSale : true;

  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);

  const handleAddToCart = async () => {
    if (!shopifyVariant) {
      toast.error("This product is loading from our store. Please try again in a moment.");
      return;
    }
    if (!inStock) {
      toast.error("This variant is currently out of stock.");
      return;
    }
    await addItem({
      variantId: shopifyVariant.id,
      productId: product.id,
      productHandle: shopifyVariant.productHandle,
      title: product.name,
      variantTitle: selected?.name ?? shopifyVariant.title,
      image: shopifyVariant.productImage ?? product.image,
      price: shopifyVariant.price,
      quantity: qty,
    });
    toast.success(`Added to cart — ${product.name}`, {
      description: selected?.name && selected.name !== "Default" ? selected.name : undefined,
    });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans">

      <Header />

      {/* Trust bar */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] text-muted-foreground">
          <span>✓ Third-party assayed</span>
          <span>✓ Cold-chain shipping</span>
          <span>✓ Batch-matched COA</span>
          <span>✓ Research grade only</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10" role="main">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* HERO */}
        <section aria-labelledby="product-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl border border-border bg-gradient-to-br from-muted/60 via-muted/30 to-background overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.2),transparent_60%)]" aria-hidden />
              <img
                src={product.image}
                alt={`${product.name} research pen`}
                className="relative w-full h-full object-contain p-8 sm:p-12"
              />
              {product.tag && (
                <div className="absolute top-4 left-4">
                  <Pill tone="accent">{product.tag}</Pill>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center hover:border-primary/40 transition-colors cursor-pointer">
                  <img src={product.image} alt="" aria-hidden="true" className="w-full h-full object-contain p-2 opacity-70" />
                </div>
              ))}
            </div>
          </div>

          {/* Sticky buy box */}
          <div id="buy-box" className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {inStock ? (
                  <Pill tone="success">In stock</Pill>
                ) : (
                  <Pill>Out of stock</Pill>
                )}
                <Pill>Research use only</Pill>
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{product.categories}</p>
              <h1 id="product-heading" className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight">
                {product.name}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">{desc.tagline}</p>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-bold">{displayPrice}</span>
                {compareAt ? (
                  <span className="text-sm text-muted-foreground line-through">{compareAt}</span>
                ) : (
                  <span className="text-sm text-muted-foreground line-through">${(displayPriceNum * 1.25).toFixed(2)}</span>
                )}
                <Pill tone="accent">Save 20%</Pill>
              </div>

              {/* Variant selector */}
              {variants.length > 0 && (
                <fieldset className="space-y-2 pt-2">
                  <legend className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {variants.length > 1 ? "Pen size" : "Size"}
                  </legend>
                  <div className={`grid gap-2 ${variants.length >= 3 ? "grid-cols-3" : variants.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {variants.map((v, i) => {
                      const active = i === variantIdx;
                      const liveV = v.sku ? catalog.data?.get(v.sku.trim()) : undefined;
                      const livePrice = liveV
                        ? formatMoney(liveV.price.amount, liveV.price.currencyCode)
                        : v.price;
                      return (
                        <label
                          key={v.sku || v.name}
                          className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm transition ${active ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border hover:border-foreground/40 text-muted-foreground"}`}
                        >
                          <input
                            type="radio"
                            name="variant"
                            checked={active}
                            onChange={() => setVariantIdx(i)}
                            className="sr-only"
                          />
                          <span className="block">{v.name}</span>
                          <span className={`block text-[11px] mt-0.5 ${active ? "text-primary" : "text-muted-foreground/80"}`}>{livePrice}</span>
                        </label>
                      );
                    })}
                  </div>
                  {selected?.pensRequired && (
                    <p className="text-[11px] text-muted-foreground pt-1">{selected.pensRequired}{selected.penLastsDays ? ` · 1 pen lasts ~${selected.penLastsDays} days` : ""}</p>
                  )}
                </fieldset>
              )}

              {/* Qty + CTA */}
              <div className="flex gap-3 pt-2">
                <div className="flex items-center border border-border rounded-lg h-12 px-2">
                  <button
                    type="button"
                    className="h-8 w-8 grid place-items-center text-lg text-muted-foreground hover:text-foreground"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button
                    type="button"
                    className="h-8 w-8 grid place-items-center text-lg text-muted-foreground hover:text-foreground"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={cartLoading || (!catalog.isLoading && !shopifyVariant) || !inStock}
                  className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartLoading
                    ? "Adding…"
                    : !inStock
                      ? "Out of stock"
                      : `Add to cart — ${displayPrice}`}
                </button>
              </div>
              {!catalog.isLoading && !shopifyVariant && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  This variant isn't available for purchase right now. Please <a href="mailto:hello@getpeptidepen.com" className="underline">contact us</a> to order.
                </p>
              )}

              {/* Dosage details */}
              {(selected?.dailyDosage || selected?.courseDetails) && (
                <dl className="space-y-2 text-xs pt-3 border-t border-border">
                  {selected.dailyDosage && (
                    <div>
                      <dt className="uppercase tracking-wider text-muted-foreground mb-0.5">Suggested research dosage</dt>
                      <dd className="text-foreground/80 leading-relaxed">{selected.dailyDosage}</dd>
                    </div>
                  )}
                  {selected.courseDetails && (
                    <div>
                      <dt className="uppercase tracking-wider text-muted-foreground mb-0.5">Course</dt>
                      <dd className="text-foreground/80 leading-relaxed">{selected.courseDetails}</dd>
                    </div>
                  )}
                </dl>
              )}


              {/* Trust strip */}
              <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-muted-foreground pt-3 border-t border-border list-none">
                <li className="flex items-center gap-1.5">✓ ≥99% purity (HPLC)</li>
                <li className="flex items-center gap-1.5">✓ Batch-matched COA</li>
                <li className="flex items-center gap-1.5">✓ Cold-chain 2–8°C</li>
                <li className="flex items-center gap-1.5">✓ Tracked delivery</li>
                <li className="flex items-center gap-1.5">✓ Tamper-evident</li>
                <li className="flex items-center gap-1.5">✓ EU + US shipping</li>
              </ul>
            </div>
          </div>
        </section>

        {/* WHAT IT IS */}
        <section aria-labelledby="what-heading" className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-3">
            <Pill>Overview</Pill>
            <h2 id="what-heading" className="text-3xl font-semibold tracking-tight">
              What is {product.name}?
            </h2>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <p className="text-base text-foreground/90 leading-relaxed">{desc.whatIs}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each PeptidePen is filled in a controlled cleanroom and sealed with tamper-evident packaging. Batch documentation includes
              identity confirmation, HPLC purity analysis and concentration verification. Strictly for in-vitro research — not for human
              or veterinary use.
            </p>
          </div>
        </section>

        {/* DEEP DIVE / RESEARCH LIBRARY */}
        {desc.deepDive && desc.deepDive.length > 0 && (
          <section aria-labelledby="research-heading" className="mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-8">
              <div className="space-y-3">
                <Pill tone="accent">Research library</Pill>
                <h2 id="research-heading" className="text-3xl font-semibold tracking-tight">
                  Go deeper on {product.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A full breakdown of mechanism, clinical findings, dosing references and safety signals — for researchers who want the complete picture.
                </p>
              </div>

              <div className="lg:col-span-2">
                {(() => {
                  const [first, ...rest] = desc.deepDive!;
                  const firstBody = Array.isArray(first.body) ? first.body : [first.body];
                  const [firstPara, ...restFirstParas] = firstBody;
                  return (
                    <div className="space-y-6">
                      {/* Always-visible: first heading + first paragraph */}
                      <article className="space-y-3">
                        <h3 className="text-xl font-semibold tracking-tight">{first.heading}</h3>
                        <p className="text-sm text-foreground/85 leading-relaxed">{firstPara}</p>
                      </article>

                      <details className="group [&_summary]:list-none">
                        <summary className="cursor-pointer select-none">
                          <span className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-border bg-card hover:bg-muted/50 transition text-sm font-medium group-open:hidden">
                            Continue reading the full research brief
                            <span className="text-muted-foreground">↓</span>
                          </span>
                        </summary>

                        <div className="mt-6 space-y-8">
                          {restFirstParas.length > 0 && (
                            <article className="space-y-3">
                              {restFirstParas.map((p, i) => (
                                <p key={i} className="text-sm text-foreground/85 leading-relaxed">{p}</p>
                              ))}
                            </article>
                          )}
                          {rest.map((s) => (
                            <article key={s.heading} className="space-y-3">
                              <h3 className="text-xl font-semibold tracking-tight">{s.heading}</h3>
                              {(Array.isArray(s.body) ? s.body : [s.body]).map((p, i) => (
                                <p key={i} className="text-sm text-foreground/85 leading-relaxed">{p}</p>
                              ))}
                            </article>
                          ))}
                        </div>
                      </details>
                    </div>
                  );
                })()}
              </div>



            </div>
          </section>
        )}


        {/* BENEFITS GRID */}
        <section aria-labelledby="benefits-heading" className="mt-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div className="space-y-3">
              <Pill tone="accent">Research highlights</Pill>
              <h2 id="benefits-heading" className="text-3xl font-semibold tracking-tight">
                Why researchers choose {product.name}
              </h2>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
            {desc.benefits.map((b, i) => (
              <li key={i} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-sm font-semibold mb-3">{String(i + 1).padStart(2, "0")}</div>
                <p className="text-sm text-foreground/90 leading-relaxed">{b}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* MECHANISM + PROTOCOL */}
        {(desc.mechanism || desc.protocol) && (
          <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            {desc.mechanism && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <Pill>Mechanism</Pill>
                <h3 className="text-xl font-semibold">How it works</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc.mechanism}</p>
              </div>
            )}
            {desc.protocol && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <Pill>Research protocol</Pill>
                <h3 className="text-xl font-semibold">Typical dosing reference</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc.protocol}</p>
                <p className="text-[11px] text-muted-foreground/80 italic">For in-vitro research design reference only.</p>
              </div>
            )}
          </section>
        )}

        {/* SPECS STRIP */}
        <section aria-labelledby="specs-heading" className="mt-20">
          <Pill>Specifications</Pill>
          <h2 id="specs-heading" className="sr-only">Specifications</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {[
              ["Form", "Pre-mixed pen"],
              ["Purity", "≥99% HPLC"],
              ["Storage", "2–8°C"],
              ["Shipping", "Cold-chain"],
              ["COA", "Batch-matched"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="text-sm font-medium mt-1">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STACKS WITH */}
        {desc.stacksWith && desc.stacksWith.length > 0 && (
          <section className="mt-20 space-y-4">
            <Pill tone="accent">Stacks well with</Pill>
            <h2 className="text-3xl font-semibold tracking-tight">Researchers often pair this with</h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {desc.stacksWith.map((s) => (
                <span key={s} className="inline-flex items-center px-4 py-2 rounded-full border border-border bg-muted/40 text-sm">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* SIDE EFFECTS */}
        {desc.sideEffects && desc.sideEffects.length > 0 && (
          <section className="mt-20 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
            <Pill>Reported in research</Pill>
            <h3 className="text-xl font-semibold">Known side-effect signals</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-foreground/80 list-disc list-inside">
              {desc.sideEffects.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}

        {/* HOW IT WORKS / FULFILLMENT */}
        <section aria-labelledby="fulfillment-heading" className="mt-20 space-y-6">
          <Pill>From order to lab bench</Pill>
          <h2 id="fulfillment-heading" className="text-3xl font-semibold tracking-tight">Built for trust at every step</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0">
            {[
              { n: "01", t: "Place your order", s: "Select pen size and shipping region at checkout." },
              { n: "02", t: "Verify the COA", s: "Each batch is HPLC-assayed and documented." },
              { n: "03", t: "Cold-chain ships", s: "Insulated, temperature-logged delivery." },
              { n: "04", t: "Run your protocol", s: "Reference dosing and references included." },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="text-xs font-mono text-primary">{s.n}</div>
                <h3 className="text-sm font-semibold">{s.t}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.s}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-3">
            <Pill>FAQ</Pill>
            <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
            <p className="text-sm text-muted-foreground">Common questions about {product.name} and PeptidePen orders.</p>
          </div>
          <div className="lg:col-span-2 space-y-2">
            {[
              { q: `Is ${product.name} for human use?`, a: "No. All PeptidePen products are strictly for in-vitro laboratory research. Not intended for human or veterinary use." },
              { q: "How is the COA provided?", a: "Each pen ships with a batch-matched certificate of analysis. A digital copy is also available on request via your order confirmation." },
              { q: "How is shipping handled?", a: "Orders ship cold-chain (2–8°C) with insulated packaging, ice packs and a temperature log. Tracked delivery in the US and EU." },
              { q: "Can I order in bulk for my lab?", a: "Yes. Contact our team for institutional pricing, custom concentrations and recurring shipments." },
              { q: "What's your refund policy?", a: "Damaged or off-spec pens are replaced free of charge. Contact support within 7 days of delivery." },
            ].map((f) => (
              <details key={f.q} className="group border border-border rounded-xl bg-card open:bg-muted/30 transition">
                <summary className="list-none cursor-pointer flex items-center justify-between px-5 py-4 text-sm font-medium">
                  {f.q}
                  <span className="text-muted-foreground text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="mt-20 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-2xl mx-auto">
            Ready to run {product.name} in your next study?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Pre-mixed, batch-assayed, cold-chain shipped — order before 2pm for same-day dispatch.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a href="#buy-box" className="inline-flex items-center h-11 px-6 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
              Order now — {displayPrice}
            </a>
            <Link to="/products" className="inline-flex items-center h-11 px-6 rounded-full border border-border hover:bg-muted/50 transition text-sm font-medium">
              Browse all products
            </Link>
          </div>
        </section>

        {/* RELATED */}
        <section aria-labelledby="related-heading" className="mt-20 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-3">
              <Pill>Related</Pill>
              <h2 id="related-heading" className="text-3xl font-semibold tracking-tight">Researchers also ordered</h2>
            </div>
            <Link to="/products" className="text-sm underline shrink-0 text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link key={r.id} to="/products/$productId" params={{ productId: r.id }} className="block space-y-3 group rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition">
                <div className="aspect-square rounded-xl bg-muted/50 overflow-hidden flex items-center justify-center">
                  <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.categories.split("•")[0]?.trim()}</p>
                  <p className="text-sm font-medium group-hover:underline">{r.name}</p>
                  <p className="text-sm font-semibold">{r.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-20 py-10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-muted-foreground text-center space-y-2">
          <p className="font-medium text-foreground">PeptidePen</p>
          <p>© {new Date().getFullYear()} PeptidePen — Research use only. Not for human or veterinary consumption.</p>
        </div>
      </footer>
    </div>
  );
}
