import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { connect, disconnect } from "mongoose";

import { ArrendadorDB, PropertyDB } from "@/arrendador/models/arrendador.schema.ts";
import { PropiedadRentaDB, PeticionDB } from "../models";
import { UserDB } from "@/user/models/userMissing.schema.ts";
import propertyRoutes from "../routes/index";
import arrendadorRoutes from "../../arrendador/routes/index";

const app = express();
app.use(express.json());
app.use("/api", propertyRoutes);
app.use("/api", arrendadorRoutes);

let arrendadorId: string;
let arrendadorToken: string;
let propertyId1: string;
let propertyId2: string;
let peticionId1: string;
let peticionId2: string;
let peticionId3: string;
let testUserId1: string;
let testUserId2: string;
let testUserId3: string;

const testArrendador = {
  email: "peticion.test@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Peticion Test Arrendador",
    phone: "+52 33 1234 5678"
  }
};

const testProperty1 = {
  titulo: "Departamento para peticiones test - Guadalajara",
  descripcion: "Amplio departamento cerca del campus Guadalajara, ideal para estudiantes. Cuenta con todas las comodidades necesarias para una estancia cómoda y productiva.",
  resumen: "Departamento amueblado 2 recámaras cerca de campus",
  tipoPropiedad: "Departamento",
  tipoRenta: "Propiedad completa",
  generoPreferido: "Mixto",
  capacidadMaxima: 3,
  direccion: {
    calle: "Test Street 123",
    numero: "100",
    colonia: "Test Colony",
    ciudad: "Test City",
    estado: "Test State",
    codigoPostal: "12345",
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
    tiposMascotas: ["Perros", "Gatos"],
    estacionamiento: true
  },
  servicios: {
    serviciosIncluidos: true,
    listaServicios: ["Luz", "Agua", "Internet"],
    amenidades: []
  },
  informacionFinanciera: {
    precioMensual: 8500,
    deposito: 8500
  },
  disponibilidad: {
    disponible: true,
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
    principal: "https://test.com/image1.jpg",
    galeria: []
  }
};

const testProperty2 = {
  titulo: "Casa para peticiones test - Monterrey",
  descripcion: "Hermosa casa en zona residencial cerca del Tec de Monterrey. Perfecta para grupo de estudiantes que buscan tranquilidad y espacio para estudiar.",
  resumen: "Casa 3 recámaras zona residencial cerca de campus",
  tipoPropiedad: "Casa",
  tipoRenta: "Propiedad completa",
  generoPreferido: "Solo mujeres",
  capacidadMaxima: 5,
  direccion: {
    calle: "Second Test Street 456",
    numero: "200",
    colonia: "Second Colony",
    ciudad: "Second Test City",
    estado: "Second Test State",
    codigoPostal: "67890",
    pais: "México"
  },
  ubicacion: {
    campus: "Monterrey",
    distanciaCampus: 3.0
  },
  caracteristicas: {
    numeroRecamaras: 3,
    numeroBanos: 2,
    areaConstruccion: 120,
    areaTotal: 150,
    amueblado: false,
    mascotasPermitidas: false,
    tiposMascotas: [],
    estacionamiento: true
  },
  servicios: {
    serviciosIncluidos: false,
    listaServicios: [],
    amenidades: []
  },
  informacionFinanciera: {
    precioMensual: 12000,
    deposito: 12000
  },
  disponibilidad: {
    disponible: true,
    duracionMinimaContrato: 12,
    duracionMaximaContrato: 24
  },
  politicas: {
    fumadoresPermitidos: false,
    fiestasPermitidas: false,
    mascotasPermitidas: false,
    edadMinima: 18,
    edadMaxima: 35
  },
  imagenes: {
    principal: "https://test.com/image2.jpg",
    galeria: []
  }
};

