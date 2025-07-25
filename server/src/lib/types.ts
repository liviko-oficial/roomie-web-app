import { Types } from "mongoose";
import z from "zod";

export const ObjectIdZod = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), "Invalid User Id");
