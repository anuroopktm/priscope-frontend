import { z } from "zod";

export const costStepSchema = z.object({
  core_cost_element: z.string().min(1, "Core cost element is required"),
  additional_cost_elements: z.array(z.string()).optional(),
});

export type CostStepFormValues = z.infer<typeof costStepSchema>;
