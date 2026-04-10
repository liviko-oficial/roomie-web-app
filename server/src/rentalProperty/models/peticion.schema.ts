import { model, Schema, Types } from "mongoose";
import { z } from "zod";
import { ObjectIdZod } from "@/lib/types.ts";

export const PeticionUsuarioVisibleSchema = z.object({
  nombres: z.string().min(1),
  apellidoPaterno: z.string().min(1),
  fotoPerfilUrl: z.string().url().optional(),
  edad: z.number().int().nonnegative().optional(),
  genero: z.string().optional(),
  nacionalidad: z.string().optional(),
  estadoOrigen: z.string().optional(),
  hobbies: z.array(z.string()).max(5).optional(),
  noNegociables: z.array(z.string()).min(0).max(5).optional(),
  preferenciaRoomies: z.string().optional(),
  tieneMascota: z.boolean().optional(),
  tipoMascota: z.string().optional(),
  nivelEducativo: z.string().optional(),
  areaPrograma: z.string().optional(),
  semestreOGraduacion: z.string().optional(),
  contactoEmergencia: z.object({
    nombre: z.string(),
    telefono: z.string()
  }).optional(),
});

export const PeticionContextoSchema = z.object({
  usuarioId: ObjectIdZod,
  propertyId: ObjectIdZod,
  motivo: z.string().optional(),
  fechaSolicitud: z.date().default(() => new Date()),
  estatus: z.string().default("En proceso"),
});

export const PeticionOfertaSchema = z.object({
  montoOfrecidoMXN: z.number().optional(),
  numeroOfertas: z.number().int().min(1).max(2).optional(),
  historialOfertas: z.array(z.number()).optional()
});

export const PeticionSchema = z.object({
  _id: ObjectIdZod.optional(),
  propertyId: ObjectIdZod,
  usuarioVisible: PeticionUsuarioVisibleSchema,
  contexto: PeticionContextoSchema,
  oferta: PeticionOfertaSchema.optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type PeticionUsuarioVisible = z.infer<typeof PeticionUsuarioVisibleSchema>;
export type PeticionContexto = z.infer<typeof PeticionContextoSchema>;
export type PeticionOferta = z.infer<typeof PeticionOfertaSchema>;
export type Peticion = z.infer<typeof PeticionSchema>;

const PeticionUsuarioVisibleMongo = new Schema<PeticionUsuarioVisible>({
  nombres: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  fotoPerfilUrl: String,
  edad: Number,
  genero: String,
  nacionalidad: String,
  estadoOrigen: String,
  hobbies: [String],
  noNegociables: [String],
  preferenciaRoomies: String,
  tieneMascota: Boolean,
  tipoMascota: String,
  nivelEducativo: String,
  areaPrograma: String,
  semestreOGraduacion: String,
  contactoEmergencia: {
    nombre: String,
    telefono: String
  }
}, { _id: false });

const PeticionContextoMongo = new Schema<PeticionContexto>({
  usuarioId: [{ type: Types.ObjectId, ref: "User", required: true }],
  propertyId: [{ type: Types.ObjectId, ref: "PropiedadRenta", required: true }],
  motivo: String,
  fechaSolicitud: { type: Date, default: Date.now },
  estatus: { type: String, default: "En proceso" }
}, { _id: false });

const PeticionOfertaMongo = new Schema<PeticionOferta>({
  montoOfrecidoMXN: Number,
  numeroOfertas: Number,
  historialOfertas: [Number]
}, { _id: false });

const PeticionMongoSchema = new Schema<Peticion>({
  propertyId: [{ type: Types.ObjectId, ref: "PropiedadRenta", required: true }],
  usuarioVisible: { type: PeticionUsuarioVisibleMongo, required: true },
  contexto: { type: PeticionContextoMongo, required: true },
  oferta: PeticionOfertaMongo,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const PeticionDB = model<Peticion>("Peticion", PeticionMongoSchema, "Peticiones");

