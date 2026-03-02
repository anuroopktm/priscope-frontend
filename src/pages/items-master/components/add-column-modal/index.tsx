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
import { useEffect, useState } from "react";

type CreateColumnModalProps = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: { label: string; dataType: string }) => void;
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
  const [label, setLabel] = useState(defaultLabel ?? "");
  const [dataType, setDataType] = useState("");
  const [errors, setErrors] = useState<{ label?: string; dataType?: string }>(
    {},
  );

  useEffect(() => {
    if (open) {
      setLabel(defaultLabel ?? "");
    }
  }, [open, defaultLabel]);

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!label.trim()) newErrors.label = "Error";
    if (!dataType) newErrors.dataType = "Error";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ label, dataType });
    setLabel("");
    setDataType("");
    setErrors({});
    // onClose();
  };

  const handleCancel = () => {
    setLabel("");
    setDataType("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            if (errors.label)
              setErrors((prev) => ({ ...prev, label: undefined }));
          }}
          variant="outlined"
          size="small"
          error={!!errors.label}
          helperText={errors.label}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />

        <TextField
          select
          label="Data Type"
          value={dataType}
          onChange={(e) => {
            setDataType(e.target.value);
            if (errors.dataType)
              setErrors((prev) => ({ ...prev, dataType: undefined }));
          }}
          variant="outlined"
          size="small"
          error={!!errors.dataType}
          helperText={errors.dataType}
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
            handleCancel();
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
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
