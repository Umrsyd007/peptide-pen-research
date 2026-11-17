import { describe, expect, it } from "vitest";
import { getPaymentLink } from "./payment-link";

const LINK = "https://whop.com/checkout/plan_88k7Fcp3yNQYy";
const ret20 = { product_id: "08f6ee52", variant: "20mg" };
const base = { currency: "GBP", ship_country: "United Kingdom", order_items: [ret20, ret20] };

describe("getPaymentLink", () => {
  it("UK + GBP + only Retatrutide 20mg gets the Whop link", () => expect(getPaymentLink(base)).toBe(LINK));
  it("USD order gets none", () => expect(getPaymentLink({ ...base, currency: "USD" })).toBeNull());
  it("US address gets none", () => expect(getPaymentLink({ ...base, ship_country: "United States" })).toBeNull());
  it("60mg gets none", () => expect(getPaymentLink({ ...base, order_items: [{ product_id: "08f6ee52", variant: "60mg" }] })).toBeNull());
  it("mixed cart gets none", () => expect(getPaymentLink({ ...base, order_items: [ret20, { product_id: "080bb4c4", variant: "500mg" }] })).toBeNull());
});
