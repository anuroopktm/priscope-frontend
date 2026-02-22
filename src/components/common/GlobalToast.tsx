import { useToastStore } from "@/store/useToastStore";
import { Alert, Snackbar, useTheme } from "@mui/material";

const GlobalToast = () => {
  const { toast, hideToast } = useToastStore();
  const theme = useTheme();
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={6000}
      onClose={hideToast}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={hideToast}
        severity={toast.severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 0.5,
          color: theme.palette.background.paper,
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalToast;
