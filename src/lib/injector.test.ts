import { describe, expect, it } from "vitest";
import { priceForLine, PRODUCT_ID } from "./injector";

describe("injector prices", () => {
  it("single costs £164", () => {
    expect(priceForLine(PRODUCT_ID, "Single")).toBe(164);
  });
  it("2-pack costs £230", () => {
    expect(priceForLine(PRODUCT_ID, "2-Pack")).toBe(230);
  });
  it("old peptide products can't be ordered", () => {
    expect(priceForLine("08f6ee52", "60mg")).toBeNull();
  });
});
