import { describe, expect, it } from "vitest";
import { catalogPrice, clientIpFrom } from "./cart-events";
import { PRODUCT_VARIANTS } from "./product-variants";

describe("cart event logging", () => {
  it("takes the IP from the edge header first", () => {
    const h: Record<string, string> = { "cf-connecting-ip": "203.0.113.7", "x-forwarded-for": "10.0.0.1" };
    expect(clientIpFrom((n) => h[n])).toBe("203.0.113.7");
  });
  it("falls back to the first forwarded IP", () => {
    expect(clientIpFrom((n) => (n === "x-forwarded-for" ? "198.51.100.2, 10.0.0.1" : null))).toBe("198.51.100.2");
  });
  it("rejects unknown products", () => {
    expect(catalogPrice("nope", "1mg")).toBeNull();
  });
  it("prices known products from the catalog", () => {
    const v = PRODUCT_VARIANTS["08f6ee52"][0];
    expect(catalogPrice("08f6ee52", v.name)).toBe(v.priceNum);
  });
});
