import { describe, expect, it } from "vitest";
import { priceForLine, PRODUCT_ID } from "./injector";

describe("injector prices", () => {
  it("single is £164 → $220.01", () => {
    expect(priceForLine(PRODUCT_ID, "Single")).toBe(220.01);
  });
  it("2-pack is £230 → $308.54", () => {
    expect(priceForLine(PRODUCT_ID, "2-Pack")).toBe(308.54);
  });
  it("PeptiCool is £129.76 → $174.07", () => {
    expect(priceForLine("1b0959b6", "Single")).toBe(174.07);
  });
  it("old peptide products can't be ordered", () => {
    expect(priceForLine("08f6ee52", "60mg")).toBeNull();
  });
});
