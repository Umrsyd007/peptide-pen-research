import { createFileRoute, Link } from "@tanstack/react-router";

const BRAND = "Peptide Pen Research";
const PRODUCT_NAME = "Retatrutide";
const PRODUCT_VARIANT = "Standard Pen";
const PRODUCT_FULL = `${PRODUCT_NAME} (${PRODUCT_VARIANT})`;
const PRODUCT_PRICE = "$307.40";
const PRODUCT_CATEGORY = "Metabolic & Fat Optimization";
const TAGLINE = `${PRODUCT_NAME} research, in a pre-mixed pen.`;
const PAGE_TITLE = `${PRODUCT_FULL} | ${BRAND}`;
const PAGE_DESCRIPTION =
  "Retatrutide Standard Pen — pre-mixed, lab-tested GLP-1/GIP/glucagon triple-agonist research peptide with batch-matched COA and cold-chain shipping. For in-vitro laboratory use only.";

export const Route = createFileRoute("/")({
  component: HomeWireframe,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: PRODUCT_FULL,
          category: PRODUCT_CATEGORY,
          brand: { "@type": "Brand", name: BRAND },
          description: PAGE_DESCRIPTION,
          offers: {
            "@type": "Offer",
            price: "307.40",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
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
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" aria-label={`${BRAND} home`}>
            <Box className="h-10 w-32" label="logo">{BRAND}</Box>
          </a>
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
          <Box className="h-10 w-24" label="cta">Cart</Box>
        </div>
      </header>

      <main id="main" role="main">
        {/* 1. HERO — product-focused */}
        <section
          className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          aria-labelledby="hero-heading"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <SectionTag>Research Use Only</SectionTag>
              <SectionTag>Bestseller</SectionTag>
              <SectionTag>{PRODUCT_CATEGORY}</SectionTag>
            </div>
            <h1 id="hero-heading" className="text-4xl md:text-5xl font-semibold leading-tight">
              {TAGLINE}
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              {PRODUCT_FULL} is a pre-mixed research peptide pen featuring a
              triple GLP-1 / GIP / glucagon receptor agonist — shipped cold-chain
              with batch-matched COA. No reconstitution. No guesswork.
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{PRODUCT_PRICE}</span>
              <span className="text-xs text-muted-foreground">per pen · ships cold-chain</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Box className="h-12 w-44" label="primary cta">Add Pen to Cart</Box>
              <Box className="h-12 w-40" label="secondary cta">Download COA</Box>
            </div>
            <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 list-none p-0">
              <li>✓ ≥99% purity (HPLC)</li>
              <li>✓ MS identity confirmed</li>
              <li>✓ Endotoxin screened</li>
            </ul>
          </div>
          <Box className="aspect-[4/5] w-full" label="hero image">
            {PRODUCT_FULL} — Pen Visual
          </Box>
        </section>

        {/* 2. TRUST / VALUE PROPS */}
        <section
          className="border-y border-dashed border-foreground/30 bg-muted/20"
          aria-labelledby="trust-heading"
        >
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 id="trust-heading" className="sr-only">Why researchers choose this pen</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { t: "Triple Agonist", s: "GLP-1 / GIP / Glucagon profile" },
                { t: "Pre-Mixed Pen", s: "No reconstitution, no waste" },
                { t: "Batch-Matched COA", s: "HPLC + MS on every pen" },
                { t: "Cold-Chain Shipping", s: "Temperature-monitored 2–8°C" },
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

        {/* 3. PRODUCT SPECS / VARIANTS */}
        <section
          id="product"
          className="max-w-6xl mx-auto px-6 py-16"
          aria-labelledby="product-heading"
        >
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-2">
              <SectionTag>Product Detail</SectionTag>
              <h2 id="product-heading" className="text-3xl font-semibold">
                Inside the {PRODUCT_NAME} Standard Pen
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Each pen is filled, sealed and assayed in a controlled
                environment, then matched to its lab report by batch ID.
              </p>
            </div>
            <Link to="/products" className="hidden md:block">
              <Box className="h-10 w-36" label="link">All peptide pens →</Box>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Box className="aspect-square" label="product image">Pen — Front</Box>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { k: "Peptide", v: "Retatrutide" },
                { k: "Format", v: "Pre-mixed pen" },
                { k: "Category", v: PRODUCT_CATEGORY },
                { k: "Purity (HPLC)", v: "≥ 99%" },
                { k: "Identity", v: "MS confirmed ±1 Da" },
                { k: "Storage", v: "2–8°C, protect from light" },
                { k: "Shipping", v: "Insulated cold-chain" },
                { k: "Price", v: PRODUCT_PRICE },
              ].map((s) => (
                <Box key={s.k} className="p-3" label="spec">
                  <div className="text-left w-full">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
                    <p className="text-sm font-medium">{s.v}</p>
                  </div>
                </Box>
              ))}
            </div>
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
                { n: "01", t: "Select your pen", s: `Choose ${PRODUCT_NAME} Standard or browse the full catalog.` },
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
            {PRODUCT_NAME} COA / Assay Visual
          </Box>
          <div className="space-y-6">
            <SectionTag>The Science</SectionTag>
            <h2 id="science-heading" className="text-3xl font-semibold">
              A triple-agonist research tool, fully documented
            </h2>
            <p className="text-sm text-muted-foreground">
              {PRODUCT_NAME} is a long-acting agonist at the GLP-1, GIP and
              glucagon receptors — one of the most studied targets in current
              metabolic research. Every {BRAND} pen is independently assayed
              for identity, purity and concentration.
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
            <Box className="h-12 w-56" label="cta">Download {PRODUCT_NAME} COA</Box>
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
                Why labs reorder the {PRODUCT_NAME} pen
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { q: "The pre-mixed pen removed an entire reconstitution step from our metabolic protocol.", a: "— Research Coordinator, Biotech Startup" },
                { q: "COA matched the batch every time. That alone is rare in this space.", a: "— Principal Investigator, Independent Lab" },
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
                  Ready to order your {PRODUCT_NAME} pen?
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  {PRODUCT_PRICE} per pen, shipped cold-chain with a
                  batch-matched certificate of analysis.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Box className="h-12 w-44" label="primary cta">Add Pen to Cart</Box>
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
