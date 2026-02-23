import { type Theme } from "@mui/material/styles";

export default function Chip(theme: Theme) {
  return {
    MuiChip: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiChip-label": {
            textTransform: "capitalize",
            padding: "2px 12px",
          },

          "&.MuiChip-colorSuccess": {
            backgroundColor: theme.palette.success.light,
            color: theme.palette.success.main,
          },

          "&.MuiChip-colorError": {
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.main,
          },

          "&.MuiChip-colorWarning": {
            backgroundColor: theme.palette.pending.light,
            color: theme.palette.pending.main,
          },
        },
      },
    },
  };
}
