import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CreateColumnForm {
  label: string;
  dataType: string;
}

type CreateColumnModalProps = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateColumnForm) => void;
  defaultLabel?: string;
  dataTypeOptions: string[];
  loading?: boolean;
};

const CreateColumnModal = ({
  open = true,
  onClose,
  onSubmit,
  defaultLabel = "",
  dataTypeOptions,
  loading = false,
}: CreateColumnModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateColumnForm>({
    defaultValues: {
      label: defaultLabel,
      dataType: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ label: defaultLabel, dataType: "" });
    }
  }, [open, defaultLabel, reset]);

  const onFormSubmit = (data: CreateColumnForm) => {
    onSubmit(data);
    reset();
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
        Create new column
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        <TextField
          label="Column Label"
          {...register("label", { required: "Error" })}
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

        <TextField
          select
          label="Data Type"
          {...register("dataType", { required: "Error" })}
          defaultValue=""
          variant="outlined"
          size="small"
          error={!!errors.dataType}
          helperText={errors.dataType?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        >
          {dataTypeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
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
          variant="outlined"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit(onFormSubmit)} variant="contained">
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create Column"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateColumnModal;
