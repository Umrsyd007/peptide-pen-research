import { createFileRoute, Link } from "@tanstack/react-router";

const BRAND = "PeptidePen";
const PAGE_TITLE = `Refund Policy | ${BRAND}`;

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: "Refund and return policy for PeptidePen products." },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: "Refund and return policy for PeptidePen products." },
      { property: "og:url", content: "https://getpeptidepen.com/refund-policy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/refund-policy" }],
  }),
});

function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Promo strip */}
      <div className="bg-foreground text-background text-[11px] font-medium tracking-wider uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Lab-Grade Peptides · Batch-Matched COAs · Cold-Chain Shipping
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" aria-label={`${BRAND} home`} className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#EF2A2A] text-white font-bold text-lg shrink-0">P</span>
            <span className="text-base sm:text-lg font-black tracking-tight uppercase">{BRAND}</span>
          </Link>
          <nav className="hidden md:flex gap-1 items-center rounded-full border border-border bg-card px-2 py-1" aria-label="Primary">
            <Link to="/products" className="px-4 py-2 text-sm font-medium rounded-full hover:bg-muted transition-colors">
              Products
            </Link>
            <a href="/" className="px-4 py-2 text-sm font-medium rounded-full hover:bg-muted transition-colors">
              Home
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="hidden sm:inline-flex h-10 px-5 items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Shop Now <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Refund Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            At {BRAND}, we stand behind the quality of our research-grade peptide pens. If you are not satisfied with your order, we offer a straightforward refund and return process subject to the terms below.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Eligibility for Refunds</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80 leading-relaxed">
            <li>Items must be returned within 30 days of delivery.</li>
            <li>Products must be unopened, unused, and in their original packaging with seals intact.</li>
            <li>Due to the nature of research compounds, opened or tampered items are not eligible for refund.</li>
            <li>Custom or bulk orders may not be eligible for standard refunds — contact us before ordering.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">How to Request a Refund</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            To initiate a return, email us at{" "}
            <a href="mailto:hello@getpeptidepen.com" className="underline hover:text-primary">hello@getpeptidepen.com</a>{" "}
            with your order number and reason for return. We will respond within 2 business days with return instructions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Shipping Costs</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Original shipping charges are non-refundable. Return shipping costs are the responsibility of the customer unless the return is due to our error (wrong item shipped, damaged in transit, or defective product).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Processing Time</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Once we receive and inspect your return, we will process your refund within 5–7 business days. Refunds are issued to the original payment method.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Damaged or Incorrect Orders</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            If your order arrives damaged or you receive the wrong product, contact us within 48 hours of delivery with photos of the item and packaging. We will arrange a replacement or full refund at no cost to you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Contact</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            For any refund or return questions, reach us at{" "}
            <a href="mailto:hello@getpeptidepen.com" className="underline hover:text-primary">hello@getpeptidepen.com</a>.
          </p>
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
              <li><a href="/" className="text-sm text-background/70 hover:text-background">Home</a></li>
              <li><Link to="/contact" className="text-sm text-background/70 hover:text-background">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-widest font-black text-primary">Legal</p>
            <ul className="space-y-1.5 list-none p-0">
              <li><Link to="/refund-policy" className="text-sm text-background/70 hover:text-background">Refund Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-sm text-background/70 hover:text-background">Terms of Service</Link></li>
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
