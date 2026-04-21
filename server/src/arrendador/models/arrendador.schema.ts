import { ObjectIdZod } from "../../lib/types";
import { model, Schema, Types } from "mongoose";
import { z } from "zod";

/* ----------------------------------------------
    Zod Schemas (Validación en tiempo de ejecución)
------------------------------------------------ */

// Perfil de arrendador
export const ArrendadorProfileSchema = z.object({
  profilePicture: z.string().url().optional(),
  officialId: z.object({
    type: z.enum(["INE", "passport", "license"]),
    fileUrl: z.string().url(),
    fileName: z.string(),
  }).optional(),
  dateOfBirth: z.object({
    day: z.number().min(1).max(31),
    month: z.number().min(1).max(12),
    year: z.number().min(1900).max(new Date().getFullYear()),
  }).optional(),
  gender: z.enum(["masculino", "femenino", "otro"]).optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  isVerified: z.boolean().default(false),
});

// Propiedad que puede registrar un arrendador
export const PropertySchema = z.object({
  _id: ObjectIdZod.optional(),
  propertyType: z.enum(["Casa", "Departamento", "Loft"]),
  rentalType: z.enum([
    "Casa completa",
    "Departamento completo",
    "Habitación dentro de una casa",
    "Habitación dentro de un departamento",
    "Loft"
  ]),
  genderPreference: z.enum(["Solo hombres", "Solo mujeres", "Mixto"]),
  monthlyPrice: z.number().min(1),
  includesServices: z.boolean(),
  services: z.array(z.enum([
    "Luz",
    "Agua",
    "Gas",
    "Internet",
    "Limpieza",
    "Mantenimiento",
    "Agua potable",
    "Todos los servicios"
  ])).default([]),
  isFurnished: z.boolean(),
  furniture: z.array(z.string()).default([]),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default("México"),
  }).optional(),
  images: z.array(z.string().url()).default([]),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Esquema principal de arrendador
export const ArrendadorSchema = z.object({
  _id: ObjectIdZod.optional(),
  email: z.string().email(),
  password: z.string().min(8),
  profile: ArrendadorProfileSchema.optional(),
  properties: z.array(ObjectIdZod).default([]),
  applications: z.array(ObjectIdZod).default([]),
  tenants: z.array(ObjectIdZod).default([]),
  isEmailVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

/* ----------------------------------------------
    TypeScript Types (Inferidos desde Zod)
------------------------------------------------ */
export type ArrendadorProfile = z.infer<typeof ArrendadorProfileSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type Arrendador = z.infer<typeof ArrendadorSchema>;

/* ----------------------------------------------
    MongoDB Schemas (Mongoose)
------------------------------------------------ */

// Subdocumento: perfil de arrendador
const ArrendadorProfileMongoSchema = new Schema<ArrendadorProfile>({
  profilePicture: { type: String },
  officialId: {
    type: {
      type: String,
      enum: ["INE", "passport", "license"]
    },
    fileUrl: String,
    fileName: String,
  },
  dateOfBirth: {
    day: { type: Number, min: 1, max: 31 },
    month: { type: Number, min: 1, max: 12 },
    year: { type: Number, min: 1900, max: new Date().getFullYear() },
  },
  gender: {
    type: String,
    enum: ["masculino", "femenino", "otro"]
  },
  phone: String,
  fullName: String,
  isVerified: { type: Boolean, default: false },
});

// Documento: propiedad
const PropertyMongoSchema = new Schema<Property>({
  propertyType: {
    type: String,
    enum: ["Casa", "Departamento", "Loft"],
    required: true
  },
  rentalType: {
    type: String,
    enum: [
      "Casa completa",
      "Departamento completo",
      "Habitación dentro de una casa",
      "Habitación dentro de un departamento",
      "Loft"
    ],
    required: true
  },
  genderPreference: {
    type: String,
    enum: ["Solo hombres", "Solo mujeres", "Mixto"],
    required: true
  },
  monthlyPrice: { type: Number, required: true, min: 0 },
  includesServices: { type: Boolean, required: true },
  services: [{
    type: String,
    enum: [
      "Luz",
      "Agua",
      "Gas",
      "Internet",
      "Limpieza",
      "Mantenimiento",
      "Agua potable",
      "Todos los servicios"
    ]
  }],
  isFurnished: { type: Boolean, required: true },
  furniture: [String],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "México" },
  },
  images: [String],
  description: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Documento: arrendador
const ArrendadorMongoSchema = new Schema<Arrendador>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  profile: ArrendadorProfileMongoSchema,
  properties: [{ type: Types.ObjectId, ref: 'Property' }],
  applications: [{ type: Types.ObjectId, ref: 'Application' }],
  tenants: [{ type: Types.ObjectId, ref: 'User' }],
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes para queries frecuentes
ArrendadorMongoSchema.index({ isActive: 1 });

/* ----------------------------------------------
    MongoDB Models (Mongoose)
------------------------------------------------ */
export const ArrendadorDB = model("Arrendador", ArrendadorMongoSchema, "Arrendadores");
export const PropertyDB = model("Property", PropertyMongoSchema, "Properties");
