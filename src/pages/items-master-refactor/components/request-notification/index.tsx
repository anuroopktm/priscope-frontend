import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import React from "react";

type RequestSuccessDialogProps = {
  setNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RequestSuccessDialog({
  setNotificationOpen,
}: RequestSuccessDialogProps) {
  const handleClose = () => {
    setNotificationOpen(false);
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 1,
          padding: 2,
          width: 400,
          backgroundColor: "##FFFFFF",
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            fontStyle: "bold",

            mb: 2,
            color: "#1A2B44",
            fontSize: "14px",
          }}
        >
          Submitted your request
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#1A2B44",
            fontSize: "14px",
          }}
        >
          We'll notify you when your request has been approved.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pt: 2, pb: 1 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: "#144E72",
            color: "white",
            borderRadius: 5,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            height: "40px",
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
