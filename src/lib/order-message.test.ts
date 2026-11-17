import { describe, expect, it } from "vitest";
import { buildOrderMessage } from "./order-message";

const fmt = (n: number, c: string) => `${c} ${n.toFixed(2)}`;
const order = { order_number: "482913", total: 300, currency: "GBP", order_items: [{ qty: 2, name: "Pen", variant: "20mg", price: 150 }] };

describe("buildOrderMessage", () => {
  it("lists items and total", () => {
    const m = buildOrderMessage(order, "card", fmt);
    expect(m).toContain("Order #482913");
    expect(m).toContain("2x Pen 20mg GBP 300.00");
    expect(m).toContain("Total GBP 300.00");
  });
  it("card asks for payment link", () => {
    expect(buildOrderMessage(order, "card", fmt)).toContain("Payment method: Card / Payment Link\n____________________\nPlease send the secure payment link for this order.");
  });
  it("bank asks for bank details", () => {
    expect(buildOrderMessage(order, "bank", fmt)).toMatch(/bank transfer details for this order\.$/);
  });
  it("usdt asks for wallet", () => {
    expect(buildOrderMessage(order, "usdt", fmt)).toMatch(/USDT wallet address and amount for this order\.$/);
  });
  it("whatsapp arranges payment", () => {
    expect(buildOrderMessage(order, "whatsapp", fmt)).toMatch(/arrange payment for this order\.$/);
  });
});
