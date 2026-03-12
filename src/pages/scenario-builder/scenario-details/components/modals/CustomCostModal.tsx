import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CustomCostModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (label: string) => void;
}

interface CustomCostForm {
  label: string;
}

const CustomCostModal = ({
  open,
  onClose,
  onConfirm,
}: CustomCostModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CustomCostForm>({
    defaultValues: {
      label: "",
    },
  });

  const labelValue = watch("label");

  useEffect(() => {
    if (open) {
      reset({ label: "" });
    }
  }, [open, reset]);

  const handleConfirm = (data: CustomCostForm) => {
    onConfirm(data.label.trim());
    handleClose();
  };

  const handleClose = (
    _e?: object,
    reason?: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    reset();
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
          {...register("label", { required: true })}
          fullWidth
          placeholder="Enter label"
          variant="outlined"
          size="small"
          error={!!errors.label}
          helperText={errors.label ? "Label is required" : ""}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit(handleConfirm)}
          disabled={!labelValue?.trim()}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomCostModal;
