import AuthCard from "@/pages/auth/common/AuthCard";
import {
  useUserSignUp,
  useVerifyUser,
} from "@/services/queries/auth/sign-up/sign-up.queries";
import { useSignupStore } from "@/store/useSignupStore";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
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
  const { signupData, tokenInfo, clearSignupStore } = useSignupStore();
  const showToast = useToastStore((state) => state.showToast);

  const { mutateAsync: verifyUserMutation, isPending: isVerifyUserPending } =
    useVerifyUser();
  const { mutateAsync: signUpMutation, isPending: isSignUpPending } =
    useUserSignUp();

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
    if (!signupData || !tokenInfo) {
      navigate("/auth/sign-in");
    }
  }, [signupData, tokenInfo, navigate]);

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
    if (!signupData || !tokenInfo) return;

    try {
      await verifyUserMutation({
        code: tokenInfo.token,
        email: tokenInfo.email,
        otp_type: "login",
        tenant_id: tokenInfo.tenant_id,
      });

      await signUpMutation({
        code: otp,
        confirm_password: signupData.confirmPassword,
        email: tokenInfo.email,
        otp_type: "activation",
        password: signupData.password,
        tenant_id: tokenInfo.tenant_id,
        type: "email_password",
      });

      showToast("Successfully signed up!", "success");
      clearSignupStore();
      navigate("/auth/sign-in");
    } catch (error: any) {
      showToast(getErrorMessage(error, "Signup failed"), "error");
    }
  };

  if (!signupData || !tokenInfo) return null;

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
            loading={isVerifyUserPending || isSignUpPending}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    </AuthCard>
  );
};

export default OtpForm;
