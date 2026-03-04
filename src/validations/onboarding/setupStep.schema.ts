import { z } from "zod";

export const setupStepSchema = z.object({
  company_name: z
    .string()
    .min(1, "Company name is required"),

  company_website: z
    .string()
    .optional()
    .or(z.literal("")),

  industry: z.string().optional(),
  company_size: z.string().optional(),
  primary_location: z.string().optional(),

  company_logo: z
    .instanceof(File)
    .optional()
    .nullable(),
});

export type SetupStepFormValues = z.infer<typeof setupStepSchema>;