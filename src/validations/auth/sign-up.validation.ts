import { z } from "zod";

export const createSignUpSchema = (invite: any) =>
  z
    .object({
      email: z.string().email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must be at most 64 characters")
        .refine(
          (val) => /[A-Z]/.test(val),
          "Password must contain at least one uppercase letter",
        )
        .refine(
          (val) => /[a-z]/.test(val),
          "Password must contain at least one lowercase letter",
        )
        .refine(
          (val) => /\d/.test(val),
          "Password must contain at least one digit",
        )
        .refine(
          (val) => /[!@#$%^&*()]/.test(val),
          "Password must contain at least one special character",
        ),
      confirmPassword: z
        .string()
        .min(1, "Password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        const password = data.password.toLowerCase();
        return (
          password !== invite.email.toLowerCase() &&
          password !== invite.name.toLowerCase()
        );
      },
      {
        message: "Password must not match email or name",
        path: ["password"],
      },
    );

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;
export type OtpFormData = z.infer<typeof otpSchema>;
