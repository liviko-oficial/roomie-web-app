import { CAMPUS } from "@/rentalProperty/lib/const";
import { SUPPORT_EMAILS } from "@/user/lib/const";
import { Types } from "mongoose";
import z from "zod";

export const ObjectIdZod = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), "Invalid User Id");
export const RealUser = z.object({
  email: z
    .string()
    .email()
    .refine((email) => {
      const termination = email.split("@")[1];
      return SUPPORT_EMAILS.includes(termination);
    }, "Error email not supported"),
  password: z.string(),
  sex: z.enum(["hombre", "mujer"]),
  pets: z.enum(["none", "cat", "dog", "other"]).default("none"),
  liked: z.array(ObjectIdZod).default([]),
  preferences: z.object({
    campus: z.string().default(CAMPUS["GUADALAJARA"]),
  }),
  // NOTE: ID entraria aqui
  isDeleted: z.boolean().default(false),
});
// TODO: Aqui agregar el esquema real obligatorio para crear usuario
