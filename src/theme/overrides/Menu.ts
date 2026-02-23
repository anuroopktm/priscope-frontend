import { alpha, type Theme } from "@mui/material/styles";

export default function Menu(theme: Theme) {
  return {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.common.white,
          borderRadius: 12,
        },
      },
    },
    MuiList: {
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
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        },
      },
    },
  };
}
