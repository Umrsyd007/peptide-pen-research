import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import logoMark from "@/assets/logo-badge.png";

const BRAND = "PeptidePen Research";
const PAGE_TITLE = `Contact Us | ${BRAND}`;
const PAGE_DESCRIPTION =
  "Get in touch with PeptidePen Research. Email, business address, and support hours for research-grade peptide inquiries.";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: "https://getpeptidepen.com/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://getpeptidepen.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${BRAND}`,
          description: PAGE_DESCRIPTION,
          url: "https://getpeptidepen.com/contact",
          mainEntity: {
            "@type": "Organization",
            name: BRAND,
            email: "hello@getpeptidepen.com",
            url: "https://getpeptidepen.com/",
          },
        }),
      },
    ],
  }),
});

function ContactPage() {
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
            <img src={logoMark} alt="" width={32} height={32} className="h-9 w-9 rounded-xl object-cover" />
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Contact Us</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Have questions about our research-grade peptide pens, bulk lab pricing, or custom protocols? Our team is here to help.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Email</p>
                <p className="text-xs text-muted-foreground">General inquiries</p>
              </div>
            </div>
            <a
              href="mailto:hello@getpeptidepen.com"
              className="text-sm font-medium text-primary hover:underline break-all"
            >
              hello@getpeptidepen.com
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Support</p>
                <p className="text-xs text-muted-foreground">Order & shipping help</p>
              </div>
            </div>
            <a
              href="mailto:support@getpeptidepen.com"
              className="text-sm font-medium text-primary hover:underline break-all"
            >
              support@getpeptidepen.com
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Business Hours</p>
                <p className="text-xs text-muted-foreground">Response time</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Monday – Friday<br />
              9:00 AM – 6:00 PM CET<br />
              <span className="text-xs text-muted-foreground">We aim to respond within 24 hours.</span>
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Business Address</p>
                <p className="text-xs text-muted-foreground">Registered office</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              PeptidePen Research<br />
              {/* TODO: Replace with actual business address */}
              <span className="text-xs text-muted-foreground">Business address available upon request via email.</span>
            </p>
          </div>
        </div>

        {/* Inquiry Note */}
        <section className="rounded-2xl border border-border bg-muted/40 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">What we can help with</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Product specifications and COA requests
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Bulk and institutional lab pricing
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Custom blends and concentrations
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Shipping and cold-chain logistics
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Order status and tracking
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Research protocol guidance
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <img src={logoMark} alt="" width={32} height={32} className="h-8 w-8 object-contain rounded-md" />
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
