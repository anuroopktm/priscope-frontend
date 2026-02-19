import googleIcon from "@/assets/login/google.svg";
import linkedinIcon from "@/assets/login/linkedin.svg";
import microsoftIcon from "@/assets/login/microsoft.svg";
import { signUpSchema, type SignUpSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface SignUpFormProps {
  onSuccess: () => void;
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    console.log("Form Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSuccess();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 450,
        p: 5,
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        textAlign: "center",
        boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 4, color: "#1A2B44", fontSize: "1.75rem" }}
      >
        Welcome John Smith!
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5} sx={{ textAlign: "left" }}>
          {/* Email Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.75,
                fontWeight: 600,
                color: "#1A2B44",
                fontSize: "0.875rem",
              }}
            >
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  placeholder=""
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Box>

          {/* Password Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.75,
                fontWeight: 600,
                color: "#1A2B44",
                fontSize: "0.875rem",
              }}
            >
              Password
            </Typography>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder=""
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          {/* Confirm Password Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.75,
                fontWeight: 600,
                color: "#1A2B44",
                fontSize: "0.875rem",
              }}
            >
              Confirm Password
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder=""
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            {false ? "Sending..." : "Generate OTP"}
          </Button>
        </Stack>
      </form>

      <Box sx={{ position: "relative", my: 3 }}>
        <Divider sx={{ width: "100%", borderColor: "#E2E8F0" }} />
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            px: 1,
            color: "#A0AEC0",
            fontSize: "0.875rem",
          }}
        >
          or
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ mb: 2, color: "#4A5568", fontSize: "0.875rem" }}
      >
        Sign up with
      </Typography>

      <Stack direction="row" spacing={1.5} justifyContent="center">
        {[
          {
            icon: (
              <img
                src={googleIcon}
                alt="Google"
                style={{ width: 24, height: 24 }}
              />
            ),
            bg: "#144E72",
          },
          {
            icon: (
              <img
                src={microsoftIcon}
                alt="Microsoft"
                style={{ width: 24, height: 24 }}
              />
            ),
            bg: "#144E72",
          },
          {
            icon: (
              <img
                src={linkedinIcon}
                alt="LinkedIn"
                style={{ width: 24, height: 24 }}
              />
            ),
            bg: "#144E72",
          },
        ].map((social, index) => (
          <IconButton
            key={index}
            sx={{
              bgcolor: social.bg,
              color: "white",
              width: 48,
              height: 48,
              borderRadius: 1,
              "&:hover": { bgcolor: "#0F3D5B" },
            }}
          >
            {social.icon}
          </IconButton>
        ))}
      </Stack>
    </Paper>
  );
};

export default SignUpForm;
