import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { connect, disconnect } from "mongoose";
import { ArrendadorDB } from "../../arrendador/models/arrendador.schema";
import { PropiedadRentaDB } from "../models/rentalProperty.schema";
import propertyRoutes from "../routes/index";

const app = express();
app.use(express.json());
app.use("/api", propertyRoutes);

// Variables globales para tests
let testArrendadorId: string;
let testToken: string;
let testPropertyId: string;

const testArrendador = {
  email: "delete.test@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Delete Test Arrendador",
    phone: "+52 33 1234 5678"
  }
};

const testProperty = {
  titulo: "Propiedad para pruebas de eliminación",
  descripcion: "Propiedad de prueba",
  tipoPropiedad: "Departamento",
  tipoRenta: "Propiedad completa",
  generoPreferido: "Mixto",
  direccion: {
    calle: "Av. Test",
    numero: "100",
    colonia: "Test",
    ciudad: "Guadalajara",
    estado: "Jalisco",
    codigoPostal: "44100",
    pais: "México"
  },
  ubicacion: {
    campus: "Guadalajara",
    distanciaCampus: 1.5
  },
  caracteristicas: {
    numeroRecamaras: 2,
    numeroBanos: 1,
    areaConstruccion: 70,
    areaTotal: 75,
    amueblado: true,
    mascotas: false,
    estacionamiento: false
  },
  servicios: {
    serviciosIncluidos: true,
    listaServicios: ["Agua", "Luz"],
    amenidades: []
  },
  informacionFinanciera: {
    precioMensual: 4500,
    deposito: 4500,
    comisionAgencia: 0
  },
  disponibilidad: {
    disponible: true,
    fechaDisponible: new Date("2025-01-01"),
    duracionMinimaContrato: 6,
    duracionMaximaContrato: 12
  },
  politicas: {
    fumadoresPermitidos: false,
    fiestasPermitidas: false,
    mascotasPermitidas: false,
    edadMinima: 18,
    edadMaxima: 30
  },
  imagenes: {
    imagenPrincipal: "https://test.com/delete-test.jpg",
    galeria: []
  }
};

beforeAll(async () => {
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
  await connect(mongoUrl);
});

afterAll(async () => {
  await ArrendadorDB.deleteMany({ email: { $regex: /delete\.test/i } });
  await PropiedadRentaDB.deleteMany({ titulo: { $regex: /eliminación/i } });
  await disconnect();
});

