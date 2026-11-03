import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { PRODUCT_ID } from "@/lib/injector";

export const BRAND = "PeptidePen";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="bg-foreground text-background text-[11px] font-medium tracking-wider uppercase">
        <p className="max-w-6xl mx-auto px-4 py-2 text-center">Free UK delivery · Ships in 3–7 days</p>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2" aria-label={`${BRAND} home`}>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-black">P</span>
            <span className="text-lg font-black tracking-tight uppercase">{BRAND}</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
            <Link to="/products/$productId" params={{ productId: PRODUCT_ID }} className="px-3 py-2 text-sm font-semibold rounded-full hover:bg-muted">Shop</Link>
            <Link to="/contact" className="hidden sm:inline-flex px-3 py-2 text-sm font-semibold rounded-full hover:bg-muted">Contact</Link>
            <CartDrawer />
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <span className="font-black uppercase tracking-tight">{BRAND}</span>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-background/70">
            <Link to="/contact" className="hover:text-background">Contact</Link>
            <Link to="/refund-policy" className="hover:text-background">Refund Policy</Link>
            <Link to="/terms-of-service" className="hover:text-background">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-background">Privacy Policy</Link>
            <a href="mailto:hello@getpeptidepen.com" className="hover:text-background">hello@getpeptidepen.com</a>
          </div>
          <p className="text-background/60 text-xs">© {new Date().getFullYear()} {BRAND}</p>
        </div>
      </footer>
    </div>
  );
}
