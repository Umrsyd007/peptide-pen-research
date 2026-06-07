import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingWireframe,
  head: () => ({
    meta: [
      { title: "Peptide Pen — Landing Page Wireframe" },
      {
        name: "description",
        content:
          "Low-fidelity wireframe for a peptide pen product landing page.",
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
  return <div className={`h-2 rounded bg-foreground/15 ${w}`} />;
}

function LandingWireframe() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <header className="border-b border-dashed border-foreground/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Box className="h-10 w-32" label="logo">LOGO</Box>
          <nav className="hidden md:flex gap-6">
            {["Products", "How it Works", "Research", "FAQ", "Contact"].map(
              (n) => (
                <span
                  key={n}
                  className="text-sm text-muted-foreground border-b border-dashed border-foreground/30 pb-0.5"
                >
                  {n}
                </span>
              ),
            )}
          </nav>
          <Box className="h-10 w-24" label="cta">Cart</Box>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <p className="text-xs text-muted-foreground">
          ← Back to Products / Metabolic & Fat Optimization
        </p>
      </div>

      {/* Product hero */}
      <section className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: gallery */}
        <div className="space-y-4">
          <Box className="aspect-square w-full" label="product image">
            Peptide Pen Hero Image
          </Box>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} className="aspect-square" label={`thumb ${i}`} />
            ))}
          </div>
        </div>

        {/* Right: product info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-1 border border-dashed border-foreground/40 rounded">
              Bestseller
            </span>
            <h1 className="text-3xl font-semibold">Product Name (Standard Pen)</h1>
            <p className="text-sm text-muted-foreground">
              Category · Metabolic & Fat Optimization
            </p>
          </div>

          <div className="space-y-2">
            <Line w="w-3/4" />
            <Line w="w-2/3" />
            <Line w="w-1/2" />
          </div>

          {/* Region selector */}
          <Box className="h-12" label="region selector">
            Select region ▾
          </Box>

          {/* Variant selector */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Select Variant
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Box className="h-16" label="variant">
                6mg — $XXX.XX
              </Box>
              <Box className="h-16" label="variant">
                12mg — $XXX.XX
              </Box>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between border-t border-dashed border-foreground/30 pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-3xl font-semibold">$XXX.XX</p>
              <p className="text-[10px] text-muted-foreground">
                * Reference price in USD
              </p>
            </div>
            <Box className="h-12 w-40" label="primary cta">
              Add to Cart
            </Box>
          </div>

          {/* Secondary CTA */}
          <Box className="h-12" label="secondary cta">
            Contact Us to Arrange Delivery
          </Box>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { t: "Quality Guaranteed", s: "Medical-grade" },
              { t: "24/7 Support", s: "Expert help" },
              { t: "Fast Shipping", s: "2–3 days" },
            ].map((b) => (
              <Box key={b.t} className="h-20 flex-col" label="badge">
                <div className="text-center">
                  <p className="text-xs font-medium">{b.t}</p>
                  <p className="text-[10px] text-muted-foreground">{b.s}</p>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* Dosage info row */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold mb-4">Dosage Instructions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { t: "Dosage", s: "2–8 mg / week" },
            { t: "Frequency", s: "Once per week" },
            { t: "Pen Duration", s: "1 pen ≈ 21 days" },
            { t: "Pens Required", s: "8 pens / course" },
          ].map((d) => (
            <Box key={d.t} className="h-24 flex-col" label="stat">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {d.t}
                </p>
                <p className="text-sm font-medium mt-1">{d.s}</p>
              </div>
            </Box>
          ))}
        </div>
      </section>

      {/* Video + tabs */}
      <section className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Box className="aspect-video lg:col-span-2" label="video">
          ▶ How to Use Peptide Pen
        </Box>
        <div className="space-y-3">
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
            <Box key={l} className="h-10" label="link">
              {l}
            </Box>
          ))}
        </div>
      </section>

      {/* Long-form content */}
      <section className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {[
          "What is [Peptide]?",
          "How does it work?",
          "Research & Clinical Trials",
          "Benefits and Applications",
          "Possible Side Effects",
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
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-lg font-semibold mb-4">Compare Variants</h3>
        <Box className="h-48" label="comparison table">
          Table: Variant · Units · Dose per unit · Price
        </Box>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-lg font-semibold mb-4">FAQ</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} className="h-14" label={`faq ${i}`}>
              Question {i} ▾
            </Box>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <Box className="p-6" label="disclaimer">
          <p className="text-xs text-muted-foreground text-center">
            Research Use Only — not intended to diagnose, treat, or prevent any
            medical conditions.
          </p>
        </Box>
      </section>

      {/* Footer */}
      <footer className="border-t border-dashed border-foreground/30 mt-8">
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
              © Peptide Pen — Wireframe
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
