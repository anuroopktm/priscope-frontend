import AuthCard from "@/pages/auth/common/AuthCard";
import EmailField from "@/pages/auth/common/EmailField";
import PasswordField from "@/pages/auth/common/PasswordField";
import SocialAuthButtons from "@/pages/auth/common/SocialAuthButtons";
import { useToastStore } from "@/store/useToastStore";
import {
  tenantSignUpSchema,
  type TenantSignUpSchema,
} from "@/validations/auth/tenant-sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ConfirmPasswordField from "../../common/ConfirmPasswordField";
import { useSendSignUpOtp } from "@/services/queries/auth/tenant-sign-up/tenant-sign-up.queries";
import { useTenantSignupStore } from "@/store/useTenantSignupStore";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { setSignupData } = useTenantSignupStore();
  const { mutate, isPending } = useSendSignUpOtp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantSignUpSchema>({
    resolver: zodResolver(tenantSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      company_name: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: TenantSignUpSchema) => {
    const { email, name } = data;
    mutate(
      { email, name },
      {
        onSuccess: () => {
          showToast("OTP sent successfully", "success");
          setSignupData(data);
          navigate("/auth/tenant-otp");
        },
        onError: (error: any) => {
          showToast(error?.response?.data?.message, "error");
        },
      },
    );
  };

  return (
    <AuthCard title="Welcome">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} textAlign="left">
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
              Name
            </Typography>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>

          <EmailField control={control} error={errors.email?.message} />

          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
              Company Name
            </Typography>

            <Controller
              name="company_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.company_name}
                  helperText={errors.company_name?.message}
                />
              )}
            />
          </Box>

          <PasswordField control={control} error={errors.password?.message} />

          <ConfirmPasswordField
            control={control}
            error={errors.confirm_password?.message}
          />

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isPending}
          >
            Continue
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Typography variant="body2" textAlign="center" mb={2}>
        Sign up with
      </Typography>

      <SocialAuthButtons />
    </AuthCard>
  );
};

export default SignUpForm;
