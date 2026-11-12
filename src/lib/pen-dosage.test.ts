import { describe, it, expect } from "vitest";
import { calcPenDose } from "@/components/pen-dosage-calculator";

describe("pen dosage calculator", () => {
  it("20 mg pen, 2.5 mg dose = 15.625 units", () => {
    expect(calcPenDose(20, 2.5, 1)!.units).toBeCloseTo(15.625);
  });
  it("counts doses after the 2-unit prime", () => {
    // 123 usable units / 12.5 units per dose (10mg pen, 1mg) = 9 doses
    expect(calcPenDose(10, 1, 1)!.doses).toBe(9);
  });
  it("flags doses larger than the pen", () => {
    expect(calcPenDose(10, 20, 1)!.tooLarge).toBe(true);
  });
});
