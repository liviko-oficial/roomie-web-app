import { SUPPORT_EMAILS } from "@/user/lib/const";
import z from "zod";
export const AuthSubmissionSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => {
      const termination = email.split("@")[1];
      return SUPPORT_EMAILS.includes(termination);
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
export type AuthSubmissionSchema = z.infer<typeof AuthSubmissionSchema>;
export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});
export type AuthSchema = z.infer<typeof AuthSchema>;
