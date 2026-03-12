import { z } from "zod";

export const tenantSignUpSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    company_name: z.string().min(2, "Company name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TenantSignUpSchema = z.infer<typeof tenantSignUpSchema>;
