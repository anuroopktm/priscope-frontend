import AuthCard from "@/pages/auth/common/AuthCard";
import { useTenantSignUpQuery } from "@/services/queries/auth/tenant-sign-up/tenant-sign-up.queries";
import { useTenantSignupStore } from "@/store/useTenantSignupStore";
import { useToastStore } from "@/store/useToastStore";
import { otpSchema, type OtpSchema } from "@/validations/auth/otp.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;

const OtpForm = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { signupData, clearSignupStore } = useTenantSignupStore();
  const showToast = useToastStore((state) => state.showToast);

  // const { mutateAsync: verifyUserMutation, isPending: isVerifyUserPending } =
  //   useVerifyUser();
  const { mutateAsync: tenantSignUpMutation, isPending: isSignUpPending } =
    useTenantSignUpQuery();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    // mode: "onChange",
    defaultValues: { otp: "" },
  });

  const otp = useWatch({ control, name: "otp" }) || "";
  const digits = otp
    .split("")
    .concat(Array(OTP_LENGTH).fill(""))
    .slice(0, OTP_LENGTH);

  const hasError = !!errors.otp;

  useEffect(() => {
    if (!signupData) {
      navigate("/auth/tenant-sign-up");
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;

    const combinedOtp = newDigits.join("");
    setValue("otp", combinedOtp, { shouldValidate: true });

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    setValue("otp", pasted, { shouldValidate: true });
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const onSubmit = async ({ otp }: OtpSchema) => {
    if (!signupData) return;

    try {
      await tenantSignUpMutation({
        name: signupData.name,
        email: signupData.email,
        company_name: signupData.company_name,
        password: signupData.password,
        confirm_password: signupData.confirm_password,
        code: otp,
        otp_type: "tenant_onboarding",
      });

      showToast("Successfully signed up!", "success");
      navigate("/auth/tenant-sign-in");
      clearSignupStore();
    } catch (error: any) {
      showToast(error.response?.data?.detail || "Signup failed", "error");
    }
  };

  if (!signupData) return null;

  return (
    <AuthCard title="Welcome!">
      <Stack spacing={2} alignItems="center">
        <Typography
          variant="subtitle1"
          color="primary.main"
          sx={{ width: "100%", textAlign: "left" }}
        >
          Enter 6-digit OTP
        </Typography>

        <Stack direction="row" spacing={2}>
          {digits.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el!)}
              value={digit}
              error={hasError}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoFocus={index === 0}
              inputProps={{
                maxLength: 1,
                inputMode: "numeric",
                style: {
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: 600,
                },
              }}
              sx={{
                width: 48,
                "& .MuiOutlinedInput-root": {
                  height: 48,
                  borderRadius: 1,
                },
              }}
            />
          ))}
        </Stack>

        {hasError && (
          <Typography
            variant="caption"
            color="error"
            sx={{
              width: "100%",
              textAlign: "left",
              mt: "6px !important",
            }}
          >
            {errors.otp?.message}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <Button
            fullWidth
            size="large"
            variant="contained"
            type="submit"
            loading={isSignUpPending}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    </AuthCard>
  );
};

export default OtpForm;
