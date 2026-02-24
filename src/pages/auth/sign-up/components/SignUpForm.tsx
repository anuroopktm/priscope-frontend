import AuthCard from "@/pages/auth/common/AuthCard";
import EmailField from "@/pages/auth/common/EmailField";
import PasswordField from "@/pages/auth/common/PasswordField";
import SocialAuthButtons from "@/pages/auth/common/SocialAuthButtons";
import {
  useSendOtp,
  useVerifyInvite,
  useVerifyUser,
} from "@/services/queries/auth/sign-up/sign-up.queries";
import { useSignupStore } from "@/store/useSignupStore";
import { useToastStore } from "@/store/useToastStore";
import {
  createSignUpSchema,
  type SignUpFormData,
} from "@/validations/auth/sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const showToast = useToastStore((state) => state.showToast);
  const { setSignupData, setTokenInfo } = useSignupStore();

  const [tokenInfoState, setTokenInfoState] = useState<{
    email: string;
    tenant_id: string;
  } | null>(null);

  const verifyInviteMutation = useVerifyInvite();
  const verifyUserMutation = useVerifyUser();
  const sendOtpMutation = useSendOtp();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(
      createSignUpSchema({
        email: tokenInfoState?.email || "",
        name: "",
      }),
    ),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await verifyInviteMutation.mutateAsync({ token });
          setTokenInfoState({
            email: response.email,
            tenant_id: response.tenant_id,
          });
          setValue("email", response.email);
        } catch (error: any) {
          showToast(
            error.response?.data?.detail || "Invalid or expired invitation",
            "error",
          );
        }
      } else {
        showToast("Missing invitation token", "error");
      }
    };

    verifyToken();
  }, [token, setValue]);

  const onSubmit = async (data: SignUpFormData) => {
    if (!token || !tokenInfoState) {
      showToast("Invalid or missing invitation token", "error");
      return;
    }

    try {
      // 1. Verify User
      await verifyUserMutation.mutateAsync({
        code: token,
        email: tokenInfoState.email,
        otp_type: "login",
        tenant_id: tokenInfoState.tenant_id,
      });

      // 2. Send OTP
      await sendOtpMutation.mutateAsync({
        email: tokenInfoState.email,
        otp_type: "activation",
        tenant_id: tokenInfoState.tenant_id,
      });

      showToast("OTP sent successfully", "success");

      // Save to store and navigate
      setSignupData(data);
      setTokenInfo({
        email: tokenInfoState.email,
        tenant_id: tokenInfoState.tenant_id,
        token: token,
      });

      navigate("/auth/otp");
    } catch (error: any) {
      showToast(error.response?.data?.detail || "Verification failed", "error");
    }
  };

  return (
    <AuthCard title="Create your account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <EmailField
            control={control}
            error={errors.email?.message}
            inputProps={{ readOnly: !!tokenInfoState?.email }}
          />

          <PasswordField
            name="password"
            label="Password"
            control={control}
            error={errors.password?.message}
          />

          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            control={control}
            error={errors.confirmPassword?.message}
          />

          <Button
            size="large"
            type="submit"
            fullWidth
            variant="contained"
            loading={verifyUserMutation.isPending || sendOtpMutation.isPending}
          >
            Generate OTP
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2">OR</Typography>
      </Divider>

      <Typography variant="body2" textAlign="center" mb={2}>
        Sign up with
      </Typography>

      <SocialAuthButtons />
    </AuthCard>
  );
};

export default SignUpForm;
