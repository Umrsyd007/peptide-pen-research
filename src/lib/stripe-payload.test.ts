import { describe, it, expect } from "vitest";
import { buildStripePayload } from "./stripe-payload";

const order = { order_number: "482913", currency: "USD", shipping: 5 };
const items = [{ price: 165.29, qty: 2 }];
const p = buildStripePayload(order, items, "https://getpeptidepen.com");

describe("buildStripePayload", () => {
  it("sends a single generic line item with the order number", () => {
    expect(p.line_items).toHaveLength(1);
    expect(p.line_items[0].price_data.product_data).toEqual({ name: "Order #482913" });
  });
  it("folds shipping into the single total", () => {
    expect(p.line_items[0].price_data.unit_amount).toBe(33558);
  });
  it("carries only the order number as metadata", () => {
    expect(p.metadata).toEqual({ ref: "482913" });
  });
  it("sends no email, shipping or customer data", () => {
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/customer_email|shipping_options|@/);
  });
});
