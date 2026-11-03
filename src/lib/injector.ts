// The single product sold on the store. Prices are in GBP and are the
// source of truth for what customers are charged.
export const PRODUCT_ID = "08f6ee52";
export const PRODUCT_NAME = "Needle-Free Injector";
export const CURRENCY = "GBP";

export interface InjectorVariant {
  sku: string;
  name: string;
  price: number;
  note: string;
}

export const VARIANTS: InjectorVariant[] = [
  { sku: "single", name: "Single", price: 164, note: "One device with starter kit" },
  { sku: "two-pack", name: "2-Pack", price: 230, note: "Two devices — save £98" },
];

export function findVariant(name: string): InjectorVariant | undefined {
  return VARIANTS.find((v) => v.name === name || v.sku === name);
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
  if (productId !== PRODUCT_ID) return null;
  return findVariant(variant)?.price ?? null;
}
