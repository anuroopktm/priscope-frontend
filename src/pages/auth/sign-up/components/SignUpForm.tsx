import AuthCard from "@/pages/auth/common/AuthCard";
import EmailField from "@/pages/auth/common/EmailField";
import PasswordField from "@/pages/auth/common/PasswordField";
import SocialAuthButtons from "@/pages/auth/common/SocialAuthButtons";
import {
  useSendOtp,
  useVerifyInvite,
} from "@/services/queries/auth/sign-up/sign-up.queries";
import { useSignupStore } from "@/store/useSignupStore";
import { useToastStore } from "@/store/useToastStore";
import {
  createSignUpSchema,
  type SignUpFormData,
} from "@/validations/auth/sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const showToast = useToastStore((state) => state.showToast);
  const { setSignupData, setTokenInfo } = useSignupStore();

  const { data: tokenInfoState, mutateAsync: verifyInviteMutation } =
    useVerifyInvite();
  const { mutateAsync: sendOtpMutation, isPending: isSendOtpPending } =
    useSendOtp();

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
        await verifyInviteMutation(
          { token },
          {
            onSuccess: (data) => {
              setTokenInfo({
                email: data.email,
                tenant_id: data.tenant_id,
                token: token,
              });
              setValue("email", data.email);
            },
            onError: (error) => {
              showToast(
                error.response?.data?.detail || "Invalid or expired invitation",
                "error",
              );
            },
          },
        );
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

    await sendOtpMutation(
      {
        email: tokenInfoState.email,
        otp_type: "activation",
        tenant_id: tokenInfoState.tenant_id,
      },
      {
        onSuccess: () => {
          showToast("OTP sent successfully", "success");
          setSignupData(data);
          setTokenInfo({
            email: tokenInfoState.email,
            tenant_id: tokenInfoState.tenant_id,
            token: token,
          });
          navigate("/auth/otp");
        },
        onError: (error) => {
          showToast(
            error.response?.data?.detail || "Failed to send OTP",
            "error",
          );
        },
      },
    );
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
            loading={isSendOtpPending}
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
