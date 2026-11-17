import { describe, expect, it } from "vitest";
import { getPaymentLink } from "./payment-link";

const LINK = "https://whop.com/checkout/plan_88k7Fcp3yNQYy";
const ret20 = { product_id: "08f6ee52", variant: "20mg" };
const LINK60 = "https://whop.com/checkout/plan_sFt0ZFYouVjfj";
const ret60 = { product_id: "08f6ee52", variant: "60mg" };
const base = { currency: "GBP", ship_country: "United Kingdom", order_items: [ret20, ret20] };

describe("getPaymentLink", () => {
  it("UK + GBP + only Retatrutide 20mg gets the Whop link", () => expect(getPaymentLink(base)).toBe(LINK));
  it("USD order gets none", () => expect(getPaymentLink({ ...base, currency: "USD" })).toBeNull());
  it("US address gets none", () => expect(getPaymentLink({ ...base, ship_country: "United States" })).toBeNull());
  it("UK + GBP + only 60mg gets the 60mg link", () => expect(getPaymentLink({ ...base, order_items: [ret60, ret60] })).toBe(LINK60));
  it("60mg in USD gets none", () => expect(getPaymentLink({ ...base, currency: "USD", order_items: [ret60] })).toBeNull());
  it("60mg outside UK gets none", () => expect(getPaymentLink({ ...base, ship_country: "France", order_items: [ret60] })).toBeNull());
  it("20mg + 60mg mix gets none", () => expect(getPaymentLink({ ...base, order_items: [ret20, ret60] })).toBeNull());
  it("mixed cart gets none", () => expect(getPaymentLink({ ...base, order_items: [ret20, { product_id: "080bb4c4", variant: "500mg" }] })).toBeNull());
});
