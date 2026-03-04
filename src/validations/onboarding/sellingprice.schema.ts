import { z } from "zod";
export const sellingPriceElementSchema = z.object({
  core_selling_price_element: z
    .string()
    .min(1, "Core selling price element is required"),
});

export type SellingPriceElementFormValues = z.infer<
  typeof sellingPriceElementSchema
>;
