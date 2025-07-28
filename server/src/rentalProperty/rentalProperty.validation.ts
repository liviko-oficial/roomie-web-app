import z from "zod";
export const RentalProperty = z.object({
  name: z.string().min(5, "A name must be provided"),
  imgPrincipal: z.string().url("image url must be prodived"),
  imgs: z.string().array().default([]),
  summary: z.string().max(100, "Maximun lenght of 100 caraters exided"),
  description: z.string(),
  rateting: z.number().min(0).max(5),
  price: z
    .number()
    .min(1)
    .refine((n) => n.toFixed(2)),
  isPetFriendly: z.boolean(),
  capacity: z.number().int().min(1).max(20),
  isFurnished: z.boolean(),
  parkingNum: z.number().int().max(10).min(0).default(0),
  amenities: z.string().array().default([]),
  contractTime: z.number().int(),
  type: z.enum(["cuarto", "apartamento", "casa", "loft"]),
  gender: z.enum(["hombres", "mujeres", "ambos"]),
  deposit: z
    .number()
    .min(0)
    .default(0)
    .optional()
    .refine((n) => n.toFixed(2)),
  rules: z.string().array().default([]),
  distance: z
    .number()
    .min(0)
    .refine((n) => n.toFixed(2)),
  bathroom: z.enum(["propio", "compartido"]),
  services: z.string().array().default([]),
  isAvailable: z.boolean().default(true),
});
export type RentalProperty = z.infer<typeof RentalProperty>;
