import { SUPORT_EMAILS } from "../../user/lib/const";
import { z } from "zod";

/* ----------------------------------------------
   🔹 Esquema de validación para el registro de arrendador
   - Valida correo y contraseña siguiendo reglas estrictas
   - Se utiliza durante el proceso de registro
------------------------------------------------ */
export const ArrendadorAuthSubmissionSchema = z.object({
    // Validación del correo electrónico
    email: z
        .string()
        .email()
        .refine((email) => {
            // Solo se aceptan correos cuyo dominio esté incluido en SUPORT_EMAILS
            const domain = email.split("@")[1];
            return SUPORT_EMAILS.includes(domain);
        }, "Correo no soportado"), // 🔹 Mensaje de error traducido a español

    // Validación de la contraseña
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres") // longitud mínima
        .max(32, "La contraseña no puede superar los 32 caracteres") // longitud máxima
        // Reglas de complejidad de la contraseña
        .refine(
            (password) => /[A-Z]/.test(password),
            "La contraseña debe contener al menos una letra mayúscula."
        )
        .refine(
            (password) => /[a-z]/.test(password),
            "La contraseña debe contener al menos una letra minúscula."
        )
        .refine(
            (password) => /[0-9]/.test(password),
            "La contraseña debe contener al menos un número."
        )
        .refine(
            (password) => /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?~]/.test(password),
            "La contraseña debe contener al menos un carácter especial."
        ),
});

/* ----------------------------------------------
   🔹 Esquema de autenticación simple (login)
   - Se utiliza en el inicio de sesión
   - Menos restricciones que en el registro
------------------------------------------------ */
export const ArrendadorAuthSchema = z.object({
    email: z.string().email(), // se valida solo formato de correo
    password: z.string().min(8), // se valida únicamente la longitud mínima
});


/* ----------------------------------------------
    Tipos de TypeScript (inferidos desde Zod)
   - Facilitan el tipado estático en controladores y servicios
------------------------------------------------ */
export type ArrendadorAuthSubmissionSchema = z.infer<typeof ArrendadorAuthSubmissionSchema>;
export type ArrendadorAuthSchema = z.infer<typeof ArrendadorAuthSchema>;
