import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),
  password: z.string().nonempty("Password is required"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
