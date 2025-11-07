import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { connect } from "mongoose";
import { ArrendadorDB } from "../models/arrendador.schema";
import { authenticateArrendador, checkOwnership } from "../middleware/auth.middleware";
import { generateToken } from "../lib/utils";

const app = express();
app.use(express.json());

// Test routes para middleware
app.get("/test-auth", authenticateArrendador, (req, res) => {
  res.json({
    success: true,
    arrendador: req.arrendador
  });
});

app.get("/test-ownership/:arrendadorId", authenticateArrendador, checkOwnership("arrendadorId"), (req, res) => {
  res.json({
    success: true,
    message: "Access granted"
  });
});

// Variables globales para tests
let testArrendadorId: string;
let testToken: string;
let invalidToken: string;
let expiredToken: string;
let otherArrendadorId: string;
let otherToken: string;

const testArrendador = {
  email: "middleware.test@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Middleware Test Arrendador",
    phone: "+52 55 1234 5678"
  }
};

const otherArrendador = {
  email: "other.middleware@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Other Middleware Test Arrendador",
    phone: "+52 55 9876 5432"
  }
};

beforeAll(async () => {
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
  await connect(mongoUrl);
});

afterAll(async () => {
  await ArrendadorDB.deleteMany({});
});

beforeEach(async () => {
  await ArrendadorDB.deleteMany({});
  
  // Crear arrendadores de prueba
  const arrendador1 = new ArrendadorDB({
    email: testArrendador.email,
    password: "hashedpassword", // En test real sería hasheado
    profile: testArrendador.profile,
    isActive: true
  });
  await arrendador1.save();
  testArrendadorId = arrendador1._id.toString();
  testToken = generateToken(testArrendadorId, testArrendador.email);

  const arrendador2 = new ArrendadorDB({
    email: otherArrendador.email,
    password: "hashedpassword",
    profile: otherArrendador.profile,
    isActive: true
  });
  await arrendador2.save();
  otherArrendadorId = arrendador2._id.toString();
  otherToken = generateToken(otherArrendadorId, otherArrendador.email);

  // Tokens inválidos para tests
  invalidToken = "invalid.jwt.token";
  expiredToken = generateToken(testArrendadorId, testArrendador.email); // Este expiraría en producción
});

describe("Authentication Middleware Tests", () => {
  describe("authenticateArrendador", () => {
    it("should authenticate successfully with valid token", async () => {
      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.arrendador.id).toBe(testArrendadorId);
      expect(response.body.arrendador.email).toBe(testArrendador.email);
      expect(response.body.arrendador.role).toBe("arrendador");
    });

    it("should fail without token", async () => {
      const response = await request(app)
        .get("/test-auth")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });

    it("should fail with invalid token format", async () => {
      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token inválido");
    });

    it("should fail with token without Bearer prefix", async () => {
      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", testToken)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });

    it("should fail with wrong role in token", async () => {
      // Crear token con rol incorrecto
      const wrongRoleToken = generateToken(testArrendadorId, testArrendador.email);
      // Simular token con rol diferente modificando la función temporalmente
      const jwt = require("jsonwebtoken");
      const wrongToken = jwt.sign(
        { arrendadorId: testArrendadorId, email: testArrendador.email, role: "student" },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", `Bearer ${wrongToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Acceso denegado. Token de arrendador requerido");
    });

    it("should fail with token for non-existent arrendador", async () => {
      const fakeArrendadorId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const fakeToken = generateToken(fakeArrendadorId, "fake@tec.mx");

      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", `Bearer ${fakeToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token inválido o arrendador no encontrado");
    });

    it("should fail with token for inactive arrendador", async () => {
      // Desactivar arrendador
      await ArrendadorDB.findByIdAndUpdate(testArrendadorId, { isActive: false });

      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", `Bearer ${testToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token inválido o arrendador no encontrado");
    });
  });

  describe("checkOwnership", () => {
    it("should allow access to own resource", async () => {
      const response = await request(app)
        .get(`/test-ownership/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Access granted");
    });

    it("should deny access to other's resource", async () => {
      const response = await request(app)
        .get(`/test-ownership/${otherArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No tienes permiso para acceder a este recurso");
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .get(`/test-ownership/${testArrendadorId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });
  });

  describe("Middleware Integration Tests", () => {
    it("should handle multiple middleware correctly", async () => {
      // Test que pasa por authenticateArrendador y checkOwnership
      const response = await request(app)
        .get(`/test-ownership/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should stop at authentication middleware when token is invalid", async () => {
      const response = await request(app)
        .get(`/test-ownership/${testArrendadorId}`)
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token inválido");
    });

    it("should stop at ownership middleware when accessing other's resource", async () => {
      const response = await request(app)
        .get(`/test-ownership/${otherArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No tienes permiso para acceder a este recurso");
    });
  });

  describe("Token Edge Cases", () => {
    it("should handle malformed JWT token", async () => {
      const malformedToken = "malformed.jwt";
      
      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", `Bearer ${malformedToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token inválido");
    });

    it("should handle empty Authorization header", async () => {
      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", "")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });

    it("should handle Authorization header without Bearer", async () => {
      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", "Basic sometoken")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token de acceso requerido");
    });

    it("should handle JWT with invalid signature", async () => {
      const jwt = require("jsonwebtoken");
      const tokenWithWrongSignature = jwt.sign(
        { arrendadorId: testArrendadorId, email: testArrendador.email, role: "arrendador" },
        "wrong-secret-key",
        { expiresIn: "7d" }
      );

      const response = await request(app)
        .get("/test-auth")
        .set("Authorization", `Bearer ${tokenWithWrongSignature}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Token inválido");
    });
  });

  describe("Ownership Parameter Variants", () => {
    it("should work with default parameter name", async () => {
      // Test route que usa el parámetro por defecto "arrendadorId"
      const response = await request(app)
        .get(`/test-ownership/${testArrendadorId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should handle missing parameter", async () => {
      // Crear ruta sin parámetro
      const testApp = express();
      testApp.use(express.json());
      testApp.get("/test-no-param", authenticateArrendador, checkOwnership("nonExistentParam"), (req, res) => {
        res.json({ success: true });
      });

      const response = await request(testApp)
        .get("/test-no-param")
        .set("Authorization", `Bearer ${testToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No tienes permiso para acceder a este recurso");
    });
  });
});