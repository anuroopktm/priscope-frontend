import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface CustomCostModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (label: string) => void;
}

const CustomCostModal = ({
  open,
  onClose,
  onConfirm,
}: CustomCostModalProps) => {
  const [label, setLabel] = useState("");

  const handleConfirm = () => {
    if (label.trim()) {
      onConfirm(label.trim());
      setLabel("");
      onClose();
    }
  };

  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <Typography
        variant="h6"
        sx={{ color: "#1a365d", fontWeight: "bold", px: 3, py: 2 }}
      >
        Custom
      </Typography>
      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}
      >
        <TextField
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
          fullWidth
          placeholder="Enter label"
          variant="outlined"
          size="small"
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleConfirm}
          disabled={!label.trim()}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomCostModal;
