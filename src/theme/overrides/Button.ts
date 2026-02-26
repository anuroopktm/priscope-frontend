import { type Theme } from "@mui/material/styles";

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      variants: [
        {
          props: { variant: "contained" },
          style: {
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "transparent",
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
            boxShadow: "none",

            "&:hover": {
              backgroundColor: theme.palette.brand.tertiary,
              boxShadow: "none",
            },

            "& .MuiButton-loadingIndicator": {
              color: theme.palette.primary.main,
            },
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,

            "&:hover": {
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.primary.main,
            },
          },
        },
      ],
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
