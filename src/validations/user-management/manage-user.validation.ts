import { z } from "zod";

export const manageUserSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),
  job_designation: z.string().nonempty("Job designation is required"),
  permissions: z
    .array(z.any())
    .min(1, "At least one permission must be selected"),
  role: z.array(z.any()).optional(),
  defaultPermissions: z.array(z.any()).optional(),
  currentRole: z.string(),
});

export type ManageUserFormValues = z.infer<typeof manageUserSchema>;
