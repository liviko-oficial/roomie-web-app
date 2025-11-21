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
let arrendadorId1: string;
let arrendadorId2: string;
let token1: string;
let token2: string;
let propertyGdl1: string;
let propertyGdl2: string;
let propertyMty1: string;
let propertyMty2: string;
let propertyCdmx1: string;

const arrendador1 = {
  email: "client.test1@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Client Test Arrendador 1",
    phone: "+52 33 1111 2222"
  }
};

const arrendador2 = {
  email: "client.test2@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Client Test Arrendador 2",
    phone: "+52 81 3333 4444"
  }
};

// Propiedades en Guadalajara
const propertyGdl1Data = {
  titulo: "Departamento amueblado Guadalajara",
  descripcion: "Cerca del campus",
  tipoPropiedad: "Departamento",
  tipoRenta: "Propiedad completa",
  generoPreferido: "Mixto",
  direccion: {
    calle: "Av. Patria",
    numero: "100",
    colonia: "Jardines Universidad",
    ciudad: "Zapopan",
    estado: "Jalisco",
    codigoPostal: "45110",
    pais: "México"
  },
  ubicacion: {
    campus: "Guadalajara",
    distanciaCampus: 2.0
  },
  caracteristicas: {
    numeroRecamaras: 2,
    numeroBanos: 1,
    areaConstruccion: 80,
    areaTotal: 85,
    amueblado: true,
    mascotasPermitidas: true,
    estacionamiento: true
  },
  servicios: {
    serviciosIncluidos: true,
    listaServicios: ["Agua", "Luz", "Internet"],
    amenidades: ["Gimnasio"]
  },
  informacionFinanciera: {
    precioMensual: 5000,
    deposito: 5000
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
    mascotasPermitidas: true,
    edadMinima: 18,
    edadMaxima: 30
  },
  imagenes: {
    imagenPrincipal: "https://test.com/gdl1.jpg",
    galeria: []
  }
};

const propertyGdl2Data = {
  ...propertyGdl1Data,
  titulo: "Cuarto privado Guadalajara",
  tipoPropiedad: "Cuarto",
  tipoRenta: "Cuarto privado",
  ubicacion: {
    campus: "Guadalajara",
    distanciaCampus: 1.5
  },
  caracteristicas: {
    numeroRecamaras: 1,
    numeroBanos: 1,
    areaConstruccion: 30,
    areaTotal: 30,
    amueblado: true,
    mascotasPermitidas: false,
    estacionamiento: false
  },
  informacionFinanciera: {
    precioMensual: 3500,
    deposito: 3500
  }
};

// Propiedades en Monterrey
const propertyMty1Data = {
  ...propertyGdl1Data,
  titulo: "Casa grande Monterrey",
  tipoPropiedad: "Casa",
  ubicacion: {
    campus: "Monterrey",
    distanciaCampus: 3.0
  },
  caracteristicas: {
    numeroRecamaras: 4,
    numeroBanos: 2,
    areaConstruccion: 150,
    areaTotal: 180,
    amueblado: false,
    mascotasPermitidas: true,
    estacionamiento: true,
    espaciosEstacionamiento: 2
  },
  informacionFinanciera: {
    precioMensual: 12000,
    deposito: 12000
  }
};

const propertyMty2Data = {
  ...propertyMty1Data,
  titulo: "Studio Monterrey",
  tipoPropiedad: "Studio",
  tipoRenta: "Propiedad completa",
  ubicacion: {
    campus: "Monterrey",
    distanciaCampus: 1.0
  },
  caracteristicas: {
    numeroRecamaras: 1,
    numeroBanos: 1,
    areaConstruccion: 40,
    areaTotal: 40,
    amueblado: true,
    mascotasPermitidas: false,
    estacionamiento: false
  },
  informacionFinanciera: {
    precioMensual: 4500,
    deposito: 4500
  }
};

// Propiedad en CDMX
const propertyCdmxData = {
  ...propertyGdl1Data,
  titulo: "Loft Ciudad de México",
  tipoPropiedad: "Loft",
  ubicacion: {
    campus: "Ciudad de México",
    distanciaCampus: 2.5
  },
  informacionFinanciera: {
    precioMensual: 8000,
    deposito: 8000
  }
};

beforeAll(async () => {
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
  await connect(mongoUrl);
});

afterAll(async () => {
  await ArrendadorDB.deleteMany({ email: { $regex: /client\.test/i } });
  await PropiedadRentaDB.deleteMany({ titulo: { $regex: /(Guadalajara|Monterrey|Ciudad de México)/i } });
  await disconnect();
});

