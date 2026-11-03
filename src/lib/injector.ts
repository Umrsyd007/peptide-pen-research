// The products sold on the store. Prices are in GBP and are the
// source of truth for what customers are charged.
export const CURRENCY = "GBP";

export interface InjectorVariant {
  sku: string;
  name: string;
  price: number;
  note: string;
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
    title: "Needle-Free Injector — Single £164 or 2-Pack £230 | PeptidePen",
    description:
      "Order the reusable needle-free injector. Comes with nozzles, adapters and a carry case. Free UK delivery in 3–7 days.",
    variants: [
      { sku: "single", name: "Single", price: 164, note: "One device with starter kit" },
      { sku: "two-pack", name: "2-Pack", price: 230, note: "Two devices — save £98" },
    ],
  },
  {
    // Second variation. Placeholder copy — build out the page content later.
    id: "1b0959b6",
    name: "Needle-Free Injector — Variation",
    title: "Needle-Free Injector — £129.76 | PeptidePen",
    description:
      "Order the reusable needle-free injector. Comes with nozzles, adapters and a carry case. Free UK delivery in 3–7 days.",
    variants: [
      { sku: "single", name: "Single", price: 129.76, note: "One device with starter kit" },
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

export function formatGbp(n: number) {
  return new Intl.NumberFormat("en-GB", {
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
