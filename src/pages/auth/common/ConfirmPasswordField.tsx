import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface Props<T extends FieldValues> {
  name?: Path<T>;
  label?: string;
  control: Control<T>;
  error?: string;
}

const PasswordField = <T extends FieldValues>({
  name = "confirm_password" as Path<T>,
  label = "Confirm Password",
  control,
  error,
}: Props<T>) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            fullWidth
            type={show ? "text" : "password"}
            variant="outlined"
            size="small"
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton variant="ghost" onClick={() => setShow(!show)}>
                    {show ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

export default PasswordField;
