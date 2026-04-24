import { ObjectIdZod } from "../../lib/types";
import { model, Schema, Types } from "mongoose";
import { z } from "zod";

/* ----------------------------------------------
    Zod Schemas (Validación en tiempo de ejecución)
------------------------------------------------ */

// Dirección de la propiedad
export const DireccionSchema = z.object({
  calle: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  numero: z.string().optional(),
  colonia: z.string().min(2, "La colonia es requerida"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  estado: z.string().min(2, "El estado es requerido"),
  codigoPostal: z.string().regex(/^\d{5}$/, "Código postal debe ser de 5 dígitos"),
  pais: z.string().default("México"),
  referencias: z.string().optional(),
});

// Características de la propiedad
export const CaracteristicasSchema = z.object({
  metrosCuadrados: z.number().min(1, "Los metros cuadrados deben ser mayor a 0").optional(),
  numeroBanos: z.number().int().min(1, "Debe tener al menos 1 baño"),
  numeroRecamaras: z.number().int().min(0, "Número de recámaras no puede ser negativo"),
  piso: z.number().int().min(0, "El piso no puede ser negativo").optional(),
  amueblado: z.boolean().default(false),
  muebles: z.array(z.enum([
    "Cama",
    "Escritorio",
    "Silla",
    "Armario",
    "Refrigerador",
    "Microondas",
    "Lavadora",
    "Secadora",
    "Televisión",
    "Sofa",
    "Mesa de comedor",
    "Estufa",
    "Aire acondicionado"
  ])).default([]),
  mascotasPermitidas: z.boolean().default(false),
  tiposMascotas: z.array(z.enum(["Perros", "Gatos", "Aves", "Peces", "Otros"])).default([]),
});

// Servicios incluidos
export const ServiciosSchema = z.object({
  serviciosIncluidos: z.boolean().default(false),
  listaServicios: z.array(z.enum([
    "Luz",
    "Agua",
    "Gas",
    "Internet",
    "Cable/TV",
    "Limpieza",
    "Mantenimiento",
    "Seguridad",
    "Estacionamiento",
    "Lavandería"
  ])).default([]),
  costoServicios: z.number().min(0, "El costo de servicios no puede ser negativo").default(0),
});

// Políticas y reglas
export const PoliticasSchema = z.object({
  reglasConvivencia: z.array(z.string()).default([]),
  horarioVisitas: z.string().optional(),
  fiestas: z.boolean().default(false),
  fumar: z.boolean().default(false),
  alcohol: z.boolean().default(false),
  parejasPermitidas: z.boolean().default(true),
});

// Ubicación y proximidad
export const UbicacionSchema = z.object({
  campus: z.enum(["Guadalajara", "Monterrey", "Ciudad de México", "Otro"]).default("Guadalajara"),
  distanciaCampus: z.number().min(0, "La distancia no puede ser negativa"),
  unidadDistancia: z.enum(["metros", "kilómetros"]).default("kilómetros"),
  transporte: z.array(z.enum([
    "Camión urbano",
    "Metro",
    "Metrobús",
    "Taxi",
    "Uber/DiDi",
    "Bicicleta",
    "A pie"
  ])).default([]),
  tiempoTraslado: z.number().min(1, "El tiempo de traslado debe ser mayor a 0").optional(),
});

// Información financiera
export const InformacionFinancieraSchema = z.object({
  precioMensual: z.number().min(1, "El precio mensual debe ser mayor a 0"),
  deposito: z.number().min(0, "El depósito no puede ser negativo").default(0),
  comisionAgencia: z.number().min(0, "La comisión no puede ser negativa").default(0),
  incrementoAnual: z.number().min(0, "El incremento anual no puede ser negativo").default(0),
  descuentos: z.object({
    estudiantil: z.number().min(0).max(100).default(0),
    pronto: z.number().min(0).max(100).default(0),
    largo: z.number().min(0).max(100).default(0),
  }).default({}),
});

// Catálogo de baños de la propiedad
export const BanoSchema = z.object({
  indice: z.number().int().nonnegative(),
  alias: z.string().max(50).default(""),
  imagenes: z.array(z.string()).default([]),
});

// Habitación individual vinculada a un baño del catálogo
export const HabitacionSchema = z.object({
  indice: z.number().int().nonnegative(),
  precio: z.number().int().positive().optional(),
  hasFurniture: z.boolean().nullable().optional(),
  furniture: z.array(z.string()).default([]),
  bedType: z.string().default(""),
  bedroomType: z.string().default(""),
  sharedWithCount: z.number().int().min(2).max(6).optional(),
  banoIndice: z.number().int().nonnegative(),
  imagenes: z.array(z.string()).default([]),
});

// Disponibilidad y contrato
export const DisponibilidadSchema = z.object({
  fechaDisponible: z.date().default(() => new Date()),
  duracionMinimaContrato: z.number().int().min(1, "La duración mínima debe ser al menos 1 mes").default(6),
  duracionMaximaContrato: z.number().int().min(1, "La duración máxima debe ser al menos 1 mes").default(12),
  renovacionAutomatica: z.boolean().default(false),
  disponible: z.boolean().default(true),
});

// Esquema principal de propiedad de renta
export const PropiedadRentaSchema = z.object({
  _id: ObjectIdZod.optional(),

  // Información básica
  titulo: z.string().min(10, "El título debe tener al menos 10 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  descripcion: z.string().min(50, "La descripción debe tener al menos 50 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  resumen: z.string().min(20, "El resumen debe tener al menos 20 caracteres")
    .max(200, "El resumen no puede exceder 200 caracteres"),

  // Tipo de propiedad y renta
  tipoPropiedad: z.enum([
    "Casa",
    "Departamento",
    "Cuarto",
    "Studio",
    "Loft",
    "Casa de huéspedes"
  ]),
  tipoRenta: z.enum([
    "Propiedad completa",
    "Cuarto privado",
    "Cuarto compartido",
    "Cama en dormitorio"
  ]),

  // Preferencias de inquilinos
  generoPreferido: z.enum([
    "Solo hombres",
    "Solo mujeres",
    "Mixto",
    "Sin preferencia"
  ]).default("Sin preferencia"),
  capacidadMaxima: z.number().int().min(1, "La capacidad máxima debe ser al menos 1")
    .max(20, "La capacidad máxima no puede exceder 20"),
  edadMinima: z.number().int().min(17, "La edad mínima debe ser al menos 17").default(18),
  edadMaxima: z.number().int().min(18, "La edad máxima debe ser al menos 18").default(30),

  // Subdocumentos
  direccion: DireccionSchema,
  caracteristicas: CaracteristicasSchema,
  servicios: ServiciosSchema,
  politicas: PoliticasSchema,
  ubicacion: UbicacionSchema,
  informacionFinanciera: InformacionFinancieraSchema,
  disponibilidad: DisponibilidadSchema,

  // Catálogo de baños y habitaciones individuales (opcional, para propiedades que registran cada habitación)
  banos: z.array(BanoSchema).default([]),
  habitaciones: z.array(HabitacionSchema).default([]),

  // Multimedia
  imagenes: z.object({
    principal: z.string().url("La imagen principal debe ser una URL válida"),
    galeria: z.array(z.string().url("Todas las imágenes deben ser URLs válidas")).default([]),
    tour360: z.string().url().optional(),
  }),

  // Valoraciones y estadísticas
  calificacion: z.number().min(0).max(5).default(0),
  numeroReviews: z.number().int().min(0).default(0),
  vistas: z.number().int().min(0).default(0),
  favoritos: z.number().int().min(0).default(0),

  // Relaciones
  propietarioId: ObjectIdZod,
  inquilinosActuales: z.array(ObjectIdZod).default([]),
  aplicaciones: z.array(ObjectIdZod).default([]),
  historialInquilinos: z.array(ObjectIdZod).default([]),

  // Estado y metadata
  estado: z.enum([
    "Activa",
    "Inactiva",
    "Rentada",
    "En mantenimiento",
    "Pausada"
  ]).default("Activa"),
  verificada: z.boolean().default(false),
  destacada: z.boolean().default(false),

  // Timestamps
  fechaCreacion: z.date().default(() => new Date()),
  fechaActualizacion: z.date().default(() => new Date()),
  fechaPublicacion: z.date().optional(),
});

/* ----------------------------------------------
    TypeScript Types (Inferidos desde Zod)
------------------------------------------------ */
export type Direccion = z.infer<typeof DireccionSchema>;
export type Caracteristicas = z.infer<typeof CaracteristicasSchema>;
export type Servicios = z.infer<typeof ServiciosSchema>;
export type Politicas = z.infer<typeof PoliticasSchema>;
export type Ubicacion = z.infer<typeof UbicacionSchema>;
export type InformacionFinanciera = z.infer<typeof InformacionFinancieraSchema>;
export type Disponibilidad = z.infer<typeof DisponibilidadSchema>;
export type Bano = z.infer<typeof BanoSchema>;
export type Habitacion = z.infer<typeof HabitacionSchema>;
export type PropiedadRenta = z.infer<typeof PropiedadRentaSchema>;

/* ----------------------------------------------
    MongoDB Schemas (Mongoose)
------------------------------------------------ */

// Subdocumento: dirección
const DireccionMongoSchema = new Schema<Direccion>({
  calle: { type: String, required: true },
  numero: String,
  colonia: { type: String, required: true },
  ciudad: { type: String, required: true },
  estado: { type: String, required: true },
  codigoPostal: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{5}$/.test(v),
      message: "Código postal debe ser de 5 dígitos"
    }
  },
  pais: { type: String, default: "México" },
  referencias: String,
});

