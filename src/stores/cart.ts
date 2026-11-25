// Local, persistent cart. Checkout is handled by our own orders.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PRODUCT_VARIANTS } from "@/lib/product-variants";

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
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
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
      drawerOpen: false,
      setDrawerOpen: (open) => set({ drawerOpen: open }),
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
          drawerOpen: true,
        });
      },
      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.min(50, quantity) } : i,
          ),
        });
      },
      removeItem: async (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "peptidepen-cart-v2",
      storage: createJSONStorage(() => localStorage),
      // Load saved cart after hydration so server and first client render match.
      skipHydration: true,
      partialize: (s) => ({ items: s.items }),
      merge: (persisted, current) => ({
        ...current,
        items: refreshCartPrices((persisted as { items?: CartItem[] } | undefined)?.items ?? []),
      }),
    },
  ),
);
