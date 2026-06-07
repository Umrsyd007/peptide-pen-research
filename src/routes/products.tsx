import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All Products | Research Peptides Catalog" },
      {
        name: "description",
        content:
          "Browse our full catalog of research peptides, longevity compounds, and wellness protocols. For research use only.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "All Products | Research Peptides Catalog" },
      {
        property: "og:description",
        content:
          "Full catalog of research peptides, longevity compounds, and wellness protocols.",
      },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

type Tag = "NEW" | "BESTSELLER" | null;

interface Product {
  id: string;
  name: string;
  categories: string;
  price: string;
  tag: Tag;
}

const PRODUCTS: Product[] = [
  { id: "72d3cbf2", name: "AC-Selank-nH2", categories: "Cognitive & Neuro • Cellular Longevity", price: "$126.44", tag: "NEW" },
  { id: "5696aeb5", name: "Glutathione + Methylene Blue", categories: "Cellular Longevity", price: "$220.40", tag: "NEW" },
  { id: "eaee73bb", name: "Microbiome Test", categories: "Cognitive & Neuro +6", price: "$406.00", tag: "NEW" },
  { id: "d2a5603b", name: "KPV Peptide (Nasal Spray)", categories: "Cellular Longevity • Immune & Inflammation", price: "$97.44", tag: "NEW" },
  { id: "75eaa7ac", name: "Melanotan 2 (Nasal Spray)", categories: "Cognitive & Neuro • Aesthetics & Regenerative", price: "$81.20", tag: "NEW" },
  { id: "db401164", name: "Nootropic P21 (Nasal Spray)", categories: "Cognitive & Neuro • Cellular Longevity", price: "$142.68", tag: "NEW" },
  { id: "68831782", name: "SS-31 (Elamipretide)", categories: "Cellular Longevity +2", price: "$223.88", tag: "NEW" },
  { id: "f5aa4333", name: "Tesamorelin", categories: "Cellular Longevity +2", price: "$162.40", tag: "NEW" },
  { id: "591b5bd3", name: "Kisspeptin", categories: "Hormonal & Reproductive", price: "$110.20", tag: "NEW" },
  { id: "c89a10d5", name: "CJC 1295 no Dac + Ipamorelin", categories: "Cellular Longevity • Muscle & Recovery", price: "$146.16", tag: "NEW" },
  { id: "e6a824f0", name: "Thymosin Alpha-1", categories: "Cellular Longevity • Immune & Inflammation", price: "$146.16", tag: "NEW" },
  { id: "821f7789", name: "Thymalin", categories: "Cellular Longevity • Immune & Inflammation", price: "$100.92", tag: "NEW" },
  { id: "a973f518", name: "SLU-PP-332", categories: "Cognitive & Neuro", price: "$145.00", tag: "NEW" },
  { id: "f2a12dcf", name: "Specialized Wellness Consultation", categories: "Cognitive & Neuro +7", price: "$174.00", tag: "NEW" },
  { id: "f76b7c74", name: "Personalized Gut Optimization Protocol", categories: "Cognitive & Neuro +6", price: "$812.00", tag: "NEW" },
  { id: "94badb0f", name: "DNA Test", categories: "Cognitive & Neuro +7", price: "$464.00", tag: "NEW" },
  { id: "aff029b8", name: "Ipamorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$74.24", tag: "BESTSELLER" },
  { id: "e794817e", name: "BPC-157", categories: "Muscle & Recovery", price: "$96.28", tag: "BESTSELLER" },
  { id: "08f6ee52", name: "Retatrutide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$307.40", tag: "BESTSELLER" },
  { id: "46f6d800", name: "Melanotan II", categories: "Aesthetics & Regenerative • Hormonal & Reproductive", price: "$88.16", tag: "BESTSELLER" },
  { id: "3afd37de", name: "Skin Glow (GHK-Cu) (Standard Pen)", categories: "Aesthetics & Regenerative", price: "$107.88", tag: "BESTSELLER" },
  { id: "cd1d9cc4", name: "Somatropin HGH", categories: "Muscle & Recovery", price: "$133.40", tag: "BESTSELLER" },
  { id: "9a7347e7", name: "TB 500 (Thymosin beta 4)", categories: "Muscle & Recovery • Aesthetics & Regenerative", price: "$97.44", tag: "BESTSELLER" },
  { id: "eca4f03d", name: "BPC-157 + TB-500", categories: "Cellular Longevity +2", price: "$170.52", tag: "BESTSELLER" },
  { id: "1691332d", name: "Epitalon", categories: "Cellular Longevity • Aesthetics & Regenerative", price: "$99.76", tag: "BESTSELLER" },
  { id: "c777ccf6", name: "Spermidine", categories: "Cognitive & Neuro • Cellular Longevity", price: "$99.76", tag: "BESTSELLER" },
  { id: "b8597fa0", name: "MOTS-c (Standard Pen)", categories: "Cellular Longevity • Metabolic & Fat Optimization", price: "$104.40", tag: "BESTSELLER" },
  { id: "ad69b7ac", name: "Glutathione, NAD+ & Resveratrol", categories: "Cognitive & Neuro +2", price: "$276.08", tag: "BESTSELLER" },
  { id: "7389ae0d", name: "Vitality Complex (Glutathione + NMN + Resveratrol)", categories: "Cellular Longevity", price: "$295.80", tag: "BESTSELLER" },
  { id: "474ae481", name: "Delta-Sleep-Inducing Peptide", categories: "Cognitive & Neuro", price: "$133.40", tag: "BESTSELLER" },
  { id: "322e88af", name: "Semaglutide (Standard Pen)", categories: "Aesthetics & Regenerative • Metabolic & Fat Optimization", price: "$153.12", tag: "BESTSELLER" },
  { id: "c1680f7a", name: "HGH Fragment (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$80.04", tag: null },
  { id: "65df5f32", name: "CJC 1295 (no dac)", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$97.44", tag: null },
  { id: "1b0959b6", name: "Tirzepatide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$174.00", tag: null },
  { id: "f386281f", name: "5-Amino-1MQ", categories: "Cognitive & Neuro • Metabolic & Fat Optimization", price: "$107.88", tag: null },
  { id: "080bb4c4", name: "NAD+ (Nicotinamide)", categories: "Cognitive & Neuro +2", price: "$366.56", tag: null },
  { id: "357579fd", name: "PT 141 (Bremelanotide)", categories: "Hormonal & Reproductive", price: "$97.44", tag: null },
  { id: "6aa9fd75", name: "Sermorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$124.12", tag: null },
  { id: "4a666b8b", name: "HCG Choriomon (Standard Pen)", categories: "Hormonal & Reproductive", price: "$61.48", tag: null },
  { id: "6587dd72", name: "IGF-1LR3", categories: "Muscle & Recovery", price: "$141.52", tag: null },
  { id: "04317a6e", name: "NMN (Nicotinamide Mononucleotide)", categories: "Cognitive & Neuro • Cellular Longevity", price: "$145.00", tag: null },
  { id: "21059df6", name: "Curcumin", categories: "Cognitive & Neuro • Cellular Longevity", price: "$149.64", tag: null },
];

function TagBadge({ tag }: { tag: Tag }) {
  if (!tag) return null;
  const cls =
    tag === "NEW"
      ? "bg-primary text-primary-foreground"
      : "bg-accent text-accent-foreground";
  return (
    <span
      className={`absolute top-3 right-3 text-[10px] font-semibold tracking-wider px-2 py-1 rounded ${cls}`}
    >
      {tag}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-muted flex items-center justify-center border-b border-border">
        <TagBadge tag={product.tag} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-12 h-12 opacity-40"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-xs uppercase tracking-wider opacity-60">
            Product image
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-foreground leading-tight">
            {product.name}
          </h2>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.categories}
          </p>
        </div>
        <p className="text-lg font-bold text-foreground mt-auto">
          {product.price}
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="w-full text-sm font-medium px-3 py-2 rounded border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            View Details
          </button>
          <button
            type="button"
            className="w-full text-sm font-medium px-3 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Contact Us to Order
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-dashed border-foreground/30" role="banner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link to="/" aria-label="Peptide Pen Research home" className="text-base sm:text-lg font-bold tracking-tight shrink-0">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8" role="main">
        <div className="flex flex-col gap-4 mb-8">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Products</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">All Products</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {PRODUCTS.length} products available
              </p>
            </div>
            <button
              type="button"
              className="text-sm px-4 py-2 rounded border border-border bg-card hover:bg-muted transition-colors"
            >
              Filter & Sort
            </button>
          </div>

          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Prices are displayed
            in USD for your convenience. All payments will be processed in EUR at
            checkout. For research use only.
          </div>
        </div>

        <section
          aria-label="Product catalog"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      </main>

      <footer className="border-t border-dashed border-foreground/30 mt-16 py-8" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Peptide Pen Research — Research use only. Not for
          human or veterinary consumption.
        </div>
      </footer>
    </div>
  );
}