beforeEach(async () => {
  // Limpiar datos de prueba
  await ArrendadorDB.deleteMany({ email: { $regex: /delete\.test/i } });
  await PropiedadRentaDB.deleteMany({ titulo: { $regex: /eliminación/i } });

  // Registrar arrendador
  const registerResponse = await request(app)
    .post("/api/arrendadores/registro")
    .send(testArrendador);

  testArrendadorId = registerResponse.body.data.id;
  testToken = registerResponse.body.data.token;

  // Crear propiedad para tests
  const propertyResponse = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${testToken}`)
    .send({
      ...testProperty,
      propietarioId: testArrendadorId
    });

  testPropertyId = propertyResponse.body.data._id;
});

describe("Property Delete Controller Tests", () => {

  describe("DELETE /api/propiedades-renta/:propertyId - eliminarPropiedad (Soft Delete)", () => {
    it("should soft delete property successfully", async () => {
      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("eliminada exitosamente");
      expect(response.body.data.estado).toBe("Inactiva");
      expect(response.body.data.disponible).toBe(false);
      expect(response.body.data.mensaje).toContain("restaurar");

      // Verificar que la propiedad existe pero está inactiva
      const property = await PropiedadRentaDB.findById(testPropertyId);
      expect(property).toBeDefined();
      expect(property?.estado).toBe("Inactiva");
    });

    it("should not show soft deleted property in public searches", async () => {
      // Soft delete la propiedad
      await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`);

      // Intentar obtener catálogo público
      const catalogResponse = await request(app)
        .get("/api/propiedades-renta/catalogo")
        .expect(200);

      const propertyIds = catalogResponse.body.data.propiedades.map((p: any) => p._id);
      expect(propertyIds).not.toContain(testPropertyId);
    });

    it("should prevent soft delete with active tenants", async () => {
      // Agregar inquilino activo
      await PropiedadRentaDB.findByIdAndUpdate(testPropertyId, {
        $push: { inquilinosActuales: "64a7b8c9d1e2f3a4b5c6d7e8" }
      });

      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("inquilinos activos");
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Autenticación requerida");
    });

    it("should fail when deleting another landlord's property", async () => {
      // Crear otro arrendador
      const otherArrendador = {
        email: "other.delete@tec.mx",
        password: "OtherPassword123!",
        profile: {
          fullName: "Other Delete Test",
          phone: "+52 55 9999 8888"
        }
      };

      const otherResponse = await request(app)
        .post("/api/arrendadores/registro")
        .send(otherArrendador);

      const otherToken = otherResponse.body.data.token;

      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Acceso denegado");
    });

    it("should return 404 for non-existent property", async () => {
      const fakeId = "64a7b8c9d1e2f3a4b5c6d7e8";

      const response = await request(app)
        .delete(`/api/propiedades-renta/${fakeId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });

    it("should update fechaActualizacion on soft delete", async () => {
      const beforeDelete = new Date();

      await new Promise(resolve => setTimeout(resolve, 100)); // Pequeño delay

      await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`);

      const property = await PropiedadRentaDB.findById(testPropertyId);
      const updateDate = new Date(property?.fechaActualizacion || 0);

      expect(updateDate.getTime()).toBeGreaterThanOrEqual(beforeDelete.getTime());
    });
  });

  describe("DELETE /api/propiedades-renta/:propertyId/permanente - eliminarPermanentemente (Hard Delete)", () => {
    it("should hard delete property successfully", async () => {
      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("eliminada permanentemente");
      expect(response.body.data.mensaje).toContain("irreversible");

      // Verificar que la propiedad no existe en la BD
      const property = await PropiedadRentaDB.findById(testPropertyId);
      expect(property).toBeNull();
    });

    it("should remove property from landlord's properties array", async () => {
      await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`);

      // Verificar que el arrendador no tiene esta propiedad
      const arrendador = await ArrendadorDB.findById(testArrendadorId);
      expect(arrendador?.properties).not.toContain(testPropertyId);
    });

    it("should prevent hard delete with active tenants", async () => {
      // Agregar inquilino activo
      await PropiedadRentaDB.findByIdAndUpdate(testPropertyId, {
        $push: { inquilinosActuales: "64a7b8c9d1e2f3a4b5c6d7e8" }
      });

      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("inquilinos activos");
    });

    it("should prevent hard delete with pending applications", async () => {
      // Agregar aplicaciones pendientes
      await PropiedadRentaDB.findByIdAndUpdate(testPropertyId, {
        $push: { aplicaciones: "64a7b8c9d1e2f3a4b5c6d7e8" }
      });

      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("aplicaciones pendientes");
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Autenticación requerida");
    });

    it("should fail when hard deleting another landlord's property", async () => {
      // Crear otro arrendador
      const otherArrendador = {
        email: "other.harddelete@tec.mx",
        password: "OtherPassword123!",
        profile: {
          fullName: "Other Hard Delete Test",
          phone: "+52 55 7777 6666"
        }
      };

      const otherResponse = await request(app)
        .post("/api/arrendadores/registro")
        .send(otherArrendador);

      const otherToken = otherResponse.body.data.token;

      const response = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Acceso denegado");
    });

    it("should return 404 for non-existent property", async () => {
      const fakeId = "64a7b8c9d1e2f3a4b5c6d7e8";

      const response = await request(app)
        .delete(`/api/propiedades-renta/${fakeId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });

    it("should be irreversible - property cannot be restored after hard delete", async () => {
      // Hard delete
      await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`);

      // Intentar restaurar
      const restoreResponse = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(404);

      expect(restoreResponse.body.success).toBe(false);
    });
  });

  describe("PATCH /api/propiedades-renta/:propertyId/restaurar - restaurarPropiedad", () => {
    beforeEach(async () => {
      // Hacer soft delete de la propiedad antes de cada test de restauración
      await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`);
    });

    it("should restore soft deleted property successfully", async () => {
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("restaurada exitosamente");
      expect(response.body.data.estado).toBe("Activa");
      expect(response.body.data.disponible).toBe(true);

      // Verificar que la propiedad vuelve a aparecer en búsquedas
      const catalogResponse = await request(app)
        .get("/api/propiedades-renta/catalogo")
        .expect(200);

      const propertyIds = catalogResponse.body.data.propiedades.map((p: any) => p._id);
      expect(propertyIds).toContain(testPropertyId);
    });

    it("should fail to restore property that is not Inactiva", async () => {
      // Primero restaurar
      await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`);

      // Intentar restaurar de nuevo (ahora está Activa)
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Solo se pueden restaurar propiedades inactivas");
    });

    it("should fail to restore property that was hard deleted", async () => {
      // Crear nueva propiedad
      const newPropertyResponse = await request(app)
        .post("/api/propiedades-renta")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          ...testProperty,
          titulo: "Propiedad para hard delete",
          propietarioId: testArrendadorId
        });

      const newPropertyId = newPropertyResponse.body.data._id;

      // Hard delete
      await request(app)
        .delete(`/api/propiedades-renta/${newPropertyId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`);

      // Intentar restaurar
      const response = await request(app)
        .patch(`/api/propiedades-renta/${newPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Autenticación requerida");
    });

    it("should fail when restoring another landlord's property", async () => {
      // Crear otro arrendador
      const otherArrendador = {
        email: "other.restore@tec.mx",
        password: "OtherPassword123!",
        profile: {
          fullName: "Other Restore Test",
          phone: "+52 55 5555 4444"
        }
      };

      const otherResponse = await request(app)
        .post("/api/arrendadores/registro")
        .send(otherArrendador);

      const otherToken = otherResponse.body.data.token;

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Acceso denegado");
    });

    it("should return 404 for non-existent property", async () => {
      const fakeId = "64a7b8c9d1e2f3a4b5c6d7e8";

      const response = await request(app)
        .patch(`/api/propiedades-renta/${fakeId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });

    it("should update fechaActualizacion on restore", async () => {
      const beforeRestore = new Date();

      await new Promise(resolve => setTimeout(resolve, 100)); // Pequeño delay

      await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`);

      const property = await PropiedadRentaDB.findById(testPropertyId);
      const updateDate = new Date(property?.fechaActualizacion || 0);

      expect(updateDate.getTime()).toBeGreaterThanOrEqual(beforeRestore.getTime());
    });

    it("should allow multiple soft delete and restore cycles", async () => {
      // Ciclo 1: Restaurar (ya está soft deleted en beforeEach)
      await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      // Ciclo 2: Soft delete de nuevo
      await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      // Ciclo 2: Restaurar de nuevo
      const finalRestore = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(finalRestore.body.success).toBe(true);
      expect(finalRestore.body.data.estado).toBe("Activa");
    });
  });

  describe("Integration: Complete Delete Workflow", () => {
    it("should handle complete soft delete -> restore -> hard delete workflow", async () => {
      // 1. Soft delete
      const softDeleteResponse = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(softDeleteResponse.body.data.estado).toBe("Inactiva");

      // 2. Restore
      const restoreResponse = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/restaurar`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(restoreResponse.body.data.estado).toBe("Activa");

      // 3. Hard delete
      const hardDeleteResponse = await request(app)
        .delete(`/api/propiedades-renta/${testPropertyId}/permanente`)
        .set("Authorization", `Bearer ${testToken}`)
        .expect(200);

      expect(hardDeleteResponse.body.message).toContain("permanentemente");

      // 4. Verificar eliminación total
      const property = await PropiedadRentaDB.findById(testPropertyId);
      expect(property).toBeNull();
    });
  });
});
