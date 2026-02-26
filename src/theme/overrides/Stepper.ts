import { type Theme } from "@mui/material/styles";

export default function Stepper(theme: Theme) {
  return {
    MuiStepper: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
          color: theme.palette.brand.inputBg,
          // border: `1px solid ${theme.palette.brand.divider}`,
          borderRadius: "50%",
          "&.Mui-active, &.Mui-completed": {
            color: theme.palette.brand.divider,
          },
        },
        text: {
          fill: theme.palette.brand.divider,
          // fontWeight: "bold",
          fontSize: "14px",
          ".Mui-active &, .Mui-completed &": {
            fill: theme.palette.brand.inputBg,
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: theme.palette.brand.divider,
          // fontWeight: "600",
          "&.Mui-active, &.Mui-completed": {
            color: theme.palette.brand.divider,
          },
        },
      },
    },
  };
}
