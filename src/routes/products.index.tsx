import { Price, CurrencyPicker } from "@/components/price";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PRODUCTS, type Product, type Tag } from "@/lib/products";
import { getDefaultVariant } from "@/lib/product-variants";
import { CartDrawer } from "@/components/cart-drawer";

const BRAND = "PeptidePen";
const PAGE_TITLE = "All Peptide Pens & Protocols | PeptidePen";
const PAGE_DESCRIPTION =
  "Browse the full catalog of lab-tested research peptide pens, longevity stacks, and wellness protocols. Batch-matched COAs, cold-chain shipping, dosing references. For in-vitro research use only.";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: "https://getpeptidepen.com/products" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/products" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Research Peptides Catalog",
          numberOfItems: PRODUCTS.length,
          itemListElement: PRODUCTS.slice(0, 20).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://getpeptidepen.com/products/${p.id}`,
            name: p.name,
          })),
        }),
      },
    ],
  }),
  component: ProductsPage,
});

const NAV_LINKS = [
  { label: "Offers", href: "/#offers" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Science", href: "/#science" },
  { label: "FAQ", href: "/#faq" },
];

const CATEGORIES = [
  "All",
  "Metabolic & Fat Optimization",
  "Muscle & Recovery",
  "Cellular Longevity",
  "Cognitive & Neuro",
  "Aesthetics & Regenerative",
  "Hormonal & Reproductive",
  "Immune & Inflammation",
] as const;

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

function parsePrice(p: string) {
  return Number(p.replace(/[^0-9.]/g, "")) || 0;
}

function TagBadge({ tag }: { tag: Tag }) {
  if (!tag) return null;
  const cls =
    tag === "NEW"
      ? "bg-primary text-primary-foreground"
      : "bg-foreground text-background";
  return (
    <span
      className={`absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${cls}`}
    >
      {tag}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const livePrice = getDefaultVariant(product.id)?.price ?? product.price;
  const imageSrc = product.image;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/40 hover:shadow-[var(--shadow-glow)] transition-all">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        aria-label={`View details for ${product.name}`}
        className="relative aspect-square bg-muted/50 flex items-center justify-center border-b border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden"
      >
        <TagBadge tag={product.tag} />
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity">
          View ↗
        </span>
      </Link>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground line-clamp-1">
          {product.categories}
        </p>
        <h2 className="text-base font-bold text-foreground leading-tight">
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="hover:text-primary transition-colors focus:outline-none focus-visible:underline"
          >
            {product.name}
          </Link>
        </h2>
        <div className="flex items-end justify-between gap-3 mt-auto pt-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              From
            </p>
            <p className="text-xl font-black text-foreground"><Price gbp={livePrice} /></p>
          </div>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="inline-flex h-10 px-4 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
          >
            Order
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProductsPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();
    if (category !== "All") {
      list = list.filter((p) =>
        p.categories.toLowerCase().includes(category.toLowerCase()),
      );
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categories.toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-desc":
        list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default: {
        const rank = (t: Tag) => (t === "BESTSELLER" ? 0 : t === "NEW" ? 1 : 2);
        list.sort((a, b) => rank(a.tag) - rank(b.tag));
      }
    }
    return list;
  }, [category, query, sort]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Promo strip */}
      <div className="bg-foreground text-background text-[11px] font-medium tracking-wider uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          BOGO + 25% OFF Sitewide · Code{" "}
          <span className="text-primary font-bold">MEM25</span> · Free worldwide shipping
        </div>
      </div>

      {/* Nav */}
      <header
        className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" aria-label={`${BRAND} home`} className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#EF2A2A] text-white font-bold text-lg shrink-0">P</span>
            <span className="text-base sm:text-lg font-black tracking-tight uppercase">
              {BRAND}
            </span>
          </Link>
          <nav
            className="hidden md:flex gap-1 items-center rounded-full border border-border bg-card px-2 py-1"
            aria-label="Primary"
          >
            <Link
              to="/products"
              className="px-4 py-2 text-sm font-bold rounded-full bg-foreground text-background"
            >
              Products
            </Link>
            {NAV_LINKS.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="px-4 py-2 text-sm font-medium rounded-full hover:bg-muted transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="mailto:hello@getpeptidepen.com"
              className="hidden sm:inline-flex h-10 px-5 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
            >
              Contact ↗
            </a>
            <CurrencyPicker />
            <CartDrawer />
            <details className="md:hidden relative">
              <summary
                className="list-none cursor-pointer inline-flex items-center justify-center h-11 w-11 rounded-full border border-border bg-card"
                aria-label="Open menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </summary>
              <nav
                aria-label="Mobile primary"
                className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl border border-border bg-background shadow-lg p-2 flex flex-col"
              >
                <Link to="/products" className="px-3 py-2 text-sm rounded-md hover:bg-muted">
                  Products
                </Link>
                {NAV_LINKS.map((n) => (
                  <a key={n.label} href={n.href} className="px-3 py-2 text-sm rounded-md hover:bg-muted">
                    {n.label}
                  </a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main role="main">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border" aria-labelledby="catalog-heading">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,_currentColor_1px,_transparent_1px),linear-gradient(to_bottom,_currentColor_1px,_transparent_1px)] [background-size:40px_40px]"
          />
          <div
            aria-hidden
            className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-25 bg-[image:var(--gradient-flame)]"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-6">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <span className="mx-2 opacity-50">/</span>
              <span className="text-foreground">Catalog</span>
            </nav>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {PRODUCTS.length} Compounds Available
                </span>
                <h1
                  id="catalog-heading"
                  className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]"
                >
                  The Full{" "}
                  <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">
                    Catalog.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Lab-tested research peptide pens, longevity stacks, and wellness protocols — all batch-matched to a third-party COA and cold-chain shipped.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 lg:gap-4 shrink-0">
                {[
                  { k: "COA", v: "Every batch" },
                  { k: "Ship", v: "Same-day" },
                  { k: "Purity", v: "≥ 99%" },
                ].map((s) => (
                  <div key={s.k} className="rounded-2xl border border-border bg-card p-4 text-center min-w-[96px]">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary">
                      {s.k}
                    </p>
                    <p className="text-sm font-black mt-1">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="sticky top-[57px] z-30 border-b border-border bg-background/90 backdrop-blur" aria-label="Filters">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ⌕
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search peptides, protocols…"
                  aria-label="Search products"
                  className="w-full h-11 pl-10 pr-4 rounded-full border border-border bg-card text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <label className="inline-flex items-center gap-2 rounded-full border border-border bg-card pl-4 pr-1 h-11">
                <span className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
                  Sort
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort products"
                  className="h-9 bg-transparent text-sm font-semibold px-2 rounded-full focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name">Name: A → Z</option>
                </select>
              </label>
              <p className="ml-auto text-xs text-muted-foreground font-medium">
                {filtered.length} of {PRODUCTS.length}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={active}
                    className={`shrink-0 inline-flex items-center h-9 px-4 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* GRID */}
        <section
          aria-label="Product catalog"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
        >
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center space-y-3">
              <p className="text-2xl font-black uppercase tracking-tight">No matches</p>
              <p className="text-sm text-muted-foreground">
                Try a different category or clear your search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                }}
                className="inline-flex h-11 px-5 items-center rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Note:</strong> Prices are in pounds (GBP);
            use the currency menu to view and pay in USD or EUR.
            For in-vitro research use only — not for human or veterinary consumption.
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="relative rounded-3xl bg-foreground text-background p-10 md:p-14 overflow-hidden">
            <div aria-hidden className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_oklch(0.62_0.24_25/_0.6),_transparent_60%)]" />
            <div aria-hidden className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,_white_1px,_transparent_1px),linear-gradient(to_bottom,_white_1px,_transparent_1px)] [background-size:40px_40px]" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Custom Protocols
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                  Can't find it? <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">We'll source it.</span>
                </h2>
                <p className="text-sm text-background/70">
                  Bulk lab pricing, custom blends, and white-label COAs available on request.
                </p>
              </div>
              <a
                href="mailto:hello@getpeptidepen.com"
                className="inline-flex h-14 px-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:bg-background hover:text-foreground transition-colors shrink-0"
              >
                Talk to Research Team ↗
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-black text-sm">
              P
            </span>
            <span className="text-base font-black tracking-tight uppercase">PeptidePen</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-background/60">
            <Link to="/contact" className="hover:text-background transition-colors">Contact</Link>
            <span className="hidden sm:inline opacity-30">|</span>
            <Link to="/refund-policy" className="hover:text-background transition-colors">Refund Policy</Link>
            <span className="hidden sm:inline opacity-30">|</span>
            <Link to="/terms-of-service" className="hover:text-background transition-colors">Terms of Service</Link>
          </div>
          <p className="text-[11px] text-background/60 text-center max-w-xl">
            <strong className="text-background">Research Use Only.</strong> Products are
            supplied strictly for in-vitro laboratory research and are not for human or veterinary use.
          </p>
          <p className="text-xs text-background/60">
            © {new Date().getFullYear()} {BRAND}
          </p>
        </div>
      </footer>
    </div>
  );
}