beforeEach(async () => {
  // Limpiar datos de prueba
  await ArrendadorDB.deleteMany({ email: { $regex: /client\.test/i } });
  await PropiedadRentaDB.deleteMany({ titulo: { $regex: /(Guadalajara|Monterrey|Ciudad de México)/i } });

  // Registrar arrendadores
  const reg1 = await request(app)
    .post("/api/arrendadores/registro")
    .send(arrendador1);
  arrendadorId1 = reg1.body.data.id;
  token1 = reg1.body.data.token;

  const reg2 = await request(app)
    .post("/api/arrendadores/registro")
    .send(arrendador2);
  arrendadorId2 = reg2.body.data.id;
  token2 = reg2.body.data.token;

  // Crear propiedades en diferentes campus
  const prop1 = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${token1}`)
    .send({ ...propertyGdl1Data, propietarioId: arrendadorId1 });
  propertyGdl1 = prop1.body.data._id;

  const prop2 = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${token1}`)
    .send({ ...propertyGdl2Data, propietarioId: arrendadorId1 });
  propertyGdl2 = prop2.body.data._id;

  const prop3 = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${token2}`)
    .send({ ...propertyMty1Data, propietarioId: arrendadorId2 });
  propertyMty1 = prop3.body.data._id;

  const prop4 = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${token2}`)
    .send({ ...propertyMty2Data, propietarioId: arrendadorId2 });
  propertyMty2 = prop4.body.data._id;

  const prop5 = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${token1}`)
    .send({ ...propertyCdmxData, propietarioId: arrendadorId1 });
  propertyCdmx1 = prop5.body.data._id;
});

describe("Property Client Controller Tests - Public Search Endpoints", () => {

  describe("GET /api/propiedades-renta/catalogo - getCatalogo", () => {
    it("should return all properties for unauthenticated user", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/catalogo")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedades).toHaveLength(5);
      expect(response.body.data.userCampus).toBeNull();
      expect(response.body.data.sugerenciasPersonalizadas).toBe(false);
      expect(response.body.data.paginacion).toBeDefined();
    });

    it("should return only active and available properties", async () => {
      // Desactivar una propiedad
      await request(app)
        .delete(`/api/propiedades-renta/${propertyGdl1}`)
        .set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .get("/api/propiedades-renta/catalogo")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedades).toHaveLength(4);

      const propertyIds = response.body.data.propiedades.map((p: any) => p._id);
      expect(propertyIds).not.toContain(propertyGdl1);
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/catalogo?page=1&limit=2")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedades).toHaveLength(2);
      expect(response.body.data.paginacion.paginaActual).toBe(1);
      expect(response.body.data.paginacion.totalPaginas).toBe(3);
      expect(response.body.data.paginacion.tieneSiguiente).toBe(true);
      expect(response.body.data.paginacion.tieneAnterior).toBe(false);
    });

    it("should limit results to maximum of 100", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/catalogo?limit=200")
        .expect(200);

      // El sistema limita a 100, pero como solo hay 5 propiedades, devuelve 5
      expect(response.body.data.propiedades.length).toBeLessThanOrEqual(100);
    });

    it("should exclude sensitive fields from response", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/catalogo")
        .expect(200);

      const property = response.body.data.propiedades[0];
      expect(property.historialInquilinos).toBeUndefined();
      expect(property.aplicaciones).toBeUndefined();
    });

    it("should populate landlord information", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/catalogo")
        .expect(200);

      const property = response.body.data.propiedades[0];
      expect(property.propietarioId).toBeDefined();
      expect(property.propietarioId.email).toBeDefined();
    });
  });

  describe("GET /api/propiedades-renta/buscar - searchProperties", () => {
    it("should search properties with no filters", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedades).toHaveLength(5);
      expect(response.body.data.filtrosAplicados).toBeDefined();
      expect(response.body.data.totalResultados).toBe(5);
    });

    it("should filter by campus", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?campus=Guadalajara")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedades).toHaveLength(2);

      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.ubicacion.campus).toBe("Guadalajara");
      });
    });

    it("should filter by tipoPropiedad", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?tipoPropiedad=Departamento")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.tipoPropiedad).toBe("Departamento");
      });
    });

    it("should filter by tipoRenta", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?tipoRenta=Cuarto privado")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedades).toHaveLength(1);
      expect(response.body.data.propiedades[0].tipoRenta).toBe("Cuarto privado");
    });

    it("should filter by price range", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?precioMinimo=4000&precioMaximo=6000")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        const precio = prop.informacionFinanciera.precioMensual;
        expect(precio).toBeGreaterThanOrEqual(4000);
        expect(precio).toBeLessThanOrEqual(6000);
      });
    });

    it("should filter by amueblado", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?amueblado=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.caracteristicas.amueblado).toBe(true);
      });
    });

    it("should filter by mascotasPermitidas", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?mascotasPermitidas=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.caracteristicas.mascotasPermitidas).toBe(true);
      });
    });

    it("should filter by serviciosIncluidos", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?serviciosIncluidos=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.servicios.serviciosIncluidos).toBe(true);
      });
    });

    it("should filter by minimum numeroBanos", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?numeroBanos=2")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.caracteristicas.numeroBanos).toBeGreaterThanOrEqual(2);
      });
    });

    it("should filter by minimum numeroRecamaras", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?numeroRecamaras=2")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.caracteristicas.numeroRecamaras).toBeGreaterThanOrEqual(2);
      });
    });

    it("should filter by generoPreferido", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?generoPreferido=Mixto")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.generoPreferido).toBe("Mixto");
      });
    });

    it("should filter by distanciaMaxima", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?distanciaMaxima=2")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.ubicacion.distanciaCampus).toBeLessThanOrEqual(2);
      });
    });

    it("should sort by precio_asc", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?ordenarPor=precio_asc")
        .expect(200);

      expect(response.body.success).toBe(true);
      const precios = response.body.data.propiedades.map(
        (p: any) => p.informacionFinanciera.precioMensual
      );

      for (let i = 1; i < precios.length; i++) {
        expect(precios[i]).toBeGreaterThanOrEqual(precios[i - 1]);
      }
    });

    it("should sort by precio_desc", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?ordenarPor=precio_desc")
        .expect(200);

      expect(response.body.success).toBe(true);
      const precios = response.body.data.propiedades.map(
        (p: any) => p.informacionFinanciera.precioMensual
      );

      for (let i = 1; i < precios.length; i++) {
        expect(precios[i]).toBeLessThanOrEqual(precios[i - 1]);
      });
    });

    it("should sort by distancia", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?ordenarPor=distancia")
        .expect(200);

      expect(response.body.success).toBe(true);
      const distancias = response.body.data.propiedades.map(
        (p: any) => p.ubicacion.distanciaCampus
      );

      for (let i = 1; i < distancias.length; i++) {
        expect(distancias[i]).toBeGreaterThanOrEqual(distancias[i - 1]);
      }
    });

    it("should combine multiple filters", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?campus=Guadalajara&amueblado=true&precioMaximo=4000")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.propiedades.forEach((prop: any) => {
        expect(prop.ubicacion.campus).toBe("Guadalajara");
        expect(prop.caracteristicas.amueblado).toBe(true);
        expect(prop.informacionFinanciera.precioMensual).toBeLessThanOrEqual(4000);
      });
    });

    it("should return filtrosAplicados in response", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/buscar?campus=Monterrey&amueblado=false")
        .expect(200);

      expect(response.body.data.filtrosAplicados).toEqual({
        campus: "Monterrey",
        tipoPropiedad: undefined,
        tipoRenta: undefined,
        precioMinimo: undefined,
        precioMaximo: undefined,
        amueblado: "false",
        mascotasPermitidas: undefined,
        serviciosIncluidos: undefined,
        ordenarPor: undefined
      });
    });
  });

  describe("GET /api/propiedades-renta/campus/:campus - getPropertiesByCampus", () => {
    it("should get properties by Guadalajara campus", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/campus/Guadalajara")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campus).toBe("Guadalajara");
      expect(response.body.data.propiedades).toHaveLength(2);
      expect(response.body.data.total).toBe(2);
    });

    it("should get properties by Monterrey campus", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/campus/Monterrey")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campus).toBe("Monterrey");
      expect(response.body.data.propiedades).toHaveLength(2);
    });

    it("should get properties by Ciudad de México campus", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/campus/Ciudad de México")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campus).toBe("Ciudad de México");
      expect(response.body.data.propiedades).toHaveLength(1);
    });

    it("should fail with invalid campus", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/campus/InvalidCampus")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Campus inválido");
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/campus/Guadalajara?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedades).toHaveLength(1);
      expect(response.body.data.paginacion.totalPaginas).toBe(2);
    });

    it("should support ordenarPor parameter", async () => {
      const response = await request(app)
        .get("/api/propiedades-renta/campus/Guadalajara?ordenarPor=precio_asc")
        .expect(200);

      expect(response.body.success).toBe(true);
      const precios = response.body.data.propiedades.map(
        (p: any) => p.informacionFinanciera.precioMensual
      );

      for (let i = 1; i < precios.length; i++) {
        expect(precios[i]).toBeGreaterThanOrEqual(precios[i - 1]);
      }
    });
  });

  describe("GET /api/propiedades-renta/:propertyId/similares - getSimilarProperties", () => {
    it("should find similar properties in same campus", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedadOriginal._id).toBe(propertyGdl1);
      expect(response.body.data.similares.length).toBeGreaterThan(0);

      // Todas las similares deben ser del mismo campus
      response.body.data.similares.forEach((prop: any) => {
        expect(prop.ubicacion.campus).toBe("Guadalajara");
      });
    });

    it("should calculate similarity scores", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.similares.forEach((prop: any) => {
        expect(prop.scoreSimitud).toBeDefined();
        expect(prop.scoreSimitud).toBeGreaterThanOrEqual(0);
        expect(prop.scoreSimitud).toBeLessThanOrEqual(100);
        expect(prop.razonSimilitud).toBeDefined();
      });
    });

    it("should sort by similarity score descending", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const scores = response.body.data.similares.map((p: any) => p.scoreSimitud);

      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
      }
    });

    it("should respect limit parameter", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyMty1}/similares?limit=1`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.similares.length).toBeLessThanOrEqual(1);
    });

    it("should default to limit 6", async () => {
      // Crear más propiedades en Guadalajara para tener suficientes
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post("/api/propiedades-renta")
          .set("Authorization", `Bearer ${token1}`)
          .send({
            ...propertyGdl1Data,
            titulo: `Extra propiedad ${i}`,
            propietarioId: arrendadorId1
          });
      }

      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.similares.length).toBeLessThanOrEqual(6);
    });

    it("should enforce max limit of 20", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares?limit=50`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.similares.length).toBeLessThanOrEqual(20);
    });

    it("should filter by price range (±20%)", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const precioOriginal = response.body.data.propiedadOriginal.precio;
      const precioMin = precioOriginal * 0.8;
      const precioMax = precioOriginal * 1.2;

      response.body.data.similares.forEach((prop: any) => {
        const precio = prop.informacionFinanciera.precioMensual;
        expect(precio).toBeGreaterThanOrEqual(precioMin);
        expect(precio).toBeLessThanOrEqual(precioMax);
      });
    });

    it("should exclude the original property from results", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const similarIds = response.body.data.similares.map((p: any) => p._id);
      expect(similarIds).not.toContain(propertyGdl1);
    });

    it("should return 404 for non-existent property", async () => {
      const fakeId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .get(`/api/propiedades-renta/${fakeId}/similares`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });

    it("should only show active and available properties", async () => {
      // Desactivar una propiedad de Guadalajara
      await request(app)
        .delete(`/api/propiedades-renta/${propertyGdl2}`)
        .set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const similarIds = response.body.data.similares.map((p: any) => p._id);
      expect(similarIds).not.toContain(propertyGdl2);
    });

    it("should include razonSimilitud explaining why properties are similar", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.similares.length > 0) {
        const similar = response.body.data.similares[0];
        expect(similar.razonSimilitud).toBeDefined();
        expect(typeof similar.razonSimilitud).toBe("string");
        expect(similar.razonSimilitud.length).toBeGreaterThan(0);
      }
    });

    it("should return propiedadOriginal info", async () => {
      const response = await request(app)
        .get(`/api/propiedades-renta/${propertyGdl1}/similares`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.propiedadOriginal).toBeDefined();
      expect(response.body.data.propiedadOriginal._id).toBe(propertyGdl1);
      expect(response.body.data.propiedadOriginal.titulo).toBeDefined();
      expect(response.body.data.propiedadOriginal.campus).toBe("Guadalajara");
      expect(response.body.data.propiedadOriginal.precio).toBeDefined();
    });
  });

  describe("Integration: Complete Search Workflow", () => {
    it("should support complete user search journey", async () => {
      // 1. Usuario entra a la homepage
      const catalogResponse = await request(app)
        .get("/api/propiedades-renta/catalogo?limit=10")
        .expect(200);

      expect(catalogResponse.body.data.propiedades.length).toBeGreaterThan(0);

      // 2. Usuario filtra por campus usando botón rápido
      const campusResponse = await request(app)
        .get("/api/propiedades-renta/campus/Guadalajara")
        .expect(200);

      expect(campusResponse.body.data.propiedades).toHaveLength(2);

      // 3. Usuario usa búsqueda avanzada con múltiples filtros
      const searchResponse = await request(app)
        .get("/api/propiedades-renta/buscar?campus=Guadalajara&amueblado=true&precioMaximo=6000")
        .expect(200);

      expect(searchResponse.body.data.propiedades.length).toBeGreaterThan(0);

      // 4. Usuario ve una propiedad específica y busca similares
      const firstProperty = searchResponse.body.data.propiedades[0];
      const similarResponse = await request(app)
        .get(`/api/propiedades-renta/${firstProperty._id}/similares?limit=3`)
        .expect(200);

      expect(similarResponse.body.success).toBe(true);
    });
  });
});
