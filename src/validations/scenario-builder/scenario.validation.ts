import { z } from "zod";

export const scenarioSchema = z.object({
  label: z.string().min(1, "Label is required"),
  customer: z.string().min(1, "Customer is required"),
  currency: z.string().min(1, "Currency is required"),
});

export type ScenarioFormValues = z.infer<typeof scenarioSchema>;
