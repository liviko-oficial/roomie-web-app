import z from "zod";
import { UserSchema } from "./userMissing.schema";
export const UserResponse = z.object({
  ...UserSchema.omit({ _id: true, email: true }).shape,
});
