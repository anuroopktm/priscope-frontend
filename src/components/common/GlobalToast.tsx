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
      sx={{ zIndex: 100000 }}
    >
      <Alert
        onClose={hideToast}
        severity={toast.severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 0.5,
          color: "background.paper",
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalToast;
