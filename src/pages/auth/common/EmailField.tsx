import { Box, TextField, Typography } from "@mui/material";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface Props<T extends FieldValues> {
  control: Control<T>;
  error?: string;
}

const EmailField = <T extends FieldValues>({ control, error }: Props<T>) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
      Email
    </Typography>

    <Controller
      name={"email" as Path<T>}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          variant="outlined"
          size="small"
          error={!!error}
          helperText={error}
        />
      )}
    />
  </Box>
);

export default EmailField;
