import AuthCard from "@/pages/auth/common/AuthCard";
import EmailField from "@/pages/auth/common/EmailField";
import PasswordField from "@/pages/auth/common/PasswordField";
import SocialAuthButtons from "@/pages/auth/common/SocialAuthButtons";
import { useUserLogin } from "@/services/queries/auth/sign-in/sign-in.queries";
import { useToastStore } from "@/store/useToastStore";
import { encryptData } from "@/utils/encryption";
import { getErrorMessage } from "@/utils/error-helper";
import {
  signInSchema,
  type SignInSchema,
} from "@/validations/auth/sign-in.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Link, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const SignInForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useUserLogin();
  const { showToast } = useToastStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: SignInSchema) => {
    const { encrypted, nonce } = await encryptData({
      email,
      password,
      type: "email_password",
    });

    login(
      {
        encrypted,
        nonce,
      },
      {
        onSuccess: (response) => {
          showToast("Login successful! Redirecting...", "success");

          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);
          localStorage.setItem("tenant_id", response.tenant_id);
          localStorage.setItem("user_id", response.user_id);
          localStorage.setItem(
            "privileges",
            JSON.stringify(response.privileges),
          );

          navigate("/scenario-builder");
        },
        onError: (error) => {
          showToast(
            getErrorMessage(
              error,
              "Login failed. Please check your credentials.",
            ),
            "error",
          );
        },
      },
    );
  };

  return (
    <AuthCard title="Welcome back!">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5} textAlign="left">
          <EmailField control={control} error={errors.email?.message} />

          <PasswordField control={control} error={errors.password?.message} />

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isPending}
          >
            Continue
          </Button>

          <Link
            component="button"
            type="button"
            underline="none"
            fontWeight={700}
            textAlign="center"
          >
            Forgot Password?
          </Link>
        </Stack>
      </form>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Typography variant="body2" textAlign="center" mb={2}>
        Sign in with
      </Typography>

      <SocialAuthButtons />

      <Typography variant="body2" textAlign="center" mt={4}>
        Don&apos;t have an account?{" "}
        <Link component="button" fontWeight={700} underline="hover">
          Create an account
        </Link>
      </Typography>
      <Typography variant="body2" textAlign="center" mt={1}>
        Are you a tenant?{" "}
        <Link
          component={RouterLink}
          to="/auth/tenant-sign-up"
          fontWeight={700}
          underline="hover"
        >
          Sign Up
        </Link>
      </Typography>
    </AuthCard>
  );
};

export default SignInForm;
