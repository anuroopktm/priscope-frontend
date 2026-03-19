import { z } from "zod";

export const attributeSchema = z.object({
  attributes: z.record(z.string(), z.string().min(1, "Required")),
});

export type AttributeSchemaType = z.infer<typeof attributeSchema>;
