import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open?: boolean;
  header?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCheckbox?: boolean;
  checkboxLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open = true,
  header = "Confirm Action",
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  showCheckbox = false,
  checkboxLabel = "Don't show this again",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 10,
          padding: 2,
          width: "400px",
          zIndex: "9999",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Typography
          fontWeight="700"
          sx={{ color: "#1A2B44", fontSize: "14px" }}
        >
          {header}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body1" sx={{ color: "#1A2B44", fontSize: "14px" }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: "column",
          gap: 2,
          px: 3,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderRadius: 7,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#144E72",
              color: "#1A2B44",
              height: "40px",
            }}
          >
            {cancelButtonText}
          </Button>

          <Button
            variant="contained"
            onClick={() => onConfirm()}
            sx={{
              borderRadius: 7,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#144E72",
              height: "40px",
            }}
          >
            {confirmButtonText}
          </Button>
        </Box>

        {showCheckbox && (
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                sx={{
                  color: "#144E72",
                  "&.Mui-checked": {
                    color: "#144E72",
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: "#1A2B44" }}>
                {checkboxLabel}
              </Typography>
            }
            sx={{ alignSelf: "center" }}
          />
        )}
      </DialogActions>
    </Dialog>,
    document.body,
  );
}
