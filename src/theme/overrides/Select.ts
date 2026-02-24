import type { Theme } from "@mui/material/styles";

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "7px 6px",
          paddingRight: "40px !important",

          "&:focus": {
            backgroundColor: "transparent",
          },
        },

        icon: {
          right: 10,
          color: theme.palette.common.white,
        },
      },
    },

    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,

          "&:hover": {
            backgroundColor: theme.palette.brand.tertiary,
          },

          "&.Mui-focused": {
            backgroundColor: theme.palette.primary.main,
          },

          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.text.disabled,
          },

          "&:before, &:after": {
            display: "none",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },

          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.text.disabled,
          },
        },

        notchedOutline: {
          borderWidth: 2,
          borderColor: theme.palette.primary.main,
        },
      },
    },
  };
}
