import { describe, it, expect } from "vitest";
import { PRODUCTS, getLivePrice } from "./products";
import { refreshCartPrices } from "@/stores/cart";

describe("one price everywhere", () => {
  it("listing price equals the default size price", () => {
    for (const p of PRODUCTS) {
      const live = getLivePrice(p.id);
      if (live !== undefined) expect(p.price).toBe(`£${live.toFixed(2)}`);
    }
    expect(PRODUCTS.find((p) => p.id === "08f6ee52")?.price).toBe("£123.00");
  });
  it("saved cart lines are re-priced and stale lines dropped", () => {
    const base = { title: "x", image: null, quantity: 1 };
    const out = refreshCartPrices([
      { ...base, variantId: "a", productId: "08f6ee52", variantTitle: "60mg", price: { amount: "606.68", currencyCode: "GBP" } },
      { ...base, variantId: "b", productId: "08f6ee52", variantTitle: "999mg", price: { amount: "1", currencyCode: "GBP" } },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].price.amount).toBe("259.00");
  });
});
