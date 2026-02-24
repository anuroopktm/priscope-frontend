import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface StatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

const StatusUpdateModal = ({
  open,
  onClose,
  onChange,
  isLoading,
}: StatusUpdateModalProps) => {
  const [status, setStatus] = useState<string>("active");

  const handleUpdate = () => {
    onChange(status);
  };

  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick") return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          Update Status
        </Typography>
        <Select
          fullWidth
          size="small"
          variant="outlined"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="invited">Invited</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "start", gap: 1 }}>
        <Button size="medium" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="medium"
          variant="contained"
          loading={isLoading}
          onClick={handleUpdate}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateModal;