// Subdocumento: características
const CaracteristicasMongoSchema = new Schema<Caracteristicas>({
  metrosCuadrados: { type: Number, min: 1 },
  numeroBanos: { type: Number, required: true, min: 1 },
  numeroRecamaras: { type: Number, required: true, min: 0 },
  piso: { type: Number, min: 0 },
  amueblado: { type: Boolean, default: false },
  muebles: [{
    type: String,
    enum: [
      "Cama", "Escritorio", "Silla", "Armario", "Refrigerador",
      "Microondas", "Lavadora", "Secadora", "Televisión", "Sofa",
      "Mesa de comedor", "Estufa", "Aire acondicionado"
    ]
  }],
  mascotasPermitidas: { type: Boolean, default: false },
  tiposMascotas: [{
    type: String,
    enum: ["Perros", "Gatos", "Aves", "Peces", "Otros"]
  }],
});

// Subdocumento: servicios
const ServiciosMongoSchema = new Schema<Servicios>({
  serviciosIncluidos: { type: Boolean, default: false },
  listaServicios: [{
    type: String,
    enum: [
      "Luz", "Agua", "Gas", "Internet", "Cable/TV",
      "Limpieza", "Mantenimiento", "Seguridad", "Estacionamiento", "Lavandería"
    ]
  }],
  costoServicios: { type: Number, min: 0, default: 0 },
});

