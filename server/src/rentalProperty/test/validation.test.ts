import { describe, expect, it } from "vitest";
import { RentalProperty } from "../rentalProperty.validation";
import { testApartment } from "@/rentalProperty/test/mock";

describe("Test All pass", () => {
  it("All values mock pass", () => {
    expect(RentalProperty.safeParse(testApartment).success).toBe(true);
  });
});
describe("Errors:", () => {
  it("missing services", () => {
    const { services, ...propety } = testApartment;
    const result = RentalProperty.safeParse(propety);
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data.services)).toBe(true);
  });
});
