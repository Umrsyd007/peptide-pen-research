import { createFileRoute, Link } from "@tanstack/react-router";

const PRODUCT_NAME = "Research Peptide Pen (Standard)";
const PRODUCT_DESCRIPTION =
  "Pre-mixed research peptide delivery pen for laboratory research use only. Includes dosing reference, storage guidance, and quality-control documentation.";
const PAGE_TITLE = `${PRODUCT_NAME} | Research Use Only`;

const FAQS = [
  {
    q: "What is this peptide pen used for?",
    a: "This product is supplied strictly for in-vitro laboratory research. It is not a medicine and is not for human or veterinary use.",
  },
  {
    q: "How is the pen stored?",
    a: "Store refrigerated between 2–8°C. Do not freeze. Keep out of direct sunlight.",
  },
  {
    q: "How long does one pen last?",
    a: "Approximately 21 days at the reference research dosing schedule of 2–8 mg per week.",
  },
  {
    q: "Do you ship internationally?",
    a: "Shipping availability depends on local research-chemical regulations. Contact us before ordering from outside supported regions.",
  },
];

export const Route = createFileRoute("/")({
  component: LandingWireframe,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PRODUCT_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PRODUCT_DESCRIPTION },
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
          name: PRODUCT_NAME,
          description: PRODUCT_DESCRIPTION,
          category: "Research Chemicals",
          brand: { "@type": "Brand", name: "Peptide Pen Research" },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: "0.00",
            highPrice: "0.00",
            availability: "https://schema.org/InStock",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Products",
              item: "/products",
            },
            { "@type": "ListItem", position: 3, name: PRODUCT_NAME, item: "/" },
          ],
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
      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm p-4">
        {children}
      </div>
    </div>
  );
}

function Line({ w = "w-full" }: { w?: string }) {
  return <div className={`h-2 rounded bg-foreground/15 ${w}`} aria-hidden="true" />;
}

