import { createFileRoute, Link } from "@tanstack/react-router";

const BRAND = "Peptide Pen Research";
const TAGLINE = "Lab-grade peptide pens, engineered for serious research.";
const PAGE_TITLE = `${BRAND} | Research-Grade Peptide Pens`;
const PAGE_DESCRIPTION =
  "Pre-mixed, lab-tested research peptide pens with full COA documentation, cold-chain shipping and dosing references. For in-vitro laboratory use only.";

export const Route = createFileRoute("/")({
  component: HomeWireframe,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND,
          description: PAGE_DESCRIPTION,
          url: "/",
        }),
      },
    ],
  }),
});

function Box({
  children,
  className = "",
  label,
}: {
  children?: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`relative border-2 border-dashed border-foreground/40 bg-muted/30 rounded-md ${className}`}
      aria-label={label}
    >
      {label && (
        <span className="absolute top-1 left-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground text-sm p-4">
        {children}
      </div>
    </div>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-dashed border-foreground/40 rounded text-muted-foreground">
      {children}
    </span>
  );
}

function HomeWireframe() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:border"
      >
        Skip to main content
      </a>

      {/* Nav */}
      <header className="border-b border-dashed border-foreground/30" role="banner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link to="/" aria-label={`${BRAND} home`} className="shrink-0">
            <Box className="h-9 sm:h-10 w-28 sm:w-32" label="logo">{BRAND}</Box>
          </Link>
          <nav className="hidden md:flex gap-6" aria-label="Primary">
            <Link
              to="/products"
              className="text-sm text-muted-foreground border-b border-dashed border-foreground/30 pb-0.5 hover:text-foreground transition-colors"
            >
              Products
            </Link>
            {["Science", "How it Works", "FAQ", "Contact"].map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-muted-foreground border-b border-dashed border-foreground/30 pb-0.5 hover:text-foreground transition-colors"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Box className="h-9 sm:h-10 w-20 sm:w-24" label="cta">Cart</Box>
            <details className="md:hidden relative">
              <summary
                className="list-none cursor-pointer inline-flex items-center justify-center h-11 w-11 rounded border border-dashed border-foreground/40 text-foreground"
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
                className="absolute right-0 top-full mt-2 w-56 z-50 rounded-md border border-dashed border-foreground/40 bg-background shadow-lg p-2 flex flex-col"
              >
                <Link to="/products" className="px-3 py-2 text-sm rounded hover:bg-muted">Products</Link>
                {["Science", "How it Works", "FAQ", "Contact"].map((n) => (
                  <a
                    key={n}
                    href={`#${n.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-3 py-2 text-sm rounded hover:bg-muted"
                  >
                    {n}
                  </a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="main" role="main">
        {/* 1. HERO */}
        <section
          className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          aria-labelledby="hero-heading"
        >
          <div className="space-y-6">
            <SectionTag>Research Use Only</SectionTag>
            <h1 id="hero-heading" className="text-4xl md:text-5xl font-semibold leading-tight">
              {TAGLINE}
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              {BRAND} supplies pre-mixed peptide pens with batch-level COAs,
              cold-chain shipping and transparent dosing references — built
              for laboratories that can&apos;t afford guesswork.
            </p>
            <div className="flex flex-wrap gap-3">
              <Box className="h-12 w-44" label="primary cta">Shop Peptide Pens</Box>
              <Box className="h-12 w-40" label="secondary cta">View the Science</Box>
            </div>
            <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 list-none p-0">
              <li>✓ ≥99% purity (HPLC)</li>
              <li>✓ Third-party tested</li>
              <li>✓ Tracked cold-chain delivery</li>
            </ul>
          </div>
          <Box className="aspect-[4/5] w-full" label="hero image">
            Peptide Pen — Hero Visual
          </Box>
        </section>

        {/* 2. TRUST / VALUE PROPS */}
        <section
          className="border-y border-dashed border-foreground/30 bg-muted/20"
          aria-labelledby="trust-heading"
        >
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 id="trust-heading" className="sr-only">Why researchers choose us</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { t: "Lab-Verified Purity", s: "HPLC + MS reports on every batch" },
                { t: "Pre-Mixed Pens", s: "No reconstitution, no waste" },
                { t: "Cold-Chain Shipping", s: "Temperature-monitored 2–8°C" },
                { t: "Researcher Support", s: "Speak to a real scientist" },
              ].map((b) => (
                <Box key={b.t} className="h-28 flex-col" label="value prop">
                  <div>
                    <p className="text-sm font-medium">{b.t}</p>
                    <p className="text-xs text-muted-foreground mt-1">{b.s}</p>
                  </div>
                </Box>
              ))}
            </div>
          </div>
        </section>

        {/* 3. FEATURED PRODUCTS */}
        <section
          className="max-w-6xl mx-auto px-6 py-16"
          aria-labelledby="products-heading"
        >
          <div className="flex items-end justify-between mb-8">
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
            <Link to="/products" className="hidden md:block">
              <Box className="h-10 w-36" label="link">View all products →</Box>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: "Research Peptide Pen — Standard", c: "Metabolic & Fat Research", p: "$XXX" },
              { n: "Recovery Pen — Tissue Series", c: "Repair & Recovery Research", p: "$XXX" },
              { n: "Cognition Pen — Nootropic Series", c: "Neurological Research", p: "$XXX" },
            ].map((p) => (
              <article key={p.n} className="space-y-3">
                <Box className="aspect-square" label="product image" />
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.c}</p>
                  <h3 className="text-sm font-medium">{p.n}</h3>
                  <p className="text-sm font-semibold">{p.p}</p>
                </div>
                <Box className="h-10" label="cta">View Details</Box>
              </article>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-muted/20 border-y border-dashed border-foreground/30"
          aria-labelledby="how-heading"
        >
          <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
            <div className="space-y-2 max-w-2xl">
              <SectionTag>How it Works</SectionTag>
              <h2 id="how-heading" className="text-3xl font-semibold">
                From cold-chain warehouse to your lab bench
              </h2>
              <p className="text-sm text-muted-foreground">
                A simple, documented process designed around the realities
                of research procurement.
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
                  <Box className="h-16" label={`step ${s.n}`}>
                    <span className="text-xl font-semibold">{s.n}</span>
                  </Box>
                  <h3 className="text-sm font-medium">{s.t}</h3>
                  <p className="text-xs text-muted-foreground">{s.s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. SCIENCE / RESEARCH */}
        <section
          id="science"
          className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          aria-labelledby="science-heading"
        >
          <Box className="aspect-video w-full" label="lab image">
            COA / Lab Visual
          </Box>
          <div className="space-y-6">
            <SectionTag>The Science</SectionTag>
            <h2 id="science-heading" className="text-3xl font-semibold">
              Documentation that stands up to peer review
            </h2>
            <p className="text-sm text-muted-foreground">
              Every {BRAND} batch is independently assayed for identity,
              purity and concentration. We publish the raw reports — no
              redactions, no marketing math.
            </p>
            <ul className="space-y-3 list-none p-0">
              {[
                { t: "HPLC purity ≥ 99%", s: "Reverse-phase chromatography per batch" },
                { t: "Mass spec identity confirmation", s: "Molecular weight verified to ±1 Da" },
                { t: "Endotoxin & sterility screened", s: "USP <85> / <71> reference methods" },
              ].map((s) => (
                <li key={s.t}>
                  <Box className="p-3" label="proof point">
                    <div className="text-left w-full">
                      <p className="text-sm font-medium">{s.t}</p>
                      <p className="text-xs text-muted-foreground">{s.s}</p>
                    </div>
                  </Box>
                </li>
              ))}
            </ul>
            <Box className="h-12 w-48" label="cta">Download Sample COA</Box>
          </div>
        </section>

        {/* 6. TESTIMONIALS + FINAL CTA */}
        <section
          className="border-t border-dashed border-foreground/30 bg-muted/20"
          aria-labelledby="cta-heading"
        >
          <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <SectionTag>Trusted by Researchers</SectionTag>
              <h2 id="cta-heading" className="text-3xl font-semibold">
                The supplier labs keep coming back to
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { q: "COAs match every time. That alone is rare in this space.", a: "— Principal Investigator, Independent Lab" },
                { q: "The pens removed an entire reconstitution step from our workflow.", a: "— Research Coordinator, Biotech Startup" },
                { q: "Cold-chain arrived on schedule, fully temperature-logged.", a: "— Procurement Lead, University Research Group" },
              ].map((t) => (
                <Box key={t.q} className="p-6 flex-col" label="testimonial">
                  <div className="space-y-3 text-left w-full">
                    <p className="text-sm text-foreground">&ldquo;{t.q}&rdquo;</p>
                    <p className="text-xs text-muted-foreground">{t.a}</p>
                  </div>
                </Box>
              ))}
            </div>
            <Box className="p-10" label="final cta">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">
                  Ready to upgrade your peptide supply?
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  Browse the catalog or talk to a researcher on our team
                  about custom protocols and bulk lab pricing.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Box className="h-12 w-44" label="primary cta">Shop Peptide Pens</Box>
                  <Box className="h-12 w-44" label="secondary cta">Contact Our Team</Box>
                </div>
              </div>
            </Box>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dashed border-foreground/30" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { h: "Shop", items: ["All Products", "Metabolic", "Recovery", "Cognition"] },
            { h: "Company", items: ["About", "Science", "Quality", "Contact"] },
            { h: "Support", items: ["Shipping", "Returns", "COA Lookup", "FAQ"] },
            { h: "Legal", items: ["Research Use Only", "Terms", "Privacy", "Compliance"] },
          ].map((col) => (
            <div key={col.h} className="space-y-2">
              <p className="text-xs uppercase tracking-wider font-medium">{col.h}</p>
              <ul className="space-y-1 list-none p-0">
                {col.items.map((i) => (
                  <li key={i} className="text-xs text-muted-foreground">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-foreground/30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground text-center md:text-left max-w-2xl">
              <strong>Research Use Only.</strong> Products are supplied
              strictly for in-vitro laboratory research and are not for
              human or veterinary use.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {BRAND}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
