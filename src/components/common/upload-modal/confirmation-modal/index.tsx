import { Box, Button, Dialog, Typography, useTheme } from "@mui/material";
import React from "react";

interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Yes",
  cancelText = "No",
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 1,
          p: 4,
          px: 6,
          gap: 4,
          textAlign: "center",
          width: "400px",
        },
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}
        >
          {title}
        </Typography>
      )}

      <Typography sx={{ fontWeight: 400 }}>{message}</Typography>

      <Box display="flex" justifyContent="center" gap={1}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: 8 }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            borderRadius: 8,
            bgcolor: theme.palette.divider || theme.palette.primary.main,
            "&:hover": { bgcolor: "#0F3A5A" },
          }}
        >
          {confirmText}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ConfirmationDialog;
