import { alpha, type Theme } from "@mui/material/styles";

export default function Menu(theme: Theme) {
  return {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.common.white,
          borderRadius: 12,
          overflow: "hidden",
        },
      },
    },

    MuiMenuList: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.main,

          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },

          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper,

            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.85),
              color: theme.palette.background.paper,
            },
          },

          "&.Mui-focusVisible": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },
        },
      },
    },
  };
}
