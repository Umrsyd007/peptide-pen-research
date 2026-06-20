// Persistent cart store backed by Shopify Storefront API.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  addLineToShopifyCart,
  createShopifyCart,
  fetchShopifyCart,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
} from "@/lib/shopify/cart-api";

export interface CartItem {
  lineId: string | null;
  variantId: string; // gid://shopify/ProductVariant/...
  productId: string; // local product id (for routing)
  productHandle?: string;
  title: string; // product title
  variantTitle: string;
  image: string | null;
  price: { amount: string; currencyCode: string };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  getCheckoutUrl: () => string | null;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existing = items.find((i) => i.variantId === item.variantId);

        set({ isLoading: true });
        try {
          if (!cartId) {
            const res = await createShopifyCart({
              variantId: item.variantId,
              quantity: item.quantity,
            });
            if (res) {
              set({
                cartId: res.cartId,
                checkoutUrl: res.checkoutUrl,
                items: [{ ...item, lineId: res.lineId }],
              });
            }
          } else if (existing) {
            if (!existing.lineId) return;
            const newQty = existing.quantity + item.quantity;
            const res = await updateShopifyCartLine(
              cartId,
              existing.lineId,
              newQty,
            );
            if (res.success) {
              set({
                items: get().items.map((i) =>
                  i.variantId === item.variantId
                    ? { ...i, quantity: newQty }
                    : i,
                ),
              });
            } else if (res.cartNotFound) {
              clearCart();
            }
          } else {
            const res = await addLineToShopifyCart(cartId, {
              variantId: item.variantId,
              quantity: item.quantity,
            });
            if (res.success) {
              set({
                items: [
                  ...get().items,
                  { ...item, lineId: res.lineId ?? null },
                ],
              });
            } else if (res.cartNotFound) {
              clearCart();
            }
          }
        } catch (e) {
          console.error("Add to cart failed", e);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const res = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (res.success) {
            set({
              items: get().items.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i,
              ),
            });
          } else if (res.cartNotFound) clearCart();
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const res = await removeLineFromShopifyCart(cartId, item.lineId);
          if (res.success) {
            const next = get().items.filter((i) => i.variantId !== variantId);
            if (next.length === 0) clearCart();
            else set({ items: next });
          } else if (res.cartNotFound) {
            clearCart();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const cart = await fetchShopifyCart(cartId);
          if (cart === null) return;
          if (cart.totalQuantity === 0) {
            clearCart();
          } else if (cart.checkoutUrl) {
            set({ checkoutUrl: cart.checkoutUrl });
          }
        } catch (e) {
          console.error("Cart sync failed", e);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "peptidepen-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        cartId: s.cartId,
        checkoutUrl: s.checkoutUrl,
      }),
    },
  ),
);
