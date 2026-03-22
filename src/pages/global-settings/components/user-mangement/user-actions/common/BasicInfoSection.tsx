import { useCheckEmailExist } from "@/services/user-management/user-management.queries";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import debounce from "lodash.debounce";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

const BasicInfoSection = () => {
  const {
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const { mutate: checkEmail, isPending: isCheckingEmail } =
    useCheckEmailExist();

  const debouncedCheckEmail = useMemo(
    () =>
      debounce((email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && emailRegex.test(email)) {
          checkEmail(
            { email },
            {
              onSuccess: (data) => {
                if (data) {
                  setError("email", {
                    type: "manual",
                    message: "Email already taken",
                  });
                } else {
                  clearErrors("email");
                }
              },
              onError: () => {
                setError("email", {
                  type: "manual",
                  message: "Error checking email",
                });
              },
            },
          );
        }
      }, 500),
    [checkEmail, setError, clearErrors],
  );

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={4}>
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
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
          )}
        />
      </Grid>
      <Grid size={4}>
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
              onChange={(e) => {
                field.onChange(e);
                debouncedCheckEmail(e.target.value);
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {isCheckingEmail && (
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
      <Grid size={4}>
        <Controller
          name="job_designation"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Job Designation"
              fullWidth
              size="small"
              placeholder="Senior Developer"
              error={!!errors.job_designation}
              helperText={errors.job_designation?.message as string}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoSection;
