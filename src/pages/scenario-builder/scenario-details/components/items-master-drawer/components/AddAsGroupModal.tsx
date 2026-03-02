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

interface AddAsGroupModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (groupName: string) => void;
}

const AddAsGroupModal = ({
  open,
  onClose,
  onConfirm,
}: AddAsGroupModalProps) => {
  const [groupName, setGroupName] = useState<string>("");

  const handleConfirm = () => {
    if (groupName.trim()) {
      onConfirm(groupName);
      setGroupName("");
      onClose();
    }
  };

  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick") return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        Scenario Builder
      </Typography>
      <Divider sx={{ borderColor: "#D2D2D2" }} />

      <DialogContent>
        <TextField
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
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
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAsGroupModal;
