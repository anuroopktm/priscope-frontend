import { z } from "zod";

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type OtpSchema = z.infer<typeof otpSchema>;
