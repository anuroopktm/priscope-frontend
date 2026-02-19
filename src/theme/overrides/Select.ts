import { type Theme } from "@mui/material/styles";

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          textTransform: "none" as const,
          fontSize: "14px",
          padding: "6.75px 12px",
          borderRadius: 12,
          color: theme.palette.common.white,
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.brand.tertiary,
          },
        },

        icon: {
          color: theme.palette.common.white,
        },

        iconOpen: {
          color: theme.palette.common.white,
        },
      },
    },
  };
}
