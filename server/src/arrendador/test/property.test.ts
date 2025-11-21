import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { connect } from "mongoose";
import { ArrendadorDB, PropertyDB } from "../models/arrendador.schema";
import arrendadorRoutes from "../routes/index";

const app = express();
app.use(express.json());
app.use("/api", arrendadorRoutes);

// Variables globales para tests
let testArrendadorId: string;
let testToken: string;
let testPropertyId: string;
let secondTestPropertyId: string;

const testArrendador = {
  email: "property.test@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Property Test Arrendador",
    phone: "+52 55 1234 5678"
  }
};

const testProperty = {
  propertyType: "Departamento",
  rentalType: "Departamento completo",
  genderPreference: "Mixto",
  monthlyPrice: 8500,
  includesServices: true,
  services: ["Luz", "Agua", "Internet"],
  isFurnished: true,
  furniture: ["Cama", "Escritorio", "Refrigerador"],
  address: {
    street: "Test Street 123",
    city: "Test City",
    state: "Test State",
    zipCode: "12345",
    country: "México"
  },
  images: ["https://test.com/image1.jpg"],
  description: "Test property description"
};

const secondTestProperty = {
  propertyType: "Casa",
  rentalType: "Casa completa",
  genderPreference: "Solo mujeres",
  monthlyPrice: 12000,
  includesServices: false,
  services: [],
  isFurnished: false,
  furniture: [],
  address: {
    street: "Second Test Street 456",
    city: "Second Test City",
    state: "Second Test State",
    zipCode: "67890",
    country: "México"
  },
  images: ["https://test.com/image2.jpg", "https://test.com/image3.jpg"],
  description: "Second test property description"
};

beforeAll(async () => {
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
  await connect(mongoUrl);
});

afterAll(async () => {
  await ArrendadorDB.deleteMany({});
  await PropertyDB.deleteMany({});
});

beforeEach(async () => {
  await ArrendadorDB.deleteMany({});
  await PropertyDB.deleteMany({});
  
  // Registrar arrendador para tests
  const registerResponse = await request(app)
    .post("/api/arrendadores/registro")
    .send(testArrendador);
  
  testArrendadorId = registerResponse.body.data.id;
  testToken = registerResponse.body.data.token;
});

