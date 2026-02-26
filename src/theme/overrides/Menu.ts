import { alpha, type Theme } from "@mui/material/styles";

export default function Menu(theme: Theme) {
  return {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.common.white,
          borderRadius: 12,
          overflow: "auto",
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
          backgroundColor: theme.palette.background.paper,

          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },

          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper,
          },

          "&.Mui-selected.Mui-focusVisible": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper,
          },

          "&.Mui-selected:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.8),
            color: theme.palette.background.paper,
          },
        },
      },
    },
  };
}
