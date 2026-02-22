import { useToastStore } from "@/store/useToastStore";
import { Alert, Snackbar } from "@mui/material";

const GlobalToast = () => {
  const { toast, hideToast } = useToastStore();

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
        sx={{ width: "100%", borderRadius: 0.5 }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalToast;
