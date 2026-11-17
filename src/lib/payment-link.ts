import { WHOP_LINK_GBP_20MG, WHOP_LINK_GBP_60MG } from "@/lib/store-contact";

export const RETATRUTIDE_ID = "08f6ee52";

type LinkOrder = {
  currency?: string | null;
  ship_country?: string | null;
  order_items: { product_id?: string | null; variant?: string | null }[];
};

/** Automatic payment link: UK delivery, GBP, cart is only Retatrutide 20mg, or only 60mg. */
export function getPaymentLink(o: LinkOrder): string | null {
  const uk = ["united kingdom", "uk", "gb", "great britain"].includes((o.ship_country ?? "").trim().toLowerCase());
  if (!uk || o.currency !== "GBP" || o.order_items.length === 0) return null;
  const all = (v: string) => o.order_items.every((i) => i.product_id === RETATRUTIDE_ID && i.variant === v);
  if (all("20mg")) return WHOP_LINK_GBP_20MG;
  if (all("60mg")) return WHOP_LINK_GBP_60MG;
  return null;
}

export const itemCountLabel = (items: { qty: number }[]) => {
  const n = items.reduce((s, i) => s + i.qty, 0);
  return `${n} item${n === 1 ? "" : "s"}`;
};
