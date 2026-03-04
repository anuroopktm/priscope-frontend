import { z } from "zod";

export const systemFieldMappingSchema = z.object({
  sku: z.string().min(1, "SKU label is required"),
  upc: z.string().min(1, "UPC label is required"),
  description: z.string().min(1, "Description label is required"),
  category: z.string().min(1, "Category label is required"),
  hsCode: z.string().min(1, "HS Code label is required"),
  supplierName: z.string().min(1, "Supplier Name label is required"),
});

export type SystemFieldMappingFormValues = z.infer<
  typeof systemFieldMappingSchema
>;