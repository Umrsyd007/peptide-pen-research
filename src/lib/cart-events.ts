// Pure helpers for cart activity logging (shared by server fn and tests).
import { PRODUCT_VARIANTS } from "@/lib/product-variants";

/** Shopper IP from trusted edge headers only; never from the browser body. */
export function clientIpFrom(get: (name: string) => string | null | undefined): string | null {
  const cf = get("cf-connecting-ip")?.trim();
  if (cf) return cf.slice(0, 64);
  const xff = get("x-forwarded-for")?.split(",")[0]?.trim();
  return xff ? xff.slice(0, 64) : null;
}

/** Catalog GBP price for a product/variant, or null when it doesn't exist. */
export function catalogPrice(productId: string, variant: string): number | null {
  return PRODUCT_VARIANTS[productId]?.find((v) => v.name === variant)?.priceNum ?? null;
}

export const CART_EVENTS_PER_MINUTE = 60;
