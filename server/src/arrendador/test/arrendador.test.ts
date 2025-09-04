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

const testArrendador = {
  email: "test.arrendador@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Test Arrendador",
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

beforeAll(async () => {
  // Conectar a base de datos de test
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
  await connect(mongoUrl);
});

afterAll(async () => {
  // Limpiar base de datos de test
  await ArrendadorDB.deleteMany({});
  await PropertyDB.deleteMany({});
});

beforeEach(async () => {
  // Limpiar datos antes de cada test
  await ArrendadorDB.deleteMany({});
  await PropertyDB.deleteMany({});
});

describe("Arrendador Authentication Tests", () => {
  describe("POST /api/arrendadores/registro", () => {
    it("should register a new arrendador successfully", async () => {
      const response = await request(app)
        .post("/api/arrendadores/registro")
        .send(testArrendador)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Arrendador registrado exitosamente");
      expect(response.body.data.email).toBe(testArrendador.email);
      expect(response.body.data.token).toBeDefined();
      
      // Guardar datos para otros tests
      testArrendadorId = response.body.data.id;
      testToken = response.body.data.token;
    });

    it("should fail to register with invalid email domain", async () => {
      const invalidArrendador = {
        ...testArrendador,
        email: "test@gmail.com"
      };

      const response = await request(app)
        .post("/api/arrendadores/registro")
        .send(invalidArrendador)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Datos de validación incorrectos");
    });

    it("should fail to register with weak password", async () => {
      const weakPasswordArrendador = {
        ...testArrendador,
        password: "weak"
      };

      const response = await request(app)
        .post("/api/arrendadores/registro")
        .send(weakPasswordArrendador)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Datos de validación incorrectos");
    });

    it("should fail to register with existing email", async () => {
      // Registrar primer arrendador
      await request(app)
        .post("/api/arrendadores/registro")
        .send(testArrendador);

      // Intentar registrar con mismo email
      const response = await request(app)
        .post("/api/arrendadores/registro")
        .send(testArrendador)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("El email ya está registrado");
    });
  });

  describe("POST /api/arrendadores/login", () => {
    beforeEach(async () => {
      // Registrar arrendador para tests de login
      const registerResponse = await request(app)
        .post("/api/arrendadores/registro")
        .send(testArrendador);
      
      testArrendadorId = registerResponse.body.data.id;
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/arrendadores/login")
        .send({
          email: testArrendador.email,
          password: testArrendador.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login exitoso");
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.email).toBe(testArrendador.email);
      
      testToken = response.body.data.token;
    });

    it("should fail login with wrong password", async () => {
      const response = await request(app)
        .post("/api/arrendadores/login")
        .send({
          email: testArrendador.email,
          password: "WrongPassword123!"
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });

    it("should fail login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/arrendadores/login")
        .send({
          email: "nonexistent@tec.mx",
          password: testArrendador.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });

    it("should fail login with invalid email format", async () => {
      const response = await request(app)
        .post("/api/arrendadores/login")
        .send({
          email: "invalid-email",
          password: testArrendador.password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Datos de validación incorrectos");
    });
  });
});

describe("Arrendador Profile Tests", () => {
  beforeEach(async () => {
    // Registrar arrendador y obtener token
    const registerResponse = await request(app)
      .post("/api/arrendadores/registro")
      .send(testArrendador);
    
    testArrendadorId = registerResponse.body.data.id;
    testToken = registerResponse.body.data.token;
  });

  describe("GET /api/arrendadores/:id", () => {
    it("should get arrendador profile successfully", async () => {
      const response = await request(app)
        .get(`/api/arrendadores/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testArrendadorId);
      expect(response.body.data.email).toBe(testArrendador.email);
      expect(response.body.data.password).toBeUndefined(); // Password should not be returned
    });

    it("should fail to get profile without token", async () => {
      const response = await request(app)
        .get(`/api/arrendadores/${testArrendadorId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });

    it("should fail to get another arrendador's profile", async () => {
      // Crear otro arrendador
      const otherArrendador = {
        ...testArrendador,
        email: "other@tec.mx"
      };
      const otherResponse = await request(app)
        .post("/api/arrendadores/registro")
        .send(otherArrendador);

      const otherArrendadorId = otherResponse.body.data.id;

      // Intentar acceder con token del primer arrendador
      const response = await request(app)
        .get(`/api/arrendadores/${otherArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No tienes permiso para acceder a este recurso");
    });
  });

  describe("PUT /api/arrendadores/:id/perfil", () => {
    const profileUpdate = {
      profilePicture: "https://test.com/profile.jpg",
      officialId: {
        type: "INE",
        fileUrl: "https://test.com/ine.pdf",
        fileName: "INE_Test.pdf"
      },
      dateOfBirth: {
        day: 15,
        month: 8,
        year: 1990
      },
      gender: "masculino",
      phone: "+52 55 9876 5432",
      fullName: "Test Arrendador Updated"
    };

    it("should update profile successfully", async () => {
      const response = await request(app)
        .put(`/api/arrendadores/${testArrendadorId}/perfil`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(profileUpdate)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Perfil actualizado exitosamente");
      expect(response.body.data.profile.fullName).toBe(profileUpdate.fullName);
      expect(response.body.data.profile.gender).toBe(profileUpdate.gender);
    });

    it("should fail to update profile with invalid date", async () => {
      const invalidUpdate = {
        ...profileUpdate,
        dateOfBirth: {
          day: 35, // Invalid day
          month: 8,
          year: 1990
        }
      };

      const response = await request(app)
        .put(`/api/arrendadores/${testArrendadorId}/perfil`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Datos de validación incorrectos");
    });
  });

  describe("PUT /api/arrendadores/:id/cambiar-password", () => {
    const passwordChange = {
      currentPassword: testArrendador.password,
      newPassword: "NewPassword123!"
    };

    it("should change password successfully", async () => {
      const response = await request(app)
        .put(`/api/arrendadores/${testArrendadorId}/cambiar-password`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(passwordChange)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Contraseña actualizada exitosamente");

      // Verificar que se puede hacer login con nueva contraseña
      await request(app)
        .post("/api/arrendadores/login")
        .send({
          email: testArrendador.email,
          password: passwordChange.newPassword
        })
        .expect(200);
    });

    it("should fail to change password with wrong current password", async () => {
      const wrongPasswordChange = {
        currentPassword: "WrongPassword123!",
        newPassword: "NewPassword123!"
      };

      const response = await request(app)
        .put(`/api/arrendadores/${testArrendadorId}/cambiar-password`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(wrongPasswordChange)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("La contraseña actual es incorrecta");
    });

    it("should fail to change password with weak new password", async () => {
      const weakPasswordChange = {
        currentPassword: testArrendador.password,
        newPassword: "weak"
      };

      const response = await request(app)
        .put(`/api/arrendadores/${testArrendadorId}/cambiar-password`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(weakPasswordChange)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Datos de validación incorrectos");
    });
  });

  describe("DELETE /api/arrendadores/:id", () => {
    it("should delete arrendador successfully (soft delete)", async () => {
      const response = await request(app)
        .delete(`/api/arrendadores/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Arrendador eliminado exitosamente");

      // Verificar que no se puede hacer login después del soft delete
      await request(app)
        .post("/api/arrendadores/login")
        .send({
          email: testArrendador.email,
          password: testArrendador.password
        })
        .expect(401);
    });
  });
});