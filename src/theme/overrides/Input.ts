import { alpha, type Theme } from "@mui/material/styles";

export default function Input(theme: Theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.common.white,
          transition: theme.transitions.create(["border-color", "box-shadow"]),
          "& fieldset": {
            borderColor: theme.palette.brand.border,
          },
          "&:hover fieldset": {
            borderColor: alpha(theme.palette.primary.main, 0.2),
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
          },
        },
      },
    },
  };
}