// Subdocumento: políticas
const PoliticasMongoSchema = new Schema<Politicas>({
  reglasConvivencia: [String],
  horarioVisitas: String,
  fiestas: { type: Boolean, default: false },
  fumar: { type: Boolean, default: false },
  alcohol: { type: Boolean, default: false },
  parejasPermitidas: { type: Boolean, default: true },
});

// Subdocumento: ubicación
const UbicacionMongoSchema = new Schema<Ubicacion>({
  campus: {
    type: String,
    enum: ["Guadalajara", "Monterrey", "Ciudad de México", "Otro"],
    default: "Guadalajara"
  },
  distanciaCampus: { type: Number, required: true, min: 0 },
  unidadDistancia: {
    type: String,
    enum: ["metros", "kilómetros"],
    default: "kilómetros"
  },
  transporte: [{
    type: String,
    enum: [
      "Camión urbano", "Metro", "Metrobús", "Taxi",
      "Uber/DiDi", "Bicicleta", "A pie"
    ]
  }],
  tiempoTraslado: { type: Number, min: 1 },
});

// Subdocumento: información financiera
const InformacionFinancieraMongoSchema = new Schema<InformacionFinanciera>({
  precioMensual: { type: Number, required: true, min: 1 },
  deposito: { type: Number, min: 0, default: 0 },
  comisionAgencia: { type: Number, min: 0, default: 0 },
  incrementoAnual: { type: Number, min: 0, default: 0 },
  descuentos: {
    estudiantil: { type: Number, min: 0, max: 100, default: 0 },
    pronto: { type: Number, min: 0, max: 100, default: 0 },
    largo: { type: Number, min: 0, max: 100, default: 0 },
  },
});

// Subdocumento: baño del catálogo
const BanoMongoSchema = new Schema<Bano>({
  indice: { type: Number, required: true, min: 0 },
  alias: { type: String, default: "", maxlength: 50 },
  imagenes: [{ type: String }],
}, { _id: false });

// Subdocumento: habitación individual vinculada a un baño
const HabitacionMongoSchema = new Schema<Habitacion>({
  indice: { type: Number, required: true, min: 0 },
  precio: { type: Number, min: 1 },
  hasFurniture: { type: Boolean, default: null },
  furniture: [{ type: String }],
  bedType: { type: String, default: "" },
  bedroomType: { type: String, default: "" },
  sharedWithCount: { type: Number, min: 2, max: 6 },
  banoIndice: { type: Number, required: true, min: 0 },
  imagenes: [{ type: String }],
}, { _id: false });

