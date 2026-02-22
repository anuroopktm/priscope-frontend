import AuthCard from "@/pages/auth/common/AuthCard";
import EmailField from "@/pages/auth/common/EmailField";
import PasswordField from "@/pages/auth/common/PasswordField";
import SocialAuthButtons from "@/pages/auth/common/SocialAuthButtons";
import { loginSchema, type LoginSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Link, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

const SignInForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    console.log(data);
  };

  return (
    <AuthCard title="Welcome back!">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5} textAlign="left">
          <EmailField control={control} error={errors.email?.message} />

          <PasswordField control={control} error={errors.password?.message} />

          <Button fullWidth size="large" type="submit" variant="contained">
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
        <Link component="button" fontWeight={700}>
          Create an account
        </Link>
      </Typography>
    </AuthCard>
  );
};

export default SignInForm;
