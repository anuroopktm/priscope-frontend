import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface ForkScenarioModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading?: boolean;
  defaultName?: string;
}

const ForkScenarioModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  defaultName = "",
}: ForkScenarioModalProps) => {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (open) {
      setName(defaultName);
    }
  }, [open, defaultName]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        Fork Scenario
      </Typography>

      <Divider sx={{ borderColor: "#D2D2D2" }} />

      <Box component="form" onSubmit={handleFormSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            fullWidth
            label="Scenario Name"
            placeholder="Enter new scenario name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            size="small"
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
          <Button size="medium" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            disabled={!name.trim()}
            loading={isLoading}
          >
            Fork
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ForkScenarioModal;
