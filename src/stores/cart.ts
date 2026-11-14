// Local, persistent cart. Checkout is handled by our own orders + Stripe.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PRODUCT_VARIANTS } from "@/lib/product-variants";
import { logCartEvent } from "@/lib/cart-events.functions";

/** Persistent anonymous cart session id (shared with checkout). */
export function getCartSessionId(): string {
  const k = "peptidepen-cart-session";
  let id = localStorage.getItem(k);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(k, id); }
  return id;
}

function track(type: "add" | "update" | "remove", item: CartItem, qty: number, items: CartItem[]) {
  if (typeof window === "undefined") return;
  (async () => {
    let userId: string | null = null;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      userId = (await supabase.auth.getSession()).data.session?.user.id ?? null;
    } catch { /* anonymous */ }
    await logCartEvent({ data: {
      sessionId: getCartSessionId(), userId, type,
      productId: item.productId, variant: item.variantTitle, qty, currency: "GBP",
      cart: items.map((i) => ({ productId: i.productId, variant: i.variantTitle, qty: i.quantity })),
    } });
  })().catch(() => {});
}

/** Re-price saved cart lines from the current catalog; drop lines that no longer exist. */
export function refreshCartPrices(items: CartItem[]): CartItem[] {
  return items.flatMap((i) => {
    const v = PRODUCT_VARIANTS[i.productId]?.find((x) => x.name === i.variantTitle);
    if (!v) return [];
    return [{ ...i, price: { amount: v.priceNum.toFixed(2), currencyCode: "GBP" } }];
  });
}

export interface CartItem {
  variantId: string; // local key: `${productId}:${sku}`
  productId: string;
  title: string;
  variantTitle: string;
  image: string | null;
  price: { amount: string; currencyCode: string };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      addItem: async (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        set({
          items: existing
            ? items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: Math.min(50, i.quantity + item.quantity) }
                  : i,
              )
            : [...items, item],
        });
        track("add", item, item.quantity, get().items);
      },
      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.min(50, quantity) } : i,
          ),
        });
        const it = get().items.find((i) => i.variantId === variantId);
        if (it) track("update", it, it.quantity, get().items);
      },
      removeItem: async (variantId) => {
        const gone = get().items.find((i) => i.variantId === variantId);
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
        if (gone) track("remove", gone, 0, get().items);
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "peptidepen-cart-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      merge: (persisted, current) => ({
        ...current,
        items: refreshCartPrices((persisted as { items?: CartItem[] } | undefined)?.items ?? []),
      }),
    },
  ),
);
