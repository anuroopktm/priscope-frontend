import { useDebounce } from "@/hooks/useDebounce";
import { useCheckEmailExist } from "@/services/user-management/user-management.queries";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const BasicInfoSection = () => {
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const email = watch("email");
  const debouncedEmail = useDebounce(email, 500);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const { mutate: checkEmail } = useCheckEmailExist();

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (debouncedEmail && emailRegex.test(debouncedEmail)) {
      setCheckingEmail(true);
      checkEmail(
        { email: debouncedEmail },
        {
          onSuccess: (data) => {
            if (data && data.toLowerCase().includes("taken")) {
              setError("email", {
                type: "manual",
                message: "Email already taken",
              });
            } else {
              clearErrors("email");
            }
            setCheckingEmail(false);
          },
          onError: () => {
            setError("email", {
              type: "manual",
              message: "Error checking email",
            });
            setCheckingEmail(false);
          },
        },
      );
    } else {
      clearErrors("email");
      setCheckingEmail(false);
    }
  }, [debouncedEmail, checkEmail, setError, clearErrors]);

  return (
    <Grid container spacing={2} sx={{ width: "50%", mb: 4 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              size="small"
              placeholder="John Smith"
              sx={{ bgcolor: "white" }}
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              error={!!errors.email}
              fullWidth
              size="small"
              placeholder="Johnsmith@gmail.com"
              helperText={errors.email?.message as string}
              sx={{ bgcolor: "white" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {checkingEmail && (
                        <CircularProgress size={16} color="inherit" />
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoSection;
