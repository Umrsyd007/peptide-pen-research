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

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-border rounded text-muted-foreground">
      {children}
    </span>
  );
}

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Science", href: "#science" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

function HomePage() {
  const featured = PRODUCTS.filter((p) => p.tag === "BESTSELLER").slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:border"
      >
        Skip to main content
      </a>

      {/* Nav */}
      <header className="border-b border-border" role="banner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link to="/" aria-label={`${BRAND} home`} className="text-base sm:text-lg font-bold tracking-tight shrink-0">
            {BRAND}
          </Link>
          <nav className="hidden md:flex gap-6 items-center" aria-label="Primary">
            <Link
              to="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
            {NAV_LINKS.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="hidden sm:inline-flex h-10 px-4 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Shop
            </Link>
            <details className="md:hidden relative">
              <summary
                className="list-none cursor-pointer inline-flex items-center justify-center h-11 w-11 rounded border border-border text-foreground"
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </summary>
              <nav
                aria-label="Mobile primary"
                className="absolute right-0 top-full mt-2 w-56 z-50 rounded-md border border-border bg-background shadow-lg p-2 flex flex-col"
              >
                <Link to="/products" className="px-3 py-2 text-sm rounded hover:bg-muted">Products</Link>
                {NAV_LINKS.map((n) => (
                  <a key={n.label} href={n.href} className="px-3 py-2 text-sm rounded hover:bg-muted">
                    {n.label}
                  </a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="main" role="main">
        {/* HERO */}
        <section
          className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center"
          aria-labelledby="hero-heading"
        >
          <div className="space-y-6">
            <SectionTag>Research Use Only</SectionTag>
            <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
              {TAGLINE}
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              {BRAND} supplies pre-mixed peptide pens with batch-level COAs,
              cold-chain shipping and transparent dosing references — built
              for laboratories that can&apos;t afford guesswork.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex h-12 px-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Shop Peptide Pens
              </Link>
              <a
                href="#science"
                className="inline-flex h-12 px-6 items-center justify-center rounded-md border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View the Science
              </a>
            </div>
            <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 list-none p-0">
              <li>✓ ≥99% purity (HPLC)</li>
              <li>✓ Third-party tested</li>
              <li>✓ Tracked cold-chain delivery</li>
            </ul>
          </div>
          <div className="aspect-[4/5] w-full rounded-lg bg-muted overflow-hidden flex items-center justify-center">
            <img
              src={PRODUCTS[0].image}
              alt={`${PRODUCTS[0].name} research peptide pen`}
              className="w-full h-full object-contain p-8"
              loading="eager"
            />
          </div>
        </section>

        {/* TRUST */}
        <section className="border-y border-border bg-muted/30" aria-labelledby="trust-heading">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 id="trust-heading" className="sr-only">Why researchers choose us</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { t: "Lab-Verified Purity", s: "HPLC + MS reports on every batch" },
                { t: "Pre-Mixed Pens", s: "No reconstitution, no waste" },
                { t: "Cold-Chain Shipping", s: "Temperature-monitored 2–8°C" },
                { t: "Researcher Support", s: "Speak to a real scientist" },
              ].map((b) => (
                <div key={b.t} className="rounded-md border border-border bg-card p-4">
                  <p className="text-sm font-medium">{b.t}</p>
                  <p className="text-xs text-muted-foreground mt-1">{b.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="max-w-6xl mx-auto px-6 py-16" aria-labelledby="products-heading">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div className="space-y-2">
              <SectionTag>Featured Catalog</SectionTag>
              <h2 id="products-heading" className="text-3xl font-semibold">
                The pens our labs reorder most
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                A curated slice of our research peptide range — every pen
                ships with a batch-matched certificate of analysis.
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex h-10 px-4 items-center rounded-md border border-border bg-card text-sm hover:bg-muted transition-colors"
            >
              View all products →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <article key={p.id} className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <Link
                  to="/products/$productId"
                  params={{ productId: p.id }}
                  className="block aspect-square bg-muted overflow-hidden"
                  aria-label={`View details for ${p.name}`}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground line-clamp-1">{p.categories}</p>
                  <h3 className="text-sm font-medium">
                    <Link to="/products/$productId" params={{ productId: p.id }} className="hover:underline">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="text-sm font-semibold">{p.price}</p>
                  <Link
                    to="/products/$productId"
                    params={{ productId: p.id }}
                    className="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="md:hidden mt-6 text-center">
            <Link
              to="/products"
              className="inline-flex h-10 px-4 items-center rounded-md border border-border bg-card text-sm hover:bg-muted transition-colors"
            >
              View all products →
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-muted/30 border-y border-border"
          aria-labelledby="how-heading"
        >
          <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
            <div className="space-y-2 max-w-2xl">
              <SectionTag>How it Works</SectionTag>
              <h2 id="how-heading" className="text-3xl font-semibold">
                From cold-chain warehouse to your lab bench
              </h2>
              <p className="text-sm text-muted-foreground">
                A simple, documented process designed around the realities of research procurement.
              </p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-6 list-none p-0">
              {[
                { n: "01", t: "Browse the catalog", s: "Filter by research area, peptide and pen size." },
                { n: "02", t: "Verify the COA", s: "Download the batch-matched lab report before you buy." },
                { n: "03", t: "Cold-chain shipping", s: "Insulated, tracked, 2–3 day delivery in supported regions." },
                { n: "04", t: "Run your protocol", s: "Use our dosing references and researcher support team." },
              ].map((s) => (
                <li key={s.n} className="space-y-3">
                  <div className="h-16 rounded-md border border-border bg-card flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">{s.n}</span>
                  </div>
                  <h3 className="text-sm font-medium">{s.t}</h3>
                  <p className="text-xs text-muted-foreground">{s.s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SCIENCE */}
        <section
          id="science"
          className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          aria-labelledby="science-heading"
        >
          <div className="aspect-video w-full rounded-lg bg-muted overflow-hidden flex items-center justify-center">
            <img
              src={PRODUCTS[1].image}
              alt="Lab-tested research peptide"
              className="w-full h-full object-contain p-6"
              loading="lazy"
            />
          </div>
          <div className="space-y-6">
            <SectionTag>The Science</SectionTag>
            <h2 id="science-heading" className="text-3xl font-semibold">
              Documentation that stands up to peer review
            </h2>
            <p className="text-sm text-muted-foreground">
              Every {BRAND} batch is independently assayed for identity, purity and concentration.
              We publish the raw reports — no redactions, no marketing math.
            </p>
            <ul className="space-y-3 list-none p-0">
              {[
                { t: "HPLC purity ≥ 99%", s: "Reverse-phase chromatography per batch" },
                { t: "Mass spec identity confirmation", s: "Molecular weight verified to ±1 Da" },
                { t: "Endotoxin & sterility screened", s: "USP <85> / <71> reference methods" },
              ].map((s) => (
                <li key={s.t} className="rounded-md border border-border bg-card p-3">
                  <p className="text-sm font-medium">{s.t}</p>
                  <p className="text-xs text-muted-foreground">{s.s}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/products"
              className="inline-flex h-12 px-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Browse the Catalog
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-muted/30 border-y border-border" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
            <div className="space-y-2 text-center">
              <SectionTag>FAQ</SectionTag>
              <h2 id="faq-heading" className="text-3xl font-semibold">Common questions</h2>
            </div>
            <div className="space-y-3">
              {[
                { q: "Are these products for human use?", a: "No. All products are sold strictly for in-vitro laboratory research and are not for human or veterinary use." },
                { q: "Do you provide a Certificate of Analysis?", a: "Yes. Every batch ships with a batch-matched COA including HPLC purity and mass spec identity confirmation." },
                { q: "How are pens shipped?", a: "All pens ship via tracked, insulated cold-chain at 2–8°C. Delivery is typically 2–3 business days in supported regions." },
                { q: "What payment methods do you accept?", a: "We accept major cards and wire transfer for bulk lab orders. Pricing is shown in USD; settlement is in EUR." },
              ].map((f) => (
                <details key={f.q} className="group rounded-md border border-border bg-card p-4">
                  <summary className="cursor-pointer text-sm font-medium list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / FINAL CTA */}
        <section id="contact" className="max-w-6xl mx-auto px-6 py-16" aria-labelledby="cta-heading">
          <div className="rounded-lg border border-border bg-card p-8 md:p-12 text-center space-y-4">
            <SectionTag>Contact</SectionTag>
            <h2 id="cta-heading" className="text-3xl font-semibold">
              Ready to upgrade your peptide supply?
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Browse the catalog or reach our research team about custom protocols and bulk lab pricing.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link
                to="/products"
                className="inline-flex h-12 px-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Shop Peptide Pens
              </Link>
              <a
                href="mailto:hello@getpeptidepen.com"
                className="inline-flex h-12 px-6 items-center justify-center rounded-md border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                Email Our Team
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-medium">Shop</p>
            <ul className="space-y-1 list-none p-0">
              <li><Link to="/products" className="text-xs text-muted-foreground hover:text-foreground">All Products</Link></li>
              <li><Link to="/products" className="text-xs text-muted-foreground hover:text-foreground">Metabolic</Link></li>
              <li><Link to="/products" className="text-xs text-muted-foreground hover:text-foreground">Recovery</Link></li>
              <li><Link to="/products" className="text-xs text-muted-foreground hover:text-foreground">Cognition</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-medium">Company</p>
            <ul className="space-y-1 list-none p-0">
              <li><a href="#science" className="text-xs text-muted-foreground hover:text-foreground">Science</a></li>
              <li><a href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground">How it Works</a></li>
              <li><a href="#contact" className="text-xs text-muted-foreground hover:text-foreground">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-medium">Support</p>
            <ul className="space-y-1 list-none p-0">
              <li><a href="#faq" className="text-xs text-muted-foreground hover:text-foreground">FAQ</a></li>
              <li><a href="mailto:hello@getpeptidepen.com" className="text-xs text-muted-foreground hover:text-foreground">Email Support</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-medium">Legal</p>
            <ul className="space-y-1 list-none p-0">
              <li className="text-xs text-muted-foreground">Research Use Only</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground text-center md:text-left max-w-2xl">
              <strong>Research Use Only.</strong> Products are supplied strictly for in-vitro laboratory research and are not for human or veterinary use.
            </p>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {BRAND}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
