import { describe, it, expect } from "vitest";
import { contactSchema, isValidIntlPhone, normalizePhone } from "./checkout-rules";
import { isDisposableEmail, suggestEmail } from "./email-check";

const base = { name: "Jane Doe", email: "jane@example.com", phoneCountry: "GB", phone: "07911 123456" };

describe("checkout rules", () => {
  it("turns a local number plus country code into a full international number", () => {
    expect(normalizePhone("GB", "07911 123456")).toBe("+447911123456");
    expect(normalizePhone("US", "(212) 456-7890")).toBe("+12124567890");
    expect(normalizePhone("AU", "0412 345 678")).toBe("+61412345678");
  });
  it("rejects numbers that are wrong for the chosen country", () => {
    expect(normalizePhone("GB", "12345")).toBeNull();
    expect(normalizePhone("US", "call me")).toBeNull();
  });
  it("server only accepts full international numbers", () => {
    expect(isValidIntlPhone("+447911123456")).toBe(true);
    expect(isValidIntlPhone("07911123456")).toBe(false);
  });
  it("requires a valid email", () => {
    expect(contactSchema.safeParse({ ...base, email: "jane@" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, email: "jane@example" }).success).toBe(false);
    expect(contactSchema.safeParse(base).success).toBe(true);
  });
  it("requires name of at least 2 characters", () => {
    expect(contactSchema.safeParse({ ...base, name: "J" }).success).toBe(false);
  });
  it("suggests fixes for common email typos", () => {
    expect(suggestEmail("umar@gmil.com")).toBe("umar@gmail.com");
    expect(suggestEmail("umar@hotmial.com")).toBe("umar@hotmail.com");
    expect(suggestEmail("umar@gmail.com")).toBeNull();
  });
  it("flags throwaway inboxes", () => {
    expect(isDisposableEmail("x@mailinator.com")).toBe(true);
    expect(isDisposableEmail("x@gmail.com")).toBe(false);
  });
});
