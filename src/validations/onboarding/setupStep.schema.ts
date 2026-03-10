import { z } from "zod";

export const setupStepSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),

  company_website: z
    .string()
    .min(1, "Company website is required")
    .url("Enter a valid website URL"),

  industry: z.string().min(1, "Industry is required"),

  company_size: z.string().min(1, "Company size is required"),

  primary_location: z.string().min(1, "Primary location is required"),

  base_currency: z.string().min(1, "Base currency is required"),
  company_logo: z.instanceof(File),
});

export type SetupStepFormValues = z.infer<typeof setupStepSchema>;
