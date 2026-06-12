import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";

const BRAND = "Peptide Pen Research";
const TAGLINE = "Lab-grade peptide pens, engineered for serious research.";
const PAGE_TITLE = `${BRAND} | Research-Grade Peptide Pens`;
const PAGE_DESCRIPTION =
  "Pre-mixed, lab-tested research peptide pens with full COA documentation, cold-chain shipping and dosing references. For in-vitro laboratory use only.";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: "https://getpeptidepen.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND,
          description: PAGE_DESCRIPTION,
          url: "https://getpeptidepen.com/",
        }),
      },
    ],
  }),
});

function Pill({ children, dot = true }: { children: React.ReactNode; dot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
      {children}
    </span>
  );
}

const NAV_LINKS = [
  { label: "Offers", href: "#offers" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Science", href: "#science" },
  { label: "FAQ", href: "#faq" },
];

function HomePage() {
  const featured = PRODUCTS.filter((p) => p.tag === "BESTSELLER").slice(0, 3);
  const newDrops = PRODUCTS.filter((p) => p.tag === "NEW").slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:border">
        Skip to main content
      </a>

      {/* Promo strip */}
      <div className="bg-foreground text-background text-[11px] font-medium tracking-wider uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          BOGO + 25% OFF Sitewide · Code <span className="text-primary font-bold">MEM25</span> · Same-day shipping
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" aria-label={`${BRAND} home`} className="flex items-center gap-2 shrink-0">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-black text-sm">P</span>
            <span className="text-base sm:text-lg font-black tracking-tight uppercase">PeptidePen</span>
          </Link>
          <nav className="hidden md:flex gap-1 items-center rounded-full border border-border bg-card px-2 py-1" aria-label="Primary">
            <Link to="/products" className="px-4 py-2 text-sm font-medium rounded-full hover:bg-muted transition-colors">
              Products
            </Link>
            {NAV_LINKS.map((n) => (
              <a key={n.label} href={n.href} className="px-4 py-2 text-sm font-medium rounded-full hover:bg-muted transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> BOGO + 25%
            </span>
            <Link
              to="/products"
              className="hidden sm:inline-flex h-10 px-5 items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Shop Now <span aria-hidden>↗</span>
            </Link>
            <details className="md:hidden relative">
              <summary className="list-none cursor-pointer inline-flex items-center justify-center h-11 w-11 rounded-full border border-border bg-card" aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </summary>
              <nav aria-label="Mobile primary" className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl border border-border bg-background shadow-lg p-2 flex flex-col">
                <Link to="/products" className="px-3 py-2 text-sm rounded-md hover:bg-muted">Products</Link>
                {NAV_LINKS.map((n) => (
                  <a key={n.label} href={n.href} className="px-3 py-2 text-sm rounded-md hover:bg-muted">{n.label}</a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="main" role="main">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border" aria-labelledby="hero-heading">
          {/* Background watermark */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[28vw] font-black text-foreground/[0.03] leading-none tracking-tighter select-none">BOGO</span>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            <div className="space-y-7">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>BOGO + 25% OFF</Pill>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold">
                  <span className="text-primary">★★★★★</span>
                  <span className="font-bold">4.9</span>
                  <span className="text-muted-foreground">/ 2,400+ reviews</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                  ✓ COA VERIFIED
                </span>
              </div>

              <h1 id="hero-heading" className="font-black uppercase leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Buy One Get<br />
                One{" "}
                <span className="relative inline-block bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">
                  Free.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" aria-hidden>
                    <path d="M2 8 Q 100 -2, 198 8" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="g" x1="0" x2="1">
                        <stop offset="0" stopColor="oklch(0.62 0.24 25)" />
                        <stop offset="1" stopColor="oklch(0.74 0.2 60)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                Buy one get one free on select research peptides. Everything else is 25% off with code <strong className="text-foreground">MEM25</strong>. Third-party tested, COA-verified, cold-chain shipped.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="group inline-flex h-14 px-7 items-center justify-center gap-2 rounded-full bg-foreground text-background font-bold uppercase tracking-wider text-sm shadow-[var(--shadow-glow)] hover:bg-primary transition-all"
                >
                  Shop Now <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-14 px-7 items-center justify-center gap-2 rounded-full border-2 border-foreground bg-background text-foreground font-bold uppercase tracking-wider text-sm hover:bg-muted transition-colors"
                >
                  How It Works <span aria-hidden>↓</span>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div>
                  <p className="text-2xl sm:text-3xl font-black">99.8%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Avg. Purity</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black">72.5K+</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Researchers</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black uppercase">Same Day</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Ship Time</p>
                </div>
              </div>
            </div>

            {/* Promo card */}
            <aside id="offers" className="rounded-3xl border border-border bg-card shadow-[var(--shadow-glow)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/60">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Limited Time Promo
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">⏱ Limited Time</span>
              </div>
              <div className="relative bg-foreground text-background p-8 sm:p-10 text-center overflow-hidden">
                <div aria-hidden className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.62_0.24_25/_0.6),_transparent_60%)]" />
                <div aria-hidden className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,_white_1px,_transparent_1px),linear-gradient(to_bottom,_white_1px,_transparent_1px)] [background-size:32px_32px]" />
                <p className="relative text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Select Products</p>
                <p className="relative text-3xl sm:text-5xl font-black uppercase mt-2">
                  Buy 1 Get 1 <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">Free</span>
                </p>
                <p className="relative text-xs sm:text-sm uppercase tracking-wider mt-3 text-background/80">+ 25% off everything else with code</p>
              </div>
              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground text-xl">🎁</div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Sitewide Discount Code</p>
                    <p className="text-2xl font-black">
                      <span className="text-primary">25% OFF</span> EVERYTHING
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Use code at checkout for 25% off your entire order (non-BOGO items).</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Code</span>
                  <span className="font-mono text-lg font-black tracking-widest">MEM25</span>
                  <button
                    type="button"
                    onClick={(e) => { navigator.clipboard?.writeText("MEM25"); (e.currentTarget as HTMLButtonElement).textContent = "Copied"; }}
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-foreground text-background hover:bg-primary transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                  {[
                    { i: "🎁", t: "BOGO on select" },
                    { i: "🛡", t: "3rd-party tested" },
                    { i: "🚚", t: "Same-day ship" },
                  ].map((b) => (
                    <div key={b.t} className="space-y-1">
                      <div className="text-primary text-base">{b.i}</div>
                      <p className="text-[11px] font-medium">{b.t}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/products"
                  className="flex h-14 items-center justify-center gap-2 rounded-full bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-primary transition-colors"
                >
                  ✦ Shop Now ↗
                </Link>
                <p className="text-[11px] text-center text-muted-foreground">Secure checkout · Discreet shipping · Same-day (before 1PM EST)</p>
              </div>
            </aside>
          </div>
        </section>

        {/* TRUST MARQUEE */}
        <section className="border-b border-border bg-foreground text-background overflow-hidden" aria-label="Trust signals">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-bold uppercase tracking-[0.25em]">
            <span>✓ HPLC ≥ 99% Purity</span>
            <span className="text-primary">•</span>
            <span>✓ Batch-Matched COA</span>
            <span className="text-primary">•</span>
            <span>✓ Cold-Chain 2–8°C</span>
            <span className="text-primary">•</span>
            <span>✓ Same-Day Shipping</span>
            <span className="text-primary">•</span>
            <span>✓ Researcher Support</span>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24" aria-labelledby="products-heading">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div className="space-y-3 max-w-2xl">
              <Pill>Featured Catalog</Pill>
              <h2 id="products-heading" className="text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight">
                The Pens Our Labs<br /><span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">Reorder Most</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                A curated slice of our research peptide range — every pen ships with a batch-matched certificate of analysis.
              </p>
            </div>
            <Link to="/products" className="hidden md:inline-flex h-12 px-5 items-center gap-2 rounded-full border-2 border-foreground bg-background text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors">
              View All ↗
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => (
              <article key={p.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 transition-all flex flex-col">
                <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  ★ Bestseller
                </span>
                <Link to="/products/$productId" params={{ productId: p.id }} className="block aspect-square bg-muted overflow-hidden" aria-label={`View ${p.name}`}>
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" />
                </Link>
                <div className="p-5 space-y-2 flex-1 flex flex-col border-t border-border">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold line-clamp-1">{p.categories}</p>
                  <h3 className="text-base font-black uppercase">
                    <Link to="/products/$productId" params={{ productId: p.id }} className="hover:text-primary transition-colors">{p.name}</Link>
                  </h3>
                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <p className="text-xl font-black">{p.price}</p>
                    <Link to="/products/$productId" params={{ productId: p.id }} className="inline-flex h-10 px-4 items-center gap-1 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors">
                      View ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="md:hidden mt-8 text-center">
            <Link to="/products" className="inline-flex h-12 px-6 items-center gap-2 rounded-full border-2 border-foreground text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors">
              View All Products ↗
            </Link>
          </div>
        </section>

        {/* NEW SECTION 1: NEW DROPS */}
        <section className="bg-foreground text-background border-y border-border" aria-labelledby="new-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div className="space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Just Dropped
                </span>
                <h2 id="new-heading" className="text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight">
                  Fresh from the <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">Lab.</span>
                </h2>
                <p className="text-sm text-background/70">Newest research peptides added to the catalog this month — limited initial batches.</p>
              </div>
              <Link to="/products" className="hidden md:inline-flex h-12 px-5 items-center gap-2 rounded-full border-2 border-background bg-transparent text-background text-sm font-bold uppercase tracking-wider hover:bg-background hover:text-foreground transition-colors">
                Shop New ↗
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {newDrops.map((p) => (
                <Link key={p.id} to="/products/$productId" params={{ productId: p.id }} className="group rounded-2xl border border-background/15 bg-background/5 overflow-hidden hover:bg-background hover:text-foreground transition-colors">
                  <div className="aspect-square overflow-hidden bg-background/5 group-hover:bg-muted">
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="inline-block text-[9px] uppercase tracking-widest font-bold text-primary">New</span>
                    <h3 className="text-sm font-black uppercase line-clamp-2">{p.name}</h3>
                    <p className="text-sm font-bold">{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-12" aria-labelledby="how-heading">
          <div className="space-y-3 max-w-2xl">
            <Pill>How it Works</Pill>
            <h2 id="how-heading" className="text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight">
              Warehouse to<br />Lab Bench in <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">4 Steps.</span>
            </h2>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0">
            {[
              { n: "01", t: "Browse", s: "Filter by research area, peptide and pen size." },
              { n: "02", t: "Verify COA", s: "Download the batch-matched lab report before you buy." },
              { n: "03", t: "Cold-Chain Ship", s: "Insulated, tracked, 2–3 day delivery in supported regions." },
              { n: "04", t: "Run Protocol", s: "Use our dosing references and researcher support team." },
            ].map((s) => (
              <li key={s.n} className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors">
                <span className="text-5xl font-black text-muted-foreground/30 group-hover:text-primary transition-colors">{s.n}</span>
                <h3 className="text-lg font-black uppercase mt-3">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.s}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* SCIENCE */}
        <section id="science" className="border-y border-border bg-muted/30" aria-labelledby="science-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="aspect-square w-full rounded-3xl bg-card border border-border overflow-hidden flex items-center justify-center shadow-[var(--shadow-glow)]">
              <img src={PRODUCTS[1].image} alt="Lab-tested research peptide" className="w-full h-full object-contain p-10" loading="lazy" />
            </div>
            <div className="space-y-6">
              <Pill>The Science</Pill>
              <h2 id="science-heading" className="text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight">
                Documentation that<br />Survives <span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">Peer Review.</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg">
                Every {BRAND} batch is independently assayed for identity, purity and concentration. We publish the raw reports — no redactions, no marketing math.
              </p>
              <ul className="space-y-3 list-none p-0">
                {[
                  { t: "HPLC purity ≥ 99%", s: "Reverse-phase chromatography per batch" },
                  { t: "Mass spec identity", s: "Molecular weight verified to ±1 Da" },
                  { t: "Endotoxin & sterility screened", s: "USP <85> / <71> reference methods" },
                ].map((s) => (
                  <li key={s.t} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary font-black">✓</span>
                    <div>
                      <p className="text-sm font-bold">{s.t}</p>
                      <p className="text-xs text-muted-foreground">{s.s}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/products" className="inline-flex h-14 px-7 items-center justify-center gap-2 rounded-full bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-primary transition-colors">
                Browse Catalog ↗
              </Link>
            </div>
          </div>
        </section>

        {/* NEW SECTION 2: TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24" aria-labelledby="reviews-heading">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <Pill>4.9 / 5 · 2,400+ Reviews</Pill>
            <h2 id="reviews-heading" className="text-4xl sm:text-5xl font-black uppercase leading-tight tracking-tight">
              Researchers Don&apos;t<br /><span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">Tolerate Guesswork.</span>
            </h2>
            <p className="text-sm text-muted-foreground">Real feedback from labs that reorder month after month.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "COAs match the batch every single time. We've reorganized our entire procurement around them.", a: "Dr. M. Halverson", r: "Translational Lab Director" },
              { q: "Cold chain arrived perfectly within spec. Pre-mixed pens have cut our prep time in half.", a: "S. Okafor, PhD", r: "Independent Research Group" },
              { q: "Finally a supplier that shows the raw HPLC, not a marketing summary. That's the bar.", a: "L. Tanaka", r: "Senior Research Associate" },
            ].map((t) => (
              <figure key={t.a} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 transition-all">
                <div className="text-primary text-lg tracking-widest">★★★★★</div>
                <blockquote className="text-base font-medium leading-relaxed">&ldquo;{t.q}&rdquo;</blockquote>
                <figcaption className="mt-auto pt-4 border-t border-border">
                  <p className="text-sm font-black uppercase">{t.a}</p>
                  <p className="text-xs text-muted-foreground">{t.r}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-muted/30 border-y border-border" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-10">
            <div className="space-y-3 text-center">
              <Pill>FAQ</Pill>
              <h2 id="faq-heading" className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Common Questions</h2>
            </div>
            <div className="space-y-3">
              {[
                { q: "Are these products for human use?", a: "No. All products are sold strictly for in-vitro laboratory research and are not for human or veterinary use." },
                { q: "Do you provide a Certificate of Analysis?", a: "Yes. Every batch ships with a batch-matched COA including HPLC purity and mass spec identity confirmation." },
                { q: "How are pens shipped?", a: "All pens ship via tracked, insulated cold-chain at 2–8°C. Delivery is typically 2–3 business days in supported regions." },
                { q: "What payment methods do you accept?", a: "We accept major cards and wire transfer for bulk lab orders. Pricing is shown in USD; settlement is in EUR." },
              ].map((f) => (
                <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 open:shadow-[var(--shadow-glow)]">
                  <summary className="cursor-pointer text-sm sm:text-base font-bold list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground group-open:rotate-45 group-open:bg-primary group-open:text-primary-foreground group-open:border-primary transition-all">+</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24" aria-labelledby="cta-heading">
          <div className="relative rounded-3xl bg-foreground text-background p-10 md:p-16 text-center space-y-5 overflow-hidden">
            <div aria-hidden className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_oklch(0.62_0.24_25/_0.6),_transparent_60%)]" />
            <div aria-hidden className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,_white_1px,_transparent_1px),linear-gradient(to_bottom,_white_1px,_transparent_1px)] [background-size:40px_40px]" />
            <div className="relative space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Contact
              </span>
              <h2 id="cta-heading" className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
                Upgrade your<br /><span className="bg-[image:var(--gradient-flame)] bg-clip-text text-transparent">Peptide Supply.</span>
              </h2>
              <p className="text-sm sm:text-base text-background/70 max-w-xl mx-auto">
                Browse the catalog or reach our research team about custom protocols and bulk lab pricing.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Link to="/products" className="inline-flex h-14 px-7 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:bg-background hover:text-foreground transition-colors">
                  Shop Peptide Pens ↗
                </Link>
                <a href="mailto:hello@getpeptidepen.com" className="inline-flex h-14 px-7 items-center justify-center gap-2 rounded-full border-2 border-background bg-transparent text-background font-bold uppercase tracking-wider text-sm hover:bg-background hover:text-foreground transition-colors">
                  Email Our Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-black text-sm">P</span>
              <span className="text-base font-black tracking-tight uppercase">PeptidePen</span>
            </div>
            <p className="text-xs text-background/60 max-w-xs">Research-grade peptide pens. Batch-matched COAs. Cold-chain delivery. For in-vitro laboratory research only.</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-widest font-black text-primary">Shop</p>
            <ul className="space-y-1.5 list-none p-0">
              <li><Link to="/products" className="text-sm text-background/70 hover:text-background">All Products</Link></li>
              <li><Link to="/products" className="text-sm text-background/70 hover:text-background">Metabolic</Link></li>
              <li><Link to="/products" className="text-sm text-background/70 hover:text-background">Recovery</Link></li>
              <li><Link to="/products" className="text-sm text-background/70 hover:text-background">Cognition</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-widest font-black text-primary">Company</p>
            <ul className="space-y-1.5 list-none p-0">
              <li><a href="#science" className="text-sm text-background/70 hover:text-background">Science</a></li>
              <li><a href="#how-it-works" className="text-sm text-background/70 hover:text-background">How it Works</a></li>
              <li><a href="#contact" className="text-sm text-background/70 hover:text-background">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-widest font-black text-primary">Support</p>
            <ul className="space-y-1.5 list-none p-0">
              <li><a href="#faq" className="text-sm text-background/70 hover:text-background">FAQ</a></li>
              <li><a href="mailto:hello@getpeptidepen.com" className="text-sm text-background/70 hover:text-background">Email Support</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-background/60 text-center md:text-left max-w-2xl">
              <strong className="text-background">Research Use Only.</strong> Products are supplied strictly for in-vitro laboratory research and are not for human or veterinary use.
            </p>
            <p className="text-xs text-background/60">© {new Date().getFullYear()} {BRAND}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
