import { z } from "zod";

export const profitStepSchema = z.object({
  profitability_mode: z.string().min(1, "Profitability mode is required"),
  
});

export type ProfitStepFormValues = z.infer<typeof profitStepSchema>;
