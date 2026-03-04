import { z } from "zod";

export const systemIdentifierSchema = z.object({
  system_identifier: z
    .string()
    .min(1, "Please select a unique identifier"),
});

export type SystemIdentifierFormValues = z.infer<
  typeof systemIdentifierSchema
>;