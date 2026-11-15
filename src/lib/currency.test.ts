import { describe, it, expect } from "vitest";
import { convertGbp, isCurrency, currencyForCountry } from "./currency";

describe("currency", () => {
  it("GBP prices are charged as-is", () => {
    expect(convertGbp(123, "GBP", { USD: 1.3 })).toEqual({ amount: 123, currency: "GBP" });
  });
  it("converts GBP to the chosen currency, rounded to cents", () => {
    expect(convertGbp(123, "USD", { USD: 1.3333 })).toEqual({ amount: 164, currency: "USD" });
  });
  it("falls back to GBP when no rate is available", () => {
    expect(convertGbp(100, "EUR", null)).toEqual({ amount: 100, currency: "GBP" });
  });
  it("offers CAD and AUD", () => {
    expect(isCurrency("CAD")).toBe(true);
    expect(isCurrency("AUD")).toBe(true);
  });
  it("defaults currency from visitor country", () => {
    expect(currencyForCountry("CA")).toBe("CAD");
    expect(currencyForCountry("AU")).toBe("AUD");
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry("DE")).toBe("EUR");
    expect(currencyForCountry("GB")).toBe("GBP");
    expect(currencyForCountry(null)).toBe("GBP");
  });
  it("rejects unsupported currencies", () => {
    expect(isCurrency("EUR")).toBe(true);
    expect(isCurrency("JPY")).toBe(false);
  });
});
