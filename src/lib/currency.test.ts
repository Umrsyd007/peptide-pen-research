import { describe, it, expect } from "vitest";
import { convertUsd, currencyForLocale } from "./currency";

describe("local currency", () => {
  it("converts USD with the latest rate", () => {
    expect(convertUsd(100, "EUR", { EUR: 0.9 })).toEqual({ amount: 90, currency: "EUR" });
  });
  it("falls back to USD when no rate is available", () => {
    expect(convertUsd(100, "EUR", null)).toEqual({ amount: 100, currency: "USD" });
  });
  it("picks currency from the visitor's region", () => {
    expect(currencyForLocale("en-GB")).toBe("GBP");
    expect(currencyForLocale("de-DE")).toBe("EUR");
    expect(currencyForLocale("en")).toBe("USD");
  });
});
