import { z } from "zod";

export const impactSettingsSchema = z.object({
  fx_threshold: z.number().min(0, "Must be positive").nullable().optional(),

  tariff_threshold: z.number().min(0, "Must be positive").nullable().optional(),

  freight_threshold: z
    .number()
    .min(0, "Must be positive")
    .nullable()
    .optional(),
});

export type ImpactSettingsFormValues = z.infer<typeof impactSettingsSchema>;
