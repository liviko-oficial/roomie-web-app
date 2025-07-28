import { ObjectIdZod } from "@/lib/types";
import { AuthSchema } from "@/user/models/userAuth.schema";
import { model, Schema } from "mongoose";
import z from "zod";
export const UserPartial = z.object({
  ...AuthSchema.shape,
  pets: z.enum(["none", "cat", "dog", "other"]).optional(),
  sex: z.enum(["hombre", "mujer"]).optional(),
  isDelete: z.boolean().optional().default(false),
  preferences: z
    .record(
      z.string(),
      z.union([z.record(z.string(), z.any()), z.string().array()])
    )
    .optional(),
  liked: ObjectIdZod.optional().array().default([]),
  //TODO Agregar verificaciones de identidad
});
export const UserShema = z.object({
  ...UserPartial.omit({ password: true }).required().shape,
  _id: ObjectIdZod,
});
export type UserPartial = z.infer<typeof UserPartial>;
export type User = z.infer<typeof UserShema>;
const UserPartialShema = new Schema<UserPartial>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  pets: { type: String, required: false, default: "none" },
  preferences: { type: Map, of: { type: Schema.Types.Mixed }, required: false },
  isDelete: { type: Boolean, required: false, default: false },
});
export const UserPartialDB = model(
  "UserPartial",
  UserPartialShema,
  "PartialUsers"
);
const UserShemaMongo = new Schema<UserPartial>({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  pets: { type: String, required: false, default: "none" },
  preferences: { type: Map, of: { type: Schema.Types.Mixed }, required: false },
  isDelete: { type: Boolean, required: false, default: false },
});
export const UserDB = model("User", UserShemaMongo, "Users");
