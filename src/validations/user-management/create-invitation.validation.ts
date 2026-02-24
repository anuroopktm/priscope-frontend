import { z } from "zod";

export const createInvitationSchema = (isTemplateExists: boolean) =>
  z.object({
    templateName: isTemplateExists
      ? z
          .string()
          .min(3, "Template name must be at least 3 characters")
          .max(50, "Template name must be less than 50 characters")
      : z.string().optional(),
  });

export type CreateInvitationForm = z.infer<
  ReturnType<typeof createInvitationSchema>
>;
