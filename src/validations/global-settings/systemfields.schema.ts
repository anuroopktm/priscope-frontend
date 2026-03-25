import { z } from "zod";

export const systemFieldMappingSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(50, "Max 50 characters").trim(),

  upc: z.string().min(1, "UPC is required").max(50, "Max 50 characters").trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Max 100 characters")
    .trim(),

  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Max 50 characters")
    .trim(),

  hsCode: z
    .string()
    .min(1, "HS Code is required")
    .max(20, "Max 20 characters")
    .trim(),
});

export type SystemFieldMappingFormValues = z.infer<
  typeof systemFieldMappingSchema
>;
