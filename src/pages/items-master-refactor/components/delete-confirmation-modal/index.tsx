import {
  Button,
  CircularProgress,
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
}

const DeleteConfirmModal = ({
  open,
  isLoading,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) => {
  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        Delete Item
      </Typography>

      <Divider sx={{ borderColor: "#D2D2D2" }} />

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button size="medium" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="medium"
          variant="contained"
          disabled={isLoading}
          onClick={onConfirm}
        >
          {isLoading ? <CircularProgress size={16} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;
