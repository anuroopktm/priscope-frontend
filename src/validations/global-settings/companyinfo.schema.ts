import z from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const companyInfoSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),

  company_website: z
    .string()
    .min(1, "Company website is required")
    .refine(
      (val) => /^https?:\/\/.+\..+/.test(val),
      "Enter a valid URL (include http:// or https://)",
    ),

  industry: z.string().min(1, "Industry is required"),

  company_size: z.string().min(1, "Company size is required"),

  primary_location: z.string().min(1, "Primary location is required"),

  base_currency: z.string().min(1, "Base currency is required"),

  company_logo_url: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;

      return [
        "image/png",
        "image/jpeg",
        "image/svg+xml",
        "image/webp",
      ].includes(file.type);
    }, "Only SVG, PNG, JPEG, WEBP allowed")
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }, "Max file size is 3MB"),
});

export type CompanyInfoSchema = z.infer<typeof companyInfoSchema>;
