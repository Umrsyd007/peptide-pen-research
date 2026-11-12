import { describe, it, expect } from "vitest";
import { convertGbp, isCurrency, currencyForCountry, pickInitialCurrency } from "./currency";

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
  it("only offers GBP, USD and EUR", () => {
    expect(isCurrency("EUR")).toBe(true);
    expect(isCurrency("JPY")).toBe(false);
  });
  it("picks currency from location", () => {
    expect(currencyForCountry("GB")).toBe("GBP");
    expect(currencyForCountry("DE")).toBe("EUR");
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry("JP")).toBe("USD");
    expect(currencyForCountry(null)).toBe("GBP");
  });
  it("a saved choice beats location", () => {
    expect(pickInitialCurrency("GBP", "US")).toBe("GBP");
    expect(pickInitialCurrency(null, "FR")).toBe("EUR");
  });
});