// Subdocumento: disponibilidad
const DisponibilidadMongoSchema = new Schema<Disponibilidad>({
  fechaDisponible: { type: Date, default: Date.now },
  duracionMinimaContrato: { type: Number, required: true, min: 1, default: 6 },
  duracionMaximaContrato: { type: Number, required: true, min: 1, default: 12 },
  renovacionAutomatica: { type: Boolean, default: false },
  disponible: { type: Boolean, default: true },
});

// Documento principal: propiedad de renta
const PropiedadRentaMongoSchema = new Schema<PropiedadRenta>({
  // Información básica
  titulo: { type: String, required: true, minlength: 10, maxlength: 100 },
  descripcion: { type: String, required: true, minlength: 50, maxlength: 1000 },
  resumen: { type: String, required: true, minlength: 20, maxlength: 200 },

  // Tipo de propiedad y renta
  tipoPropiedad: {
    type: String,
    required: true,
    enum: ["Casa", "Departamento", "Cuarto", "Studio", "Loft", "Casa de huéspedes"]
  },
  tipoRenta: {
    type: String,
    required: true,
    enum: ["Propiedad completa", "Cuarto privado", "Cuarto compartido", "Cama en dormitorio"]
  },

  // Preferencias de inquilinos
  generoPreferido: {
    type: String,
    enum: ["Solo hombres", "Solo mujeres", "Mixto", "Sin preferencia"],
    default: "Sin preferencia"
  },
  capacidadMaxima: { type: Number, required: true, min: 1, max: 20 },
  edadMinima: { type: Number, min: 17, default: 18 },
  edadMaxima: { type: Number, min: 18, default: 30 },

  // Subdocumentos
  direccion: { type: DireccionMongoSchema, required: true },
  caracteristicas: { type: CaracteristicasMongoSchema, required: true },
  servicios: { type: ServiciosMongoSchema, required: true },
  politicas: { type: PoliticasMongoSchema, required: true },
  ubicacion: { type: UbicacionMongoSchema, required: true },
  informacionFinanciera: { type: InformacionFinancieraMongoSchema, required: true },
  disponibilidad: { type: DisponibilidadMongoSchema, required: true },

  // Catálogo de baños y habitaciones individuales
  banos: { type: [BanoMongoSchema], default: [] },
  habitaciones: { type: [HabitacionMongoSchema], default: [] },

  // Multimedia
  imagenes: {
    principal: { type: String, required: true },
    galeria: [String],
    tour360: String,
  },

  // Valoraciones y estadísticas
  calificacion: { type: Number, min: 0, max: 5, default: 0 },
  numeroReviews: { type: Number, min: 0, default: 0 },
  vistas: { type: Number, min: 0, default: 0 },
  favoritos: { type: Number, min: 0, default: 0 },

  // Relaciones
  propietarioId: [{ type: Types.ObjectId, ref: 'Arrendador', required: true }],
  inquilinosActuales: [{ type: Types.ObjectId, ref: 'User' }],
  aplicaciones: [{ type: Types.ObjectId, ref: 'Application' }],
  historialInquilinos: [{ type: Types.ObjectId, ref: 'User' }],

  // Estado y metadata
  estado: {
    type: String,
    enum: ["Activa", "Inactiva", "Rentada", "En mantenimiento", "Pausada"],
    default: "Activa"
  },
  verificada: { type: Boolean, default: false },
  destacada: { type: Boolean, default: false },

  // Timestamps
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
  fechaPublicacion: Date,
});

// Middleware para actualizar fechaActualizacion
PropiedadRentaMongoSchema.pre('save', function(next) {
  this.fechaActualizacion = new Date();
  next();
});

// Indexes para queries frecuentes a escala
PropiedadRentaMongoSchema.index({ estado: 1, "disponibilidad.disponible": 1 });
PropiedadRentaMongoSchema.index({ "ubicacion.campus": 1, estado: 1 });
PropiedadRentaMongoSchema.index({ "informacionFinanciera.precioMensual": 1 });
PropiedadRentaMongoSchema.index({ propietarioId: 1, estado: 1 });
PropiedadRentaMongoSchema.index({ fechaCreacion: -1 });
PropiedadRentaMongoSchema.index({ tipoPropiedad: 1, estado: 1 });

/* ----------------------------------------------
    MongoDB Models (Mongoose)
------------------------------------------------ */
export const PropiedadRentaDB = model("PropiedadRenta", PropiedadRentaMongoSchema, "PropiedadesRenta");