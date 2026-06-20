import { createFileRoute, Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark.png";

const BRAND = "Peptide Pen Research";
const PAGE_TITLE = `Terms of Service | ${BRAND}`;

export const Route = createFileRoute("/terms-of-service")({
  component: TermsOfServicePage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: "Terms of service for Peptide Pen Research." },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: "Terms of service for Peptide Pen Research." },
      { property: "og:url", content: "https://getpeptidepen.com/terms-of-service" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/terms-of-service" }],
  }),
});

function TermsOfServicePage() {
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
            <img src={logoMark} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="text-base sm:text-lg font-black tracking-tight uppercase">Peptide Pen Research</span>
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
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">1. Acceptance of Terms</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            By accessing or purchasing from {BRAND} ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or purchase our products.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">2. Research Use Only</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            All products sold by {BRAND} are intended strictly for in-vitro laboratory research purposes. They are not intended for human or veterinary consumption, diagnosis, treatment, or prevention of any disease. By purchasing, you acknowledge and agree that you will use these products only for lawful research purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">3. Eligibility</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            You must be at least 18 years old and legally able to enter into contracts to purchase from our store. By placing an order, you represent that you meet these requirements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">4. Orders & Payment</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including suspected fraud, unauthorized reselling, or violation of these terms. Prices are displayed in USD for convenience; payments are processed in EUR at checkout.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">5. Shipping & Delivery</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            We ship orders via cold-chain logistics to preserve product integrity. Delivery times are estimates and not guaranteed. Risk of loss and title for items pass to you upon delivery to the carrier.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">6. Returns & Refunds</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Please refer to our <Link to="/refund-policy" className="underline hover:text-primary">Refund Policy</Link> for detailed information about returns, exchanges, and refunds.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">7. Intellectual Property</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            All content on this website, including text, graphics, logos, and images, is the property of {BRAND} and is protected by copyright and trademark laws. You may not use, reproduce, or distribute any content without our express written permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">8. Limitation of Liability</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            To the fullest extent permitted by law, {BRAND} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our products or website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">9. Governing Law</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which {BRAND} operates, without regard to conflict of law principles.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">10. Changes to Terms</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            We reserve the right to update or modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of the website after any changes constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">11. Contact</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            For questions about these Terms of Service, please contact us at{" "}
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
              <li><a href="mailto:hello@getpeptidepen.com" className="text-sm text-background/70 hover:text-background">Contact</a></li>
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
