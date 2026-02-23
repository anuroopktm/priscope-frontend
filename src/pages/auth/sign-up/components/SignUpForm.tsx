import AuthCard from "@/pages/auth/common/AuthCard";
import EmailField from "@/pages/auth/common/EmailField";
import PasswordField from "@/pages/auth/common/PasswordField";
import SocialAuthButtons from "@/pages/auth/common/SocialAuthButtons";
import {
  createSignUpSchema,
  type SignUpFormData,
} from "@/validations/auth/sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(createSignUpSchema({})),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    console.log(data);
  };

  return (
    <AuthCard title="Create your account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <EmailField control={control} error={errors.email?.message} />

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

          <Button size="large" type="submit" fullWidth>
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
