import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  Typography,
  alpha,
  useTheme,
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
  const theme = useTheme();
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
      <DialogContent>
        <Typography
          variant="h6"
          sx={{ color: alpha(theme.palette.primary.main, 0.9) }}
        >
          Update Status
        </Typography>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
          IconComponent={KeyboardArrowDownRoundedIcon}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="invited">Invited</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, justifyContent: "start" }}>
        <Button
          size="large"
          variant="outlined"
          onClick={onClose}
          sx={{
            borderWidth: 2,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.primary.main,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          size="large"
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
