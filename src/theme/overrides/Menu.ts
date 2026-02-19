import { type Theme } from "@mui/material/styles";

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
  };
}