const testUser1 = {
  email: "testuser1@tec.mx",
  password: "TestPassword123!",
  sex: "hombre",
  preferences: {
    nombres: "Juan Carlos",
    apellidoPaterno: "González",
    fotoPerfilUrl: "https://test.com/photo1.jpg",
    edad: 22,
    genero: "Masculino",
    nacionalidad: "Mexicano",
    estadoOrigen: "Jalisco",
    hobbies: ["Futbol", "Lectura", "Videojuegos"],
    noNegociables: ["No fumadores", "Limpieza", "Respeto"],
    preferenciaRoomies: "Mixto",
    tieneMascota: false,
    nivelEducativo: "Licenciatura",
    areaPrograma: "ITCS",
    semestreOGraduacion: "8vo semestre",
    contactoEmergencia: {
      nombre: "María González",
      telefono: "+52 33 9999 8888"
    }
  }
};

const testUser2 = {
  email: "testuser2@tec.mx",
  password: "TestPassword123!",
  sex: "mujer",
  preferences: {
    nombres: "Ana María",
    apellidoPaterno: "López",
    fotoPerfilUrl: "https://test.com/photo2.jpg",
    edad: 21,
    genero: "Femenino",
    nacionalidad: "Mexicano",
    estadoOrigen: "Nuevo León",
    hobbies: ["Yoga", "Cocinar", "Arte"],
    noNegociables: ["No ruido", "Limpieza", "Mascotas"],
    preferenciaRoomies: "Solo mujeres",
    tieneMascota: true,
    tipoMascota: "Gato",
    nivelEducativo: "Licenciatura",
    areaPrograma: "IARQ",
    semestreOGraduacion: "6to semestre",
    contactoEmergencia: {
      nombre: "Roberto López",
      telefono: "+52 81 8888 7777"
    }
  }
};

const testUser3 = {
  email: "testuser3@tec.mx",
  password: "TestPassword123!",
  sex: "hombre",
  preferences: {
    nombres: "Pedro Luis",
    apellidoPaterno: "Martínez",
    edad: 23,
    genero: "Masculino",
    nacionalidad: "Mexicano",
    hobbies: ["Música", "Deportes"],
    noNegociables: ["Respeto", "Puntualidad", "Orden"],
    preferenciaRoomies: "Mixto",
    tieneMascota: false,
    nivelEducativo: "Maestría",
    areaPrograma: "ITEC",
    contactoEmergencia: {
      nombre: "Laura Martínez",
      telefono: "+52 33 7777 6666"
    }
  }
};

const peticionData1 = {
  userId: "", // NOTE: Will be set during test setup
  oferta: {
    montoOfrecidoMXN: 8000,
    numeroOfertas: 1,
    historialOfertas: [8000]
  }
};

const peticionData2 = {
  userId: "", // NOTE: Will be set during test setup
  oferta: {
    montoOfrecidoMXN: 11500,
    numeroOfertas: 2,
    historialOfertas: [11000, 11500]
  }
};

const peticionData3 = {
  userId: "", // NOTE: Will be set during test setup
  // Sin oferta económica
};

beforeAll(async () => {
  const mongoUrl = process.env.TEST_DB_URL || "mongodb://admin:password@localhost:27017/liviko_test?authSource=admin";
  await connect(mongoUrl);
});

afterAll(async () => {
  await ArrendadorDB.deleteMany({});
  await PropertyDB.deleteMany({});
  await PropiedadRentaDB.deleteMany({});
  await PeticionDB.deleteMany({});
  await UserDB.deleteMany({});
  await disconnect();
});

