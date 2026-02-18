import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import googleIcon from "../../../assets/login/google.svg";
import linkedinIcon from "../../../assets/login/linkedin.svg";
import microsoftIcon from "../../../assets/login/microsoft.svg";
import {
  loginSchema,
  type LoginSchema,
} from "../../../validations/auth.validation";

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
        sx={{ fontWeight: 700, mb: 1, color: "#1A2B44", fontSize: "1.75rem" }}
      >
        Welcome back!
      </Typography>

      <Divider sx={{ mt: 3, mb: 4, borderColor: "#D2D2D2" }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5} sx={{ textAlign: "left" }}>
          {/* Email Field */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.75,
                fontWeight: 600,
                color: "#4A5568",
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
                color: "#4A5568",
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
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#718096"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
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
            sx={{ mt: 1 }}
          >
            {false ? "Logging in..." : "Continue"}
          </Button>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Link
              component="button"
              variant="body2"
              type="button" // Important to prevent form submission
              onClick={() => console.log("Forgot password clicked")}
              sx={{
                color: "#1A2B44",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Forgot Password?
            </Link>
          </Box>
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
        Sign in with
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
              width: 44,
              height: 44,
              borderRadius: 1,
              "&:hover": { bgcolor: "#0F3D5B" },
            }}
          >
            {social.icon}
          </IconButton>
        ))}
      </Stack>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 4, color: "#718096", fontSize: "0.875rem" }}
      >
        Don't have an account?{" "}
        <Link
          component="button"
          sx={{
            color: "#144E72",
            fontWeight: 700,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Create an account
        </Link>
      </Typography>
    </Paper>
  );
};
