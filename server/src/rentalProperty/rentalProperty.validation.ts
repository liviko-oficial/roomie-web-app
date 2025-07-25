import z from "zod";
export const RentalProperty = z.object({
  name: z.string("Error in type of value").min(5, "A name must be provided"),
  imgPrincipal: z.url("image url must be prodived"),
  summary: z
    .string("Error in type of summary")
    .max(100, "Maximun lenght of 100 caraters exided"),
  description: z.string("Error in type of description"),
  rateting: z.number("Error in type rateting").min(0).max(5),
  price: z
    .number("Error in type price")
    .min(1)
    .refine((n) => n.toFixed(2)),
  isPetFriendly: z.boolean(),
  capacity: z.int().min(1).max(20),
  isFurnished: z.boolean(),
  parkingNum: z.int().max(10).min(0).optional().default(0),
  amenities: z.string().array().default([]).optional(),
  contractTime: z.int32(),
  type: z.enum(["cuarto", "apartamento", "casa", "loft"]),
  gender: z.enum(["hombres", "mujeres", "ambos"]),
  deposit: z
    .number()
    .min(0)
    .default(0)
    .optional()
    .refine((n) => n.toFixed(2)),
  rules: z.string().array().default([]).optional(),
  distance: z
    .number()
    .min(0)
    .refine((n) => n.toFixed(2)),
  bathroom: z.enum(["propio", "compartido"]),
  services: z.string().array().default([]).optional(),
  isAvailable: z.boolean().default(true),
});
export type RentalProperty = z.infer<typeof RentalProperty>;