describe("Property CRUD Tests", () => {
  describe("POST /api/propiedades/:arrendadorId", () => {
    it("should create a new property successfully", async () => {
      const response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Propiedad creada exitosamente");
      expect(response.body.data.propertyType).toBe(testProperty.propertyType);
      expect(response.body.data.monthlyPrice).toBe(testProperty.monthlyPrice);
      expect(response.body.data.isActive).toBe(true);
      
      testPropertyId = response.body.data._id;
    });

    it("should fail to create property without authentication", async () => {
      const response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .send(testProperty)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });

    it("should fail to create property for another arrendador", async () => {
      // Crear otro arrendador
      const otherArrendador = {
        ...testArrendador,
        email: "other.property@tec.mx"
      };
      const otherResponse = await request(app)
        .post("/api/arrendadores/registro")
        .send(otherArrendador);

      const otherArrendadorId = otherResponse.body.data.id;

      // Intentar crear propiedad con token del primer arrendador
      const response = await request(app)
        .post(`/api/propiedades/${otherArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No tienes permiso para acceder a este recurso");
    });

    it("should fail to create property with invalid data", async () => {
      const invalidProperty = {
        ...testProperty,
        monthlyPrice: -1000, // Invalid negative price
        propertyType: "InvalidType" // Invalid property type
      };

      const response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(invalidProperty)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Datos de validación incorrectos");
    });

    it("should create property with all services", async () => {
      const allServicesProperty = {
        ...testProperty,
        services: ["Todos los servicios"]
      };

      const response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(allServicesProperty)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toContain("Todos los servicios");
    });
  });

  describe("GET /api/propiedades", () => {
    beforeEach(async () => {
      // Crear múltiples propiedades para tests
      const property1Response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty);
      
      const property2Response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(secondTestProperty);

      testPropertyId = property1Response.body.data._id;
      secondTestPropertyId = property2Response.body.data._id;
    });

    it("should get all properties (public endpoint)", async () => {
      const response = await request(app)
        .get("/api/propiedades")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.totalProperties).toBe(2);
    });

    it("should filter properties by type", async () => {
      const response = await request(app)
        .get("/api/propiedades?propertyType=Casa")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].propertyType).toBe("Casa");
    });

    it("should filter properties by price range", async () => {
      const response = await request(app)
        .get("/api/propiedades?minPrice=10000&maxPrice=15000")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].monthlyPrice).toBe(12000);
    });

    it("should filter properties by gender preference", async () => {
      const response = await request(app)
        .get("/api/propiedades?genderPreference=Solo mujeres")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].genderPreference).toBe("Solo mujeres");
    });

    it("should filter properties by services", async () => {
      const response = await request(app)
        .get("/api/propiedades?includesServices=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].includesServices).toBe(true);
    });

    it("should filter properties by furnished status", async () => {
      const response = await request(app)
        .get("/api/propiedades?isFurnished=false")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].isFurnished).toBe(false);
    });

    it("should handle pagination correctly", async () => {
      const response = await request(app)
        .get("/api/propiedades?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
      expect(response.body.data.pagination.hasNext).toBe(true);
    });
  });

  describe("GET /api/propiedades/:propertyId", () => {
    beforeEach(async () => {
      const propertyResponse = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty);
      
      testPropertyId = propertyResponse.body.data._id;
    });

    it("should get specific property successfully", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${testPropertyId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testPropertyId);
      expect(response.body.data.propertyType).toBe(testProperty.propertyType);
    });

    it("should return 404 for non-existent property", async () => {
      const fakeId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .get(`/api/propiedades/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Propiedad no encontrada");
    });
  });

  describe("GET /api/propiedades/:arrendadorId/mis-propiedades", () => {
    beforeEach(async () => {
      // Crear propiedades del arrendador
      const property1Response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty);
      
      const property2Response = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(secondTestProperty);

      testPropertyId = property1Response.body.data._id;
      secondTestPropertyId = property2Response.body.data._id;
    });

    it("should get arrendador properties successfully", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${testArrendadorId}/mis-propiedades`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(2);
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${testArrendadorId}/mis-propiedades`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });
  });

  describe("PUT /api/propiedades/:arrendadorId/propiedad/:propertyId", () => {
    beforeEach(async () => {
      const propertyResponse = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty);
      
      testPropertyId = propertyResponse.body.data._id;
    });

    it("should update property successfully", async () => {
      const updateData = {
        monthlyPrice: 9500,
        description: "Updated description"
      };

      const response = await request(app)
        .put(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Propiedad actualizada exitosamente");
      expect(response.body.data.monthlyPrice).toBe(updateData.monthlyPrice);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it("should fail to update with invalid data", async () => {
      const invalidUpdate = {
        monthlyPrice: -5000 // Invalid negative price
      };

      const response = await request(app)
        .put(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Datos de validación incorrectos");
    });

    it("should fail without authentication", async () => {
      const updateData = {
        monthlyPrice: 9500
      };

      const response = await request(app)
        .put(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });
  });

  describe("PATCH /api/propiedades/:arrendadorId/propiedad/:propertyId/estado", () => {
    beforeEach(async () => {
      const propertyResponse = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty);
      
      testPropertyId = propertyResponse.body.data._id;
    });

    it("should toggle property status successfully", async () => {
      const response = await request(app)
        .patch(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}/estado`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ isActive: false })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Propiedad desactivada exitosamente");
      expect(response.body.data.isActive).toBe(false);
    });

    it("should activate property successfully", async () => {
      // Primero desactivar
      await request(app)
        .patch(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}/estado`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ isActive: false });

      // Luego activar
      const response = await request(app)
        .patch(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}/estado`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ isActive: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Propiedad activada exitosamente");
      expect(response.body.data.isActive).toBe(true);
    });
  });

  describe("DELETE /api/propiedades/:arrendadorId/propiedad/:propertyId", () => {
    beforeEach(async () => {
      const propertyResponse = await request(app)
        .post(`/api/propiedades/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testProperty);
      
      testPropertyId = propertyResponse.body.data._id;
    });

    it("should delete property successfully (soft delete)", async () => {
      const response = await request(app)
        .delete(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Propiedad eliminada exitosamente");

      // Verificar que la propiedad no aparece en búsquedas públicas
      const searchResponse = await request(app)
        .get("/api/propiedades")
        .expect(200);

      expect(searchResponse.body.data.properties).toHaveLength(0);
    });

    it("should fail to delete non-existent property", async () => {
      const fakeId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .delete(`/api/propiedades/${testArrendadorId}/propiedad/${fakeId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Propiedad no encontrada");
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .delete(`/api/propiedades/${testArrendadorId}/propiedad/${testPropertyId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });
  });
});