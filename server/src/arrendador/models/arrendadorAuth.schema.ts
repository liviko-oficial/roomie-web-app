import { SUPORT_EMAILS } from "../../user/lib/const";
import { z } from "zod";

export const ArrendadorAuthSubmissionSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => {
      const termination = email.split("@")[1];
      return SUPORT_EMAILS.includes(termination);
    }, "Error email not supported"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
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

export const ArrendadorAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type ArrendadorAuthSubmissionSchema = z.infer<typeof ArrendadorAuthSubmissionSchema>;
export type ArrendadorAuthSchema = z.infer<typeof ArrendadorAuthSchema>;