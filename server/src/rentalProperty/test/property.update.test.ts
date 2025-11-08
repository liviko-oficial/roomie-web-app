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
  email: "update.test@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Update Test Arrendador",
    phone: "+52 33 1234 5678"
  }
};

const testProperty = {
  titulo: "Departamento 2 recámaras Guadalajara",
  descripcion: "Departamento cerca del campus con todos los servicios",
  tipoPropiedad: "Departamento",
  tipoRenta: "Propiedad completa",
  generoPreferido: "Mixto",
  direccion: {
    calle: "Av. Patria",
    numero: "1234",
    colonia: "Jardines Universidad",
    ciudad: "Zapopan",
    estado: "Jalisco",
    codigoPostal: "45110",
    pais: "México"
  },
  ubicacion: {
    campus: "Guadalajara",
    distanciaCampus: 2.5
  },
  caracteristicas: {
    numeroRecamaras: 2,
    numeroBanos: 1,
    areaConstruccion: 80,
    areaTotal: 85,
    amueblado: true,
    mascotas: false,
    estacionamiento: true,
    espaciosEstacionamiento: 1,
    tiposEstacionamiento: ["Techado"]
  },
  servicios: {
    serviciosIncluidos: true,
    listaServicios: ["Agua", "Luz", "Internet", "Gas"],
    amenidades: ["Gimnasio", "Alberca"]
  },
  informacionFinanciera: {
    precioMensual: 5000,
    deposito: 5000,
    comisionAgencia: 0,
    serviciosExtra: []
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
    imagenPrincipal: "https://test.com/principal.jpg",
    galeria: ["https://test.com/img1.jpg", "https://test.com/img2.jpg"]
  }
};

beforeAll(async () => {
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
  await connect(mongoUrl);
});

afterAll(async () => {
  await ArrendadorDB.deleteMany({ email: { $regex: /update\.test/i } });
  await PropiedadRentaDB.deleteMany({ titulo: { $regex: /test/i } });
  await disconnect();
});

