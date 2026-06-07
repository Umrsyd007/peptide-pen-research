import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    const title = p
      ? `${p.name} — Research Peptide Pen`
      : "Product — Research Peptide Pen";
    const description = p
      ? `${p.name} (${p.categories}). Pre-mixed research peptide pen with batch-matched COA. For research use only.`
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
                url,
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

function Header() {
  return (
    <header className="border-b border-dashed border-foreground/30" role="banner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <Link
          to="/"
          aria-label="Peptide Pen Research home"
          className="text-base sm:text-lg font-bold tracking-tight shrink-0"
        >
          Peptide Pen Research
        </Link>
        <nav className="hidden md:flex gap-6" aria-label="Primary">
          <Link
            to="/products"
            className="text-sm text-foreground font-medium border-b border-dashed border-foreground/30 pb-0.5"
          >
            Products
          </Link>
          {["How it Works", "Research", "FAQ", "Contact"].map((n) => (
            <a
              key={n}
              href={`/#${n.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-muted-foreground border-b border-dashed border-foreground/30 pb-0.5 hover:text-foreground transition-colors"
            >
              {n}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="h-9 sm:h-10 w-20 sm:w-24 rounded-md border-2 border-dashed border-foreground/40 bg-muted/30 flex items-center justify-center text-muted-foreground text-sm">
            Cart
          </div>
          <details className="md:hidden relative">
            <summary
              className="list-none cursor-pointer inline-flex items-center justify-center h-11 w-11 rounded border border-dashed border-foreground/40 text-foreground"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </summary>
            <nav
              aria-label="Mobile primary"
              className="absolute right-0 top-full mt-2 w-56 z-50 rounded-md border border-dashed border-foreground/40 bg-background shadow-lg p-2 flex flex-col"
            >
              <Link to="/products" className="px-3 py-2 text-sm rounded hover:bg-muted">
                Products
              </Link>
              {["How it Works", "Research", "FAQ", "Contact"].map((n) => (
                <a
                  key={n}
                  href={`/#${n.toLowerCase().replace(/\s+/g, "-")}`}
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
  );
}

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10" role="main">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* 1. HERO: Gallery + Buy Box */}
        <section
          aria-labelledby="product-heading"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square w-full rounded-lg border border-border bg-muted overflow-hidden flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md border border-border bg-muted overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={product.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-contain p-2 opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {product.tag && <SectionTag>{product.tag}</SectionTag>}
              <SectionTag>Research Use Only</SectionTag>
            </div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {product.categories}
            </p>
            <h1 id="product-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-bold">{product.price}</p>
            <p className="text-sm text-muted-foreground">
              Pre-mixed research peptide pen, third-party assayed for identity
              and purity. Ships cold-chain with a batch-matched certificate of
              analysis. Strictly for in-vitro laboratory research.
            </p>

            {/* Variant selector */}
            <fieldset className="space-y-2">
              <legend className="text-xs uppercase tracking-wider text-muted-foreground">
                Pen size
              </legend>
              <div className="flex flex-wrap gap-2">
                {["Standard", "Large", "Pro"].map((v) => (
                  <Box key={v} className="h-11 w-24" label="variant">
                    {v}
                  </Box>
                ))}
              </div>
            </fieldset>

            {/* Region selector */}
            <fieldset className="space-y-2">
              <legend className="text-xs uppercase tracking-wider text-muted-foreground">
                Shipping region
              </legend>
              <Box className="h-11 w-full max-w-xs" label="region select">
                Select region ▾
              </Box>
            </fieldset>

            {/* Qty + CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Box className="h-12 w-28" label="qty">Qty: 1</Box>
              <Box className="h-12 flex-1 min-w-[12rem]" label="primary cta">
                Add to Cart
              </Box>
            </div>
            <Box className="h-12 w-full" label="secondary cta">
              Contact Us to Order
            </Box>

            {/* Trust strip */}
            <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 list-none p-0">
              <li>✓ ≥99% purity (HPLC)</li>
              <li>✓ Batch-matched COA</li>
              <li>✓ Cold-chain 2–8°C</li>
              <li>✓ Tracked delivery</li>
            </ul>
          </div>
        </section>

        {/* 2. DESCRIPTION + SPECS */}
        <section
          aria-labelledby="overview-heading"
          className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-4">
            <SectionTag>Overview</SectionTag>
            <h2 id="overview-heading" className="text-2xl font-semibold">
              About {product.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {product.name} is supplied as a pre-mixed research pen for use
              in controlled laboratory settings. Each pen is filled in a
              cleanroom environment and sealed with tamper-evident packaging.
              Batch documentation includes identity confirmation, purity
              analysis and concentration verification.
            </p>
            <p className="text-sm text-muted-foreground">
              This product is provided strictly for in-vitro research and is
              not intended for human or veterinary use. Always follow your
              institution&apos;s biosafety guidelines.
            </p>
          </div>
          <aside className="space-y-3">
            <SectionTag>Specifications</SectionTag>
            <Box className="p-4" label="spec sheet">
              <ul className="text-left text-xs text-muted-foreground space-y-2 w-full list-none p-0">
                <li><strong className="text-foreground">Form:</strong> Pre-mixed solution (pen)</li>
                <li><strong className="text-foreground">Purity:</strong> ≥99% (HPLC)</li>
                <li><strong className="text-foreground">Storage:</strong> 2–8°C, protect from light</li>
                <li><strong className="text-foreground">Shipping:</strong> Cold-chain, tracked</li>
                <li><strong className="text-foreground">COA:</strong> Batch-matched, downloadable</li>
              </ul>
            </Box>
            <Box className="h-11 w-full" label="cta">Download Sample COA</Box>
          </aside>
        </section>

        {/* 3. HOW IT WORKS */}
        <section
          aria-labelledby="how-heading"
          className="mt-16 space-y-6"
        >
          <SectionTag>How it Works</SectionTag>
          <h2 id="how-heading" className="text-2xl font-semibold">
            From order to lab bench
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0">
            {[
              { n: "01", t: "Place your order", s: "Select pen size and region." },
              { n: "02", t: "Verify COA", s: "Batch-matched lab report on file." },
              { n: "03", t: "Cold-chain ships", s: "Insulated, temperature-logged." },
              { n: "04", t: "Run protocol", s: "Dosing references available." },
            ].map((s) => (
              <li key={s.n} className="space-y-2">
                <Box className="h-14" label={`step ${s.n}`}>
                  <span className="text-lg font-semibold">{s.n}</span>
                </Box>
                <h3 className="text-sm font-medium">{s.t}</h3>
                <p className="text-xs text-muted-foreground">{s.s}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. FAQ */}
        <section aria-labelledby="faq-heading" className="mt-16 space-y-4">
          <SectionTag>FAQ</SectionTag>
          <h2 id="faq-heading" className="text-2xl font-semibold">
            Frequently asked questions
          </h2>
          <div className="space-y-2">
            {[
              { q: "Is this product for human use?", a: "No. All products are strictly for in-vitro research use only." },
              { q: "How is the COA provided?", a: "Each pen ships with a batch-matched COA; a digital copy is also available on request." },
              { q: "What is the shipping process?", a: "Orders ship cold-chain (2–8°C) with temperature logging and tracked delivery." },
              { q: "Can I order in bulk for my lab?", a: "Yes — contact our team for lab pricing and custom protocols." },
            ].map((f) => (
              <details
                key={f.q}
                className="group border border-dashed border-foreground/30 rounded-md"
              >
                <summary className="list-none cursor-pointer flex items-center justify-between px-4 py-3 text-sm font-medium">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 5. RELATED PRODUCTS */}
        <section aria-labelledby="related-heading" className="mt-16 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <SectionTag>Related</SectionTag>
              <h2 id="related-heading" className="text-2xl font-semibold">
                Researchers also ordered
              </h2>
            </div>
            <Link to="/products" className="text-sm underline shrink-0">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/products/$productId"
                params={{ productId: r.id }}
                className="block space-y-2 group"
              >
                <Box className="aspect-square" label="product image" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {r.categories.split("•")[0]?.trim()}
                </p>
                <p className="text-sm font-medium group-hover:underline">{r.name}</p>
                <p className="text-sm font-semibold">{r.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-dashed border-foreground/30 mt-16 py-8" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Peptide Pen Research — Research use only.
          Not for human or veterinary consumption.
        </div>
      </footer>
    </div>
  );
}
