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
    const result = RentalProperty.safeParse({
      ...testApartment,
      services: undefined,
    });
    expect(result.success).toBe(true);
    expect(result.data.services).not.toHaveLength(1);
    expect(result.data.services).not.toBeTypeOf("undefined");
  });
});
