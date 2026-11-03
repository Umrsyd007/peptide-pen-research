import { describe, expect, it } from "vitest";
import { priceForLine, PRODUCT_ID } from "./injector";

describe("injector prices", () => {
  it("single is £164 → $208.58", () => {
    expect(priceForLine(PRODUCT_ID, "Single")).toBe(208.58);
  });
  it("2-pack is £230 → $292.51", () => {
    expect(priceForLine(PRODUCT_ID, "2-Pack")).toBe(292.51);
  });
  it("PeptiCool is £129.76 → $165.03", () => {
    expect(priceForLine("1b0959b6", "Single")).toBe(165.03);
  });
  it("old peptide products can't be ordered", () => {
    expect(priceForLine("08f6ee52", "60mg")).toBeNull();
  });
});
