import { describe, expect, it } from "vitest";
import { Apartment } from "./apartment.validation";
const testApartment = {
  name: "Habitación individual en casa compartida",
  imgPrincipal:
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  summary: "Ideal para estudiantes que buscan privacidad y comodidad.",
  description:
    "Esta propiedad ofrece un espacio cómodo y bien ubicado, ideal para estudiantes del Tec de Monterrey. Cuenta con todas las comodidades necesarias para una estancia agradable y productiva durante tu etapa universitaria.",
  rateting: 4.8,
  price: 4_500,
  isPetFriendly: true,
  capacity: 5,
  isFurnished: true,
  parkingNum: 2,
  amenities: ["casa club", "jardín", "hamaca", "seguridad 24/7"],
  contractTime: 12,
  type: "cuarto",
  gender: "ambos",
  deposit: 0,
  rules: [],
  distance: 11.24,
  bathroom: "propio",
  services: ["luz", "agua", "internet", "limpieza", "gas"],
  isAvailable: true,
};
describe("Test All pass", () => {
  it("All values mock pass", () => {
    expect(Apartment.safeParse(testApartment).success).toBe(true);
  });
});
describe("Errors:", () => {
  it("missing services", () => {
    const result = Apartment.safeParse({
      ...testApartment,
      services: undefined,
    });
    expect(result.success).toBe(true);
    expect(result.data.services).not.toHaveLength(1);
    expect(result.data.services).not.toBeTypeOf("undefined");
  });
});