beforeEach(async () => {
  await ArrendadorDB.deleteMany({});
  await PropertyDB.deleteMany({});
  await PropiedadRentaDB.deleteMany({});
  await PeticionDB.deleteMany({});
  await UserDB.deleteMany({});

  const user1 = await UserDB.create(testUser1);
  const user2 = await UserDB.create(testUser2);
  const user3 = await UserDB.create(testUser3);

  testUserId1 = user1._id.toString();
  testUserId2 = user2._id.toString();
  testUserId3 = user3._id.toString();

  peticionData1.userId = testUserId1;
  peticionData2.userId = testUserId2;
  peticionData3.userId = testUserId3;

  const registerResponse = await request(app)
    .post("/api/arrendadores/registro")
    .send(testArrendador);

  if (!registerResponse.body.success) {
    console.error("Registration failed:", registerResponse.body);
    throw new Error("Failed to register arrendador");
  }

  arrendadorId = registerResponse.body.data.id;
  arrendadorToken = registerResponse.body.data.token;

  const property1Response = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${arrendadorToken}`)
    .send({ ...testProperty1, propietarioId: arrendadorId });

  if (!property1Response.body.success) {
    console.error("Property 1 creation failed:", property1Response.status, property1Response.body);
    throw new Error("Failed to create property 1");
  }

  propertyId1 = property1Response.body.data._id;

  const property2Response = await request(app)
    .post("/api/propiedades-renta")
    .set("Authorization", `Bearer ${arrendadorToken}`)
    .send({ ...testProperty2, propietarioId: arrendadorId });

  if (!property2Response.body.success) {
    console.error("Property 2 creation failed:", property2Response.status, property2Response.body);
    throw new Error("Failed to create property 2");
  }

  propertyId2 = property2Response.body.data._id;

  console.log("Setup complete:", { arrendadorId, propertyId1, propertyId2, testUserId1, testUserId2, testUserId3 });
});

describe("Peticiones - User Endpoint", () => {
  describe("POST /api/propiedades-renta/:propertyId/solicitar", () => {
    it("should create a petition with complete data successfully", async () => {
      console.log("Request body:", peticionData1);
      console.log("Request URL:", `/api/propiedades-renta/${propertyId1}/solicitar`);
      const response = await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send(peticionData1);

      console.log("Petition response status:", response.status);
      console.log("Petition response body:", response.body);

      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
      }

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.propertyId).toBe(propertyId1);
      expect(response.body.data.usuarioVisible.nombres).toBe("Juan Carlos");
      expect(response.body.data.usuarioVisible.apellidoPaterno).toBe("González");
      expect(response.body.data.contexto.estatus).toBe("En proceso");
      expect(response.body.data.oferta.montoOfrecidoMXN).toBe(8000);

      peticionId1 = response.body.data._id;
    });

    it("should create a petition without economic offer successfully", async () => {
      const response = await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send(peticionData3)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.usuarioVisible.nombres).toBe("Pedro Luis");
      expect(response.body.data.oferta).toBeUndefined();
    });

    it("should create multiple petitions for different properties", async () => {
      const response1 = await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send(peticionData1)
        .expect(201);

      expect(response1.body.success).toBe(true);
      peticionId1 = response1.body.data._id;

      const response2 = await request(app)
        .post(`/api/propiedades-renta/${propertyId2}/solicitar`)
        .send(peticionData2)
        .expect(201);

      expect(response2.body.success).toBe(true);
      peticionId2 = response2.body.data._id;

      expect(peticionId1).not.toBe(peticionId2);
      expect(response1.body.data.propertyId).toBe(propertyId1);
      expect(response2.body.data.propertyId).toBe(propertyId2);
    });

    it("should fail when property does not exist", async () => {
      const fakePropertyId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .post(`/api/propiedades-renta/${fakePropertyId}/solicitar`)
        .send(peticionData1)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });

    it("should fail with missing required user data aka: user id", async () => {
      const incompleteData = {};

      const response = await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("requerido");
    });

    it("should store contact emergency information correctly", async () => {
      const response = await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send(peticionData1)
        .expect(201);

      expect(response.body.data.usuarioVisible.contactoEmergencia).toBeDefined();
      expect(response.body.data.usuarioVisible.contactoEmergencia.nombre).toBe("María González");
      expect(response.body.data.usuarioVisible.contactoEmergencia.telefono).toBe("+52 33 9999 8888");
    });

    it("should store hobbies and non-negotiables correctly", async () => {
      const response = await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send(peticionData1)
        .expect(201);

      expect(response.body.data.usuarioVisible.hobbies).toHaveLength(3);
      expect(response.body.data.usuarioVisible.hobbies).toContain("Futbol");
      expect(response.body.data.usuarioVisible.noNegociables).toHaveLength(3);
      expect(response.body.data.usuarioVisible.noNegociables).toContain("No fumadores");
    });

    it("should store pet information when user has pet", async () => {
      const response = await request(app)
        .post(`/api/propiedades-renta/${propertyId2}/solicitar`)
        .send(peticionData2)
        .expect(201);

      expect(response.body.data.usuarioVisible.tieneMascota).toBe(true);
      expect(response.body.data.usuarioVisible.tipoMascota).toBe("Gato");
    });

    it("should store offer history when provided", async () => {
      const response = await request(app)
        .post(`/api/propiedades-renta/${propertyId2}/solicitar`)
        .send(peticionData2)
        .expect(201);

      expect(response.body.data.oferta.numeroOfertas).toBe(2);
      expect(response.body.data.oferta.historialOfertas).toHaveLength(2);
      expect(response.body.data.oferta.historialOfertas).toContain(11000);
      expect(response.body.data.oferta.historialOfertas).toContain(11500);
    });
  });
});

describe("Peticiones - Arrendador Endpoints", () => {
  beforeEach(async () => {
    const res1 = await request(app)
      .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
      .send(peticionData1);

    if (!res1.body.success) {
      console.error("Failed to create petition 1:", res1.status, res1.body);
    }
    peticionId1 = res1.body.data?._id;

    const res2 = await request(app)
      .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
      .send(peticionData3);

    if (!res2.body.success) {
      console.error("Failed to create petition 2:", res2.status, res2.body);
    }
    peticionId2 = res2.body.data?._id;

    const res3 = await request(app)
      .post(`/api/propiedades-renta/${propertyId2}/solicitar`)
      .send(peticionData2);

    if (!res3.body.success) {
      console.error("Failed to create petition 3:", res3.status, res3.body);
    }
    peticionId3 = res3.body.data?._id;
  });

  describe("GET /api/propiedades/:arrendadorId/peticiones", () => {
    it("should list all petitions for arrendador", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it("should filter petitions by propertyId", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones?propertyId=${propertyId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);

      // Verificar que todas las peticiones son de la propiedad correcta
      response.body.data.forEach((peticion: any) => {
        expect(peticion.propertyId).toBe(propertyId1);
      });
    });

    it("should filter petitions by another propertyId", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones?propertyId=${propertyId2}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].propertyId).toBe(propertyId2);
    });

    it("should return empty array when filtering by non-existent property", async () => {
      const fakePropertyId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones?propertyId=${fakePropertyId}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });

    it("should return petitions sorted by date (newest first)", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);

      // Verificar orden descendente por fecha
      for (let i = 0; i < response.body.data.length - 1; i++) {
        const fecha1 = new Date(response.body.data[i].createdAt);
        const fecha2 = new Date(response.body.data[i + 1].createdAt);
        expect(fecha1.getTime()).toBeGreaterThanOrEqual(fecha2.getTime());
      }
    });

    it("should fail when arrendador does not exist", async () => {
      const fakeArrendadorId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .get(`/api/propiedades/${fakeArrendadorId}/peticiones`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrado");
    });
  });

  describe("GET /api/propiedades/:arrendadorId/peticiones/:peticionId", () => {
    it("should get a specific petition with all details", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(peticionId1);
      expect(response.body.data.propertyId).toBe(propertyId1);
    });

    it("should return complete user visible information", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const { usuarioVisible } = response.body.data;

      // Verificar información personal visible
      expect(usuarioVisible.nombres).toBe("Juan Carlos");
      expect(usuarioVisible.apellidoPaterno).toBe("González");
      expect(usuarioVisible.fotoPerfilUrl).toBeDefined();
      expect(usuarioVisible.edad).toBe(22);
      expect(usuarioVisible.genero).toBe("Masculino");
      expect(usuarioVisible.nacionalidad).toBe("Mexicano");
      expect(usuarioVisible.estadoOrigen).toBe("Jalisco");
    });

    it("should return hobbies and preferences", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const { usuarioVisible } = response.body.data;

      expect(usuarioVisible.hobbies).toBeInstanceOf(Array);
      expect(usuarioVisible.hobbies.length).toBeGreaterThan(0);
      expect(usuarioVisible.noNegociables).toBeInstanceOf(Array);
      expect(usuarioVisible.noNegociables.length).toBeGreaterThanOrEqual(3);
      expect(usuarioVisible.preferenciaRoomies).toBeDefined();
    });

    it("should return educational information", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const { usuarioVisible } = response.body.data;

      expect(usuarioVisible.nivelEducativo).toBe("Licenciatura");
      expect(usuarioVisible.areaPrograma).toBe("ITCS");
      expect(usuarioVisible.semestreOGraduacion).toBe("8vo semestre");
    });

    it("should return emergency contact information", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const { usuarioVisible } = response.body.data;

      expect(usuarioVisible.contactoEmergencia).toBeDefined();
      expect(usuarioVisible.contactoEmergencia.nombre).toBe("María González");
      expect(usuarioVisible.contactoEmergencia.telefono).toBe("+52 33 9999 8888");
    });

    it("should return pet information when applicable", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId3}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const { usuarioVisible } = response.body.data;

      expect(usuarioVisible.tieneMascota).toBe(true);
      expect(usuarioVisible.tipoMascota).toBe("Gato");
    });

    it("should return context information", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const { contexto } = response.body.data;

      expect(contexto).toBeDefined();
      expect(contexto.propertyId).toBe(propertyId1);
      expect(contexto.fechaSolicitud).toBeDefined();
      expect(contexto.estatus).toBe("En proceso");
    });

    it("should return economic offer when provided", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const { oferta } = response.body.data;

      expect(oferta).toBeDefined();
      expect(oferta.montoOfrecidoMXN).toBe(8000);
      expect(oferta.numeroOfertas).toBe(1);
      expect(oferta.historialOfertas).toContain(8000);
    });

    it("should handle petition without economic offer", async () => {
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${peticionId2}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.oferta).toBeUndefined();
    });

    it("should fail when petition does not exist", async () => {
      const fakePeticionId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${fakePeticionId}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrada");
    });

    it("should fail when arrendador does not exist", async () => {
      const fakeArrendadorId = "64a7b8c9d1e2f3a4b5c6d7e8";
      const response = await request(app)
        .get(`/api/propiedades/${fakeArrendadorId}/peticiones/${peticionId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("no encontrado");
    });
  });

  describe("Integration - Full workflow", () => {
    it("should support complete petition workflow: create -> list -> get details", async () => {
      // 1. User creates a petition
      const createResponse = await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send(peticionData1)
        .expect(201);

      const newPeticionId = createResponse.body.data._id;
      expect(newPeticionId).toBeDefined();

      // 2. Arrendador lists all petitions
      const listResponse = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(listResponse.body.data.some((p: any) => p._id === newPeticionId)).toBe(true);

      // 3. Arrendador gets specific petition details
      const detailResponse = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones/${newPeticionId}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      expect(detailResponse.body.data._id).toBe(newPeticionId);
      expect(detailResponse.body.data.usuarioVisible.nombres).toBe("Juan Carlos");
    });

    it("should support filtering workflow for arrendador with multiple properties", async () => {
      await request(app)
        .post(`/api/propiedades-renta/${propertyId1}/solicitar`)
        .send({ ...peticionData1, usuarioVisible: { ...peticionData1, nombres: "Test1" } });

      await request(app)
        .post(`/api/propiedades-renta/${propertyId2}/solicitar`)
        .send({ ...peticionData2, usuarioVisible: { ...peticionData2, nombres: "Test2" } });

      const allResponse = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const totalPeticiones = allResponse.body.data.length;
      expect(totalPeticiones).toBeGreaterThanOrEqual(5); // 3 del beforeEach + 2 nuevas

      const prop1Response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones?propertyId=${propertyId1}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const prop1Count = prop1Response.body.data.length;
      expect(prop1Count).toBeGreaterThan(0);

      const prop2Response = await request(app)
        .get(`/api/propiedades/${arrendadorId}/peticiones?propertyId=${propertyId2}`)
        .set("Authorization", `Bearer ${arrendadorToken}`)
        .expect(200);

      const prop2Count = prop2Response.body.data.length;
      expect(prop2Count).toBeGreaterThan(0);

      expect(prop1Count + prop2Count).toBe(totalPeticiones);
    });
  });
});
