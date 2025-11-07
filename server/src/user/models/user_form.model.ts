import { z } from "zod";
import { UserPartialDB } from "@/user/models/userMissing.schema";

export const UserFormSchema = z.object({
    hobbies: z.array(z.string()).min(1, "Al menos un hobby es necesario"),
    deal_breakers: z.array(z.string()).optional(),
    current_quarter: z.number().min(1).max(12), // TODO: check which is the maximum quater a student can be enrolled in
    birth_date: z.coerce.date(),
    id: z.number(),
    gender: z.string(),
    has_pets: z.boolean(),
    smoker: z.boolean(),
    cellphone: z.string().min(8, "Teléfono invalido"), // TODO: Add additional checkers
});

export type UserFormParams = z.infer<typeof UserFormSchema>;

class UserFormError extends Error {
    constructor(message: string, name: string) {
        super(message);
        this.name = name;
    }
}

export async function add_user_form(param: UserFormParams) {
    const parsed = UserFormSchema.safeParse(param);
    if (!parsed.success) {
        throw new UserFormError(parsed.error.issues[0].message, "validacion-fallida");
    }

    const { id, ...formData } = parsed.data;

    const user = await UserPartialDB.findById(id);
    if (!user) {
        throw new UserFormError("Usuario no encontrado", "usuario-no-encontrado");
    }

    Object.assign(user, formData);
    await user.save();

    return { success: true, message: "Formulario del usuario correctamente salvado" };
}