function LandingWireframe() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:border"
      >
        Skip to main content
      </a>

      {/* Nav */}
      <header className="border-b border-dashed border-foreground/30" role="banner">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" aria-label="Peptide Pen Research home">
            <Box className="h-10 w-32" label="logo">LOGO</Box>
          </a>
          <nav className="hidden md:flex gap-6" aria-label="Primary">
            {["Products", "How it Works", "Research", "FAQ", "Contact"].map(
              (n) => (
                <a
                  key={n}
                  href={`#${n.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-muted-foreground border-b border-dashed border-foreground/30 pb-0.5"
                >
                  {n}
                </a>
              ),
            )}
          </nav>
          <Box className="h-10 w-24" label="cta">Cart</Box>
        </div>
      </header>

      <main id="main" role="main">
        {/* Breadcrumb */}
        <nav
          className="max-w-6xl mx-auto px-6 pt-6"
          aria-label="Breadcrumb"
        >
          <p className="text-xs text-muted-foreground">
            <a href="/" className="underline">Home</a> /{" "}
            <a href="#products" className="underline">Products</a> /{" "}
            <span>Metabolic & Fat Optimization</span>
          </p>
        </nav>

        {/* Product hero */}
        <article
          className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
          itemScope
          itemType="https://schema.org/Product"
        >
          {/* Left: gallery */}
          <div className="space-y-4">
            <Box className="aspect-square w-full" label="product image">
              <span itemProp="name">{PRODUCT_NAME}</span> hero image
            </Box>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  className="aspect-square"
                  label={`Peptide pen thumbnail ${i}`}
                />
              ))}
            </div>
          </div>

          {/* Right: product info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-1 border border-dashed border-foreground/40 rounded">
                Bestseller
              </span>
              <h1 className="text-3xl font-semibold" itemProp="name">
                {PRODUCT_NAME}
              </h1>
              <p
                className="text-sm text-muted-foreground"
                itemProp="category"
              >
                Category · Metabolic & Fat Optimization Research
              </p>
            </div>

            <p className="text-sm text-muted-foreground" itemProp="description">
              {PRODUCT_DESCRIPTION}
            </p>

            <Box className="h-12" label="region selector">
              Select region ▾
            </Box>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Select Variant
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Box className="h-16" label="variant 6mg">6mg — $XXX.XX</Box>
                <Box className="h-16" label="variant 12mg">12mg — $XXX.XX</Box>
              </div>
            </div>

            <div
              className="flex items-end justify-between border-t border-dashed border-foreground/30 pt-4"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-3xl font-semibold">
                  <span itemProp="priceCurrency" content="USD">$</span>
                  <span itemProp="price">XXX.XX</span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  * Reference price in USD
                </p>
                <link itemProp="availability" href="https://schema.org/InStock" />
              </div>
              <Box className="h-12 w-40" label="primary cta">
                Add to Cart
              </Box>
            </div>

            <Box className="h-12" label="secondary cta">
              Contact Us to Arrange Delivery
            </Box>

            <ul className="grid grid-cols-3 gap-3 pt-2 list-none p-0">
              {[
                { t: "Quality Guaranteed", s: "Lab-tested COA" },
                { t: "Research Support", s: "Expert help" },
                { t: "Tracked Shipping", s: "2–3 days" },
              ].map((b) => (
                <li key={b.t}>
                  <Box className="h-20 flex-col" label="badge">
                    <div className="text-center">
                      <p className="text-xs font-medium">{b.t}</p>
                      <p className="text-[10px] text-muted-foreground">{b.s}</p>
                    </div>
                  </Box>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Dosage info row */}
        <section
          className="max-w-6xl mx-auto px-6 py-8"
          aria-labelledby="dosage-heading"
        >
          <h2 id="dosage-heading" className="text-lg font-semibold mb-4">
            Reference Dosing (Research Use Only)
          </h2>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: "Dosage", s: "2–8 mg / week" },
              { t: "Frequency", s: "Once per week" },
              { t: "Pen Duration", s: "1 pen ≈ 21 days" },
              { t: "Pens per Course", s: "8 pens" },
            ].map((d) => (
              <div key={d.t}>
                <Box className="h-24 flex-col" label="stat">
                  <div className="text-center">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      {d.t}
                    </dt>
                    <dd className="text-sm font-medium mt-1">{d.s}</dd>
                  </div>
                </Box>
              </div>
            ))}
          </dl>
        </section>

        {/* Video + tabs */}
        <section
          className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
          aria-labelledby="how-it-works"
        >
          <h2 id="how-it-works" className="sr-only">How to Use the Peptide Pen</h2>
          <Box className="aspect-video lg:col-span-2" label="video">
            ▶ How to Use the Peptide Pen
          </Box>
          <nav aria-label="Quick links" className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Quick Links
            </p>
            {[
              "Product Description",
              "Dosage Calculator",
              "Quality Control",
              "How to Use",
              "Storage",
              "Shipping",
            ].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}>
                <Box className="h-10" label="link">{l}</Box>
              </a>
            ))}
          </nav>
        </section>

        {/* Long-form content */}
        <section
          className="max-w-6xl mx-auto px-6 py-8 space-y-10"
          aria-labelledby="research-heading"
        >
          <h2 id="research-heading" className="sr-only">Research Information</h2>
          {[
            "What is this peptide?",
            "How does it work?",
            "Research & Clinical Literature",
            "Reported Benefits in Research",
            "Reported Side Effects in Research",
            "Pre-Mixed Pen Dosage Information",
          ].map((heading) => (
            <div key={heading} className="space-y-3">
              <h3 className="text-lg font-semibold">{heading}</h3>
              <Line />
              <Line />
              <Line w="w-11/12" />
              <Line w="w-10/12" />
              <Line w="w-2/3" />
            </div>
          ))}
        </section>

        {/* Comparison table */}
        <section
          className="max-w-6xl mx-auto px-6 py-8"
          aria-labelledby="compare-heading"
        >
          <h2 id="compare-heading" className="text-lg font-semibold mb-4">
            Compare Variants
          </h2>
          <Box className="h-48" label="comparison table">
            Table: Variant · Units · Dose per unit · Price
          </Box>
        </section>

        {/* FAQ */}
        <section
          className="max-w-6xl mx-auto px-6 py-8"
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" className="text-lg font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="border-2 border-dashed border-foreground/40 bg-muted/30 rounded-md p-4"
              >
                <summary className="cursor-pointer text-sm font-medium">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section
          className="max-w-6xl mx-auto px-6 py-8"
          aria-label="Legal disclaimer"
        >
          <Box className="p-6" label="disclaimer">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Research Use Only.</strong> Products on this site are
              supplied strictly for in-vitro laboratory research and are not
              intended for human or veterinary use, diagnosis, treatment, cure,
              or prevention of any disease. Purchasers confirm they are
              qualified researchers or institutions.
            </p>
          </Box>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-dashed border-foreground/30 mt-8"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Shop", "Company", "Support", "Legal"].map((col) => (
            <div key={col} className="space-y-2">
              <p className="text-xs uppercase tracking-wider font-medium">
                {col}
              </p>
              <Line w="w-3/4" />
              <Line w="w-2/3" />
              <Line w="w-1/2" />
              <Line w="w-2/3" />
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-foreground/30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Box className="h-8 w-24" label="logo" />
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Peptide Pen Research — Wireframe
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
