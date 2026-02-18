import { type Theme } from "@mui/material/styles";

export default function Input(theme: Theme) {
  return {
    MuiTextField: {
      defaultProps: {
        variant: "outlined" as const,
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Standard login input radius
          backgroundColor: "#FFFFFF",
          transition: theme.transitions.create(["border-color", "box-shadow"]),
          "& fieldset": {
            borderColor: "#BBBBBB",
          },
          "&:hover fieldset": {
            borderColor: "#CBD5E0",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#1A2B44", // Focused state
            borderWidth: 1,
          },
          // Input specific styles
          "& input": {
            padding: "12px 14px",
            fontSize: "1rem",
          },
        },
        // Remove input adornment extra heights if needed
        adornedEnd: {
          paddingRight: 14,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // General label refinements if needed
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          // Adornment spacing
        },
      },
    },
  };
}
