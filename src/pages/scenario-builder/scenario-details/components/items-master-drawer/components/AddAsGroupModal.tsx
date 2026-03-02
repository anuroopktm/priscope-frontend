import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface AddAsGroupModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (groupName: string) => void;
  title?: string;
  initialValue?: string;
  confirmLabel?: string;
}

const AddAsGroupModal = ({
  open,
  onClose,
  onConfirm,
  title = "Scenario Builder",
  initialValue = "",
  confirmLabel = "Create Group",
}: AddAsGroupModalProps) => {
  const [groupName, setGroupName] = useState<string>(initialValue);

  // Sync initial value when modal opens
  useEffect(() => {
    if (open) {
      setGroupName(initialValue);
    }
  }, [open, initialValue]);

  const handleConfirm = () => {
    if (groupName.trim()) {
      onConfirm(groupName);
      setGroupName("");
      onClose();
    }
  };

  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        {title}
      </Typography>
      <Divider sx={{ borderColor: "#D2D2D2" }} />

      <DialogContent>
        <TextField
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}
          onKeyUp={(e) => e.nativeEvent.stopImmediatePropagation()}
          fullWidth
          label="Label"
          placeholder="Enter label"
          variant="outlined"
          size="small"
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button size="medium" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={handleConfirm}
          disabled={!groupName.trim()}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAsGroupModal;
