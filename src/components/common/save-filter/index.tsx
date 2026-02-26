import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { useState } from "react";

type SaveFilterModalProps = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (label: string) => void;
  defaultLabel?: string;
  dataTypeOptions?: string[];
};

const SaveFilterModal = ({
  open = true,
  onClose,
  onSubmit,
  defaultLabel = "",
}: SaveFilterModalProps) => {
  const [label, setLabel] = useState(defaultLabel);
  const [_dataType, setDataType] = useState("");
  const [errors, setErrors] = useState<{ label?: string; dataType?: string }>(
    {},
  );

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!label.trim())
      newErrors.label = "Failed to add Filter. Please try again.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(label);
    setLabel("");
    setDataType("");
    setErrors({});
    onClose();
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
        Save Filter
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        <TextField
          label="Add Filter"
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
          variant="contained"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFilterModal;
