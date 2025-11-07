import { z } from "zod";
import { ArrendadorSchema, PropertySchema } from "../models/arrendador.schema";

// Validaciones para creación y actualización de arrendador
export const CreateArrendadorSchema = ArrendadorSchema.omit({ 
  _id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const UpdateArrendadorSchema = ArrendadorSchema.partial().omit({ 
  _id: true, 
  email: true, 
  password: true, 
  createdAt: true 
});

export const UpdateArrendadorProfileSchema = z.object({
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
});

// Validaciones para propiedades
export const CreatePropertySchema = PropertySchema.omit({ 
  _id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const UpdatePropertySchema = PropertySchema.partial().omit({ 
  _id: true, 
  createdAt: true 
});

// Validación para login
export const ArrendadorLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Validación para cambio de contraseña
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(32, "New password can't be more than 32 characters")
    .refine(
      (password) => /[A-Z]/.test(password),
      "New password must contain at least one uppercase letter."
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "New password must contain at least one lowercase letter."
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "New password must contain at least one number."
    )
    .refine(
      (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
      "New password must contain at least one special character."
    ),
});

// Tipos de exportación
export type CreateArrendadorInput = z.infer<typeof CreateArrendadorSchema>;
export type UpdateArrendadorInput = z.infer<typeof UpdateArrendadorSchema>;
export type UpdateArrendadorProfileInput = z.infer<typeof UpdateArrendadorProfileSchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;
export type ArrendadorLoginInput = z.infer<typeof ArrendadorLoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;