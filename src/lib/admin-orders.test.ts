import { describe, it, expect } from "vitest";
import { summarizeOrders } from "./admin-orders";

describe("summarizeOrders", () => {
  const orders = [
    { status: "paid", total: 165.29, items: 1 },
    { status: "paid", total: 347.63, items: 2 },
    { status: "pending", total: 100, items: 1 },
    { status: "failed", total: 500, items: 3 },
  ];
  it("revenue and items count only paid orders", () => {
    const s = summarizeOrders(orders);
    expect(s.revenue).toBe(512.92);
    expect(s.paidOrders).toBe(2);
    expect(s.itemsOrdered).toBe(3);
  });
  it("pending value counts only pending orders", () => {
    const s = summarizeOrders(orders);
    expect(s.pendingValue).toBe(100);
    expect(s.pendingCount).toBe(1);
  });
});
