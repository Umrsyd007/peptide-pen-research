import { describe, it, expect } from "vitest";
import { applyDiscount, contactSchema, normalizePhone } from "./checkout-rules";

describe("checkout rules", () => {
  it("accepts international phone numbers", () => {
    expect(normalizePhone("+44 7700 900123")).toBe("+447700900123");
    expect(normalizePhone("1 (630) 605-7613")).toBe("16306057613");
  });
  it("rejects too-short or non-numeric phones", () => {
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("call me")).toBeNull();
  });
  it("requires a valid email", () => {
    const base = { name: "Jane Doe", phone: "+447700900123" };
    expect(contactSchema.safeParse({ ...base, email: "jane@" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, email: "jane@example" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, email: "jane@example.com" }).success).toBe(true);
  });
  it("requires name of at least 2 characters", () => {
    expect(contactSchema.safeParse({ name: "J", email: "a@b.co", phone: "+447700900123" }).success).toBe(false);
  });
  it("applies percent discounts", () => {
    expect(applyDiscount(179.99, 10)).toEqual({ discount: 18, total: 161.99 });
    expect(applyDiscount(50, 100)).toEqual({ discount: 50, total: 0 });
  });
});
