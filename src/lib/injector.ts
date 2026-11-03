// The products sold on the store. List prices are set in GBP; customers are
// charged in USD (the store currency), converted at a fixed rate below.
// Stripe Adaptive Pricing then presents the charge in the buyer's local
// currency at checkout. `price` (USD) is the source of truth for charges.
export const CURRENCY = "USD";

/** Fixed GBP→USD rate. 1.2718 reproduces the earlier £164 → $208.58 charge. */
export const GBP_TO_USD = 1.2718;

/** Converts a GBP list price to the USD amount we charge, rounded to cents. */
export function gbpToUsd(gbp: number) {
  return Math.round(gbp * GBP_TO_USD * 100) / 100;
}

export interface InjectorVariant {
  sku: string;
  name: string;
  /** GBP list price (what the price is set in). */
  gbp: number;
  /** USD price charged at checkout, derived from `gbp`. */
  price: number;
  note: string;
}

function variant(sku: string, name: string, gbp: number, note: string): InjectorVariant {
  return { sku, name, gbp, price: gbpToUsd(gbp), note };
}

export interface InjectorProduct {
  id: string;
  name: string;
  /** SEO + social title for the product page <head>. */
  title: string;
  /** SEO + social description for the product page <head>. */
  description: string;
  variants: InjectorVariant[];
}

export const INJECTOR_PRODUCTS: InjectorProduct[] = [
  {
    id: "08f6ee52",
    name: "Needle-Free Injector",
    title: "Needle-Free Injector — Single or 2-Pack | PeptidePen",
    description:
      "A reusable needle-free injector that delivers with a fast, narrow stream instead of a needle. Kit includes sterile nozzles, adapters and a carry case. Free delivery.",
    variants: [
      variant("single", "Single", 164, "One device with starter kit"),
      variant("two-pack", "2-Pack", 230, "Two devices — save 30%"),
    ],
  },
  {
    // PeptiCool travel cooler — page design lives in src/components/pepticool-page.tsx.
    id: "1b0959b6",
    name: "PeptiCool™ — GLP-1 & Vial Travel Cooler",
    title: "PeptiCool™ — GLP-1 & Vial Travel Cooler | PeptidePen",
    description:
      "Active cooling for GLP-1 pens and vials: precise 2–8°C, touchscreen readout, USB-C power and 7–9 hrs cordless. No ice packs.",
    variants: [
      variant("single", "Single", 129.76, "One device with starter kit"),
    ],
  },
];

/** Look up a sellable product by its id (which is also its URL slug). */
export function getInjectorProduct(id: string): InjectorProduct | undefined {
  return INJECTOR_PRODUCTS.find((p) => p.id === id);
}

// Featured product — what the home page, nav and the /products redirect point at.
const FEATURED = INJECTOR_PRODUCTS[0];
export const PRODUCT_ID = FEATURED.id;
export const PRODUCT_NAME = FEATURED.name;
export const VARIANTS = FEATURED.variants;

export function findVariant(product: InjectorProduct, name: string): InjectorVariant | undefined {
  return product.variants.find((v) => v.name === name || v.sku === name);
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}

/** Returns the catalog price for a cart line, or null if it isn't sellable. */
export function priceForLine(productId: string, variant: string): number | null {
  const product = getInjectorProduct(productId);
  if (!product) return null;
  return findVariant(product, variant)?.price ?? null;
}