beforeEach(async () => {
  // Limpiar datos de prueba
  await ArrendadorDB.deleteMany({ email: { $regex: /update\.test/i } });
  await PropiedadRentaDB.deleteMany({ titulo: { $regex: /test/i } });

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

describe("Property Update Controller Tests", () => {

  describe("PUT /api/propiedades-renta/:propertyId - updateProperty", () => {
    it("should update property successfully with valid data", async () => {
      const updateData = {
        titulo: "Departamento Actualizado",
        informacionFinanciera: {
          precioMensual: 5500,
          deposito: 5500
        }
      };

      const response = await request(app)
        .put(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.titulo).toBe(updateData.titulo);
      expect(response.body.data.informacionFinanciera.precioMensual).toBe(5500);
      expect(response.body.data.fechaActualizacion).toBeDefined();
    });

    it("should update nested objects correctly", async () => {
      const updateData = {
        caracteristicas: {
          numeroRecamaras: 3,
          numeroBanos: 2
        }
      };

      const response = await request(app)
        .put(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.caracteristicas.numeroRecamaras).toBe(3);
      expect(response.body.data.caracteristicas.numeroBanos).toBe(2);
      // Verificar que otros campos se mantienen
      expect(response.body.data.caracteristicas.amueblado).toBe(true);
    });

    it("should fail without authentication", async () => {
      const updateData = {
        titulo: "Actualización no autorizada"
      };

      const response = await request(app)
        .put(`/api/propiedades-renta/${testPropertyId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Autenticación requerida");
    });

    it("should fail when updating another landlord's property", async () => {
      // Crear otro arrendador
      const otherArrendador = {
        email: "other.update@tec.mx",
        password: "OtherPassword123!",
        profile: {
          fullName: "Other Arrendador",
          phone: "+52 55 9876 5432"
        }
      };

      const otherResponse = await request(app)
        .post("/api/arrendadores/registro")
        .send(otherArrendador);

      const otherToken = otherResponse.body.data.token;

      const updateData = {
        titulo: "Intento de actualización no autorizada"
      };

      const response = await request(app)
        .put(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Acceso denegado");
    });

    it("should fail with invalid data", async () => {
      const invalidData = {
        informacionFinanciera: {
          precioMensual: -1000 // Precio negativo inválido
        }
      };

      const response = await request(app)
        .put(`/api/propiedades-renta/${testPropertyId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should return 404 for non-existent property", async () => {
      const fakeId = "64a7b8c9d1e2f3a4b5c6d7e8";

      const response = await request(app)
        .put(`/api/propiedades-renta/${fakeId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ titulo: "Test" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });
  });

  describe("PATCH /api/propiedades-renta/:propertyId/estado - cambiarEstadoPropiedad", () => {
    it("should change property state successfully", async () => {
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/estado`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ estado: "Pausada" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe("Pausada");
      expect(response.body.data.estadoAnterior).toBe("Activa");
    });

    it("should fail with invalid state", async () => {
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/estado`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ estado: "EstadoInvalido" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Estado inválido");
    });

    it("should prevent state change with active tenants", async () => {
      // Primero agregar un inquilino activo
      await PropiedadRentaDB.findByIdAndUpdate(testPropertyId, {
        $push: { inquilinosActuales: "64a7b8c9d1e2f3a4b5c6d7e8" }
      });

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/estado`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ estado: "Inactiva" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("inquilinos activos");
    });

    it("should allow state change to 'Rentada' with active tenants", async () => {
      // Agregar inquilino activo
      await PropiedadRentaDB.findByIdAndUpdate(testPropertyId, {
        $push: { inquilinosActuales: "64a7b8c9d1e2f3a4b5c6d7e8" }
      });

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/estado`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ estado: "Rentada" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe("Rentada");
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/estado`)
        .send({ estado: "Pausada" })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PATCH /api/propiedades-renta/:propertyId/disponibilidad - actualizarDisponibilidad", () => {
    it("should update availability successfully", async () => {
      const updateData = {
        disponible: true,
        fechaDisponible: "2025-02-01",
        duracionMinimaContrato: 12,
        duracionMaximaContrato: 24
      };

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/disponibilidad`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.disponibilidad.duracionMinimaContrato).toBe(12);
      expect(response.body.data.disponibilidad.duracionMaximaContrato).toBe(24);
    });

    it("should fail with invalid duration (min > max)", async () => {
      const invalidData = {
        duracionMinimaContrato: 24,
        duracionMaximaContrato: 12
      };

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/disponibilidad`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("mínima no puede ser mayor");
    });

    it("should fail with duration out of range", async () => {
      const invalidData = {
        duracionMinimaContrato: 50 // Máximo permitido es 48
      };

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/disponibilidad`)
        .set("Authorization", `Bearer ${testToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should prevent marking as available with active tenants", async () => {
      // Agregar inquilino activo
      await PropiedadRentaDB.findByIdAndUpdate(testPropertyId, {
        $push: { inquilinosActuales: "64a7b8c9d1e2f3a4b5c6d7e8" }
      });

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/disponibilidad`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ disponible: true })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("inquilinos activos");
    });

    it("should fail with past date", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/disponibilidad`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          fechaDisponible: pastDate.toISOString()
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("fecha");
    });
  });

  describe("PATCH /api/propiedades-renta/:propertyId/imagenes - actualizarImagenes", () => {
    it("should add images to gallery successfully", async () => {
      const newImages = [
        "https://test.com/new1.jpg",
        "https://test.com/new2.jpg"
      ];

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ agregarGaleria: newImages })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imagenes.galeria).toContain(newImages[0]);
      expect(response.body.data.imagenes.galeria).toContain(newImages[1]);
    });

    it("should remove images from gallery successfully", async () => {
      const imageToRemove = "https://test.com/img1.jpg";

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ eliminarGaleria: [imageToRemove] })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imagenes.galeria).not.toContain(imageToRemove);
    });

    it("should update principal image successfully", async () => {
      const newPrincipal = "https://test.com/new-principal.jpg";

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ imagenPrincipal: newPrincipal })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imagenes.imagenPrincipal).toBe(newPrincipal);
    });

    it("should update tour360 URL successfully", async () => {
      const tour360 = "https://tour360.com/property/123";

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ tour360 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imagenes.tour360).toBe(tour360);
    });

    it("should fail when exceeding gallery limit (20 images)", async () => {
      const tooManyImages = Array.from({ length: 25 }, (_, i) =>
        `https://test.com/img${i}.jpg`
      );

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ agregarGaleria: tooManyImages })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("20 imágenes");
    });

    it("should fail with invalid URL format", async () => {
      const invalidURL = "not-a-valid-url";

      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ imagenPrincipal: invalidURL })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("URL");
    });

    it("should perform multiple image operations simultaneously", async () => {
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          agregarGaleria: ["https://test.com/new3.jpg"],
          eliminarGaleria: ["https://test.com/img2.jpg"],
          imagenPrincipal: "https://test.com/updated-principal.jpg"
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imagenes.galeria).toContain("https://test.com/new3.jpg");
      expect(response.body.data.imagenes.galeria).not.toContain("https://test.com/img2.jpg");
      expect(response.body.data.imagenes.imagenPrincipal).toBe("https://test.com/updated-principal.jpg");
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .patch(`/api/propiedades-renta/${testPropertyId}/imagenes`)
        .send({ imagenPrincipal: "https://test.com/new.jpg" })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
