import { SUPORT_EMAILS } from "@/user/lib/const";
import z from "zod";
export const AuthSubmitionSchema = z.object({
  email: z.email().refine((email) => {
    const termination = email.split("@")[2];
    return SUPORT_EMAILS.includes(termination);
  }, "Error email not supported"),
  password: z
    .string()
    .min(8, "Password must be at leat of 8 caracters")
    .max(32, "Password can't be more than 32 characters")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter."
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must contain at least one lowercase letter."
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain at least one number."
    )
    .refine(
      (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
      "Password must contain at least one special character."
    ),
});
export type AuthSubmitionSchema = z.infer<typeof AuthSubmitionSchema>;
export const AuthSchema = z.object({
  email: z.email(),
  password: z.string().min(72),
});
export type AuthSchema = z.infer<typeof AuthSchema>;
