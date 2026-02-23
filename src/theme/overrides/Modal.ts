// theme/overrides/Dialog.ts
import { type Theme } from "@mui/material/styles";

export default function Dialog(theme: Theme) {
  return {
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: "md",
      },
      styleOverrides: {
        paper: {
          borderRadius: 1,
          backgroundImage: "none",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[24],
        },

        backdrop: {
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2, 3),
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1, 3),
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1, 3, 2),
        },
      },
    },
  };
}