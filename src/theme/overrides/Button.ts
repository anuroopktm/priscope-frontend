import { type Theme } from "@mui/material/styles";

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.primary.main,
          boxShadow: "none",

          "&:hover": {
            backgroundColor: theme.palette.brand.tertiary,
            boxShadow: "none",
          },
        },
      },
    },
    MuiIconButton: {
      variants: [
        {
          props: { variant: "ghost" },
          style: {
            backgroundColor: "transparent",
            color: theme.palette.primary.main,
            padding: 6,

            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },

        {
          props: { variant: "action" },
          style: {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.brand.tertiary,
            },
          },
        },
      ],
    },
  };
}
