import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type SaveFilterForm = {
  label: string;
};

type SaveFilterModalProps = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (label: string) => void;
  defaultLabel?: string;
  dataTypeOptions?: string[];
  isLoading?: boolean;
};

const SaveFilterModal = ({
  open = true,
  onClose,
  onSubmit,
  defaultLabel = "",
  isLoading,
}: SaveFilterModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaveFilterForm>({
    defaultValues: {
      label: defaultLabel,
    },
  });

  useEffect(() => {
    if (open) {
      reset({ label: defaultLabel });
    }
  }, [open, defaultLabel, reset]);

  const onFormSubmit = (data: SaveFilterForm) => {
    onSubmit(data.label);
    handleClose();
  };

  const handleClose = (
    _e?: object,
    reason?: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;

    onClose();
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          width: "499px",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          fontSize: "20px",
          fontWeight: 600,
          color: "#1A2B44",
        }}
      >
        Save Filter
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        <TextField
          label="Add Filter"
          {...register("label", {
            required: "Failed to add Filter. Please try again.",
          })}
          variant="outlined"
          size="small"
          error={!!errors.label}
          helperText={errors.label?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onFormSubmit)}
          variant="contained"
          loading={isLoading}
        >
          Save Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFilterModal;
