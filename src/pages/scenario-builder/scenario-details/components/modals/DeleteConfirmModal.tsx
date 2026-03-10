import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
} from "@mui/material";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

const DeleteConfirmModal = ({
  open,
  isLoading,
  onConfirm,
  onClose,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeleteConfirmModalProps) => {
  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        {title}
      </Typography>

      <Divider sx={{ borderColor: "#D2D2D2" }} />

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button
          size="medium"
          variant="outlined"
          onClick={onClose}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          size="medium"
          variant="contained"
          loading={isLoading}
          onClick={onConfirm}
          sx={{ minWidth: 100 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
