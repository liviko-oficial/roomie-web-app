import { ObjectIdZod } from "@/lib/types";
import { AuthSchema } from "@/user/models/userAuth.schema";
import { model, Schema, Types } from "mongoose";
import z from "zod";
export const UserPartial = z.object({
  ...AuthSchema.shape,
  pets: z.enum(["none", "cat", "dog", "other"]).optional().default("none"),
  sex: z.enum(["hombre", "mujer", "none"]).default("none"),
  isDelete: z.boolean().optional().default(false),
  preferences: z.preprocess(
    (val) => (val instanceof Map ? Object.fromEntries(val) : val),
    z
      .record(
        z.string(),
        z.union([z.record(z.string(), z.any()), z.string().array(), z.string()])
      )
      .optional()
      .default({ campus: "guadalajara" })
  ),
  liked: z.array(ObjectIdZod).default([]),
  //TODO Agregar verificaciones de identidad
});
export const UserSchema = z.object({
  ...UserPartial.omit({ password: true }).required().shape,
  _id: ObjectIdZod,
});
export type UserPartial = z.infer<typeof UserPartial>;
export type User = z.infer<typeof UserSchema>;
const UserPartialShema = new Schema<UserPartial>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  pets: { type: String, required: false, default: "none" },
  liked: { type: [Types.ObjectId], required: false, default: [] },
  preferences: {
    type: Object,
    of: { type: Schema.Types.Mixed },
    required: false,
    default: {},
  },
  sex: { type: String, required: false },
  isDelete: { type: Boolean, required: false, default: false },
});
export const UserPartialDB = model(
  "UserPartial",
  UserPartialShema,
  "UsersPartial"
);
const UserShemaMongo = new Schema<UserPartial>({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  pets: { type: String, required: false, default: "none" },
  liked: { type: [Types.ObjectId], required: false, default: [] },
  preferences: {
    type: Object,
    of: { type: Schema.Types.Mixed },
    required: true,
    default: {},
  },
  sex: { type: String, required: true },
  isDelete: { type: Boolean, required: false, default: false },
});
export const UserDB = model("User", UserShemaMongo, "Users");
