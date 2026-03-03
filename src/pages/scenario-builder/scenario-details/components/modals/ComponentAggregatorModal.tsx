import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ComponentAggregatorModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    label: string;
    systemField: string;
    setEntireColumn: boolean;
  }) => void;
}

const ComponentAggregatorModal = ({
  open,
  onClose,
  onConfirm,
}: ComponentAggregatorModalProps) => {
  const [label, setLabel] = useState("");
  const [systemField, setSystemField] = useState("System Field 1");
  const [setEntireColumn, setSetEntireColumn] = useState(false);

  const handleConfirm = () => {
    const finalLabel = label.trim()
      ? `${label} ( component iterator)`
      : "( component iterator)";

    onConfirm({ label: finalLabel, systemField, setEntireColumn });
    setLabel("");
    setSystemField("System Field 1");
    setSetEntireColumn(false);
    onClose();
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
        Component aggregator ( component iterator)
      </Typography>
      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}
      >
        <TextField
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
          placeholder="Enter label"
          variant="outlined"
          size="small"
        />

        <FormControl fullWidth size="small">
          <InputLabel shrink>Map System Field (Optional)</InputLabel>
          <Select
            value={systemField}
            onChange={(e) => setSystemField(e.target.value)}
            label="Map System Field (Optional)"
            notched
          >
            <MenuItem value="System Field 1">System Field 1</MenuItem>
            <MenuItem value="System Field 2">System Field 2</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={setEntireColumn}
              onChange={(e) => setSetEntireColumn(e.target.checked)}
            />
          }
          label="Set for entire column"
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            color: "#1a365d",
            borderColor: "#1a365d",
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            bgcolor: "#1a365d",
            "&:hover": { bgcolor: "#142a4a" },
            px: 3,
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComponentAggregatorModal;
