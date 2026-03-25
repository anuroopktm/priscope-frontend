import { z } from "zod";

export const impactSettingsSchema = z.object({
  fx_threshold: z.number().min(0, "Must be positive"),
  tariff_threshold: z.number().min(0, "Must be positive"),
  freight_threshold: z.number().min(0, "Must be positive"),
});

export type ImpactSettingsFormValues = z.infer<typeof impactSettingsSchema>;