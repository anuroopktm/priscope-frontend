import { type Theme } from "@mui/material/styles";

export default function Paper(theme: Theme) {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: theme.palette.background.paper,
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
  };
}
