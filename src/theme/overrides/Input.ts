import { alpha, type Theme } from "@mui/material/styles";

export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: `${theme.palette.common.white} !important`,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.common.white,
          transition: theme.transitions.create(["border-color", "box-shadow"]),
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: 0.5,
            borderColor: theme.palette.brand.border,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.primary.main, 0.2),
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
          },
        },
      },
    },
  };
}
