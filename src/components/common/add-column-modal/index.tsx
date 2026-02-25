import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { useState } from "react";

type CreateColumnModalProps = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: { label: string; dataType: string }) => void;
  defaultLabel?: string;
  dataTypeOptions: string[];
};

const CreateColumnModal = ({
  open = true,
  onClose,
  onSubmit,
  defaultLabel = "",
  dataTypeOptions,
}: CreateColumnModalProps) => {
  // const { t } = useTranslation();
  const theme = useTheme();

  const [label, setLabel] = useState(defaultLabel);
  const [dataType, setDataType] = useState("");
  const [errors, setErrors] = useState<{ label?: string; dataType?: string }>(
    {},
  );

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!label.trim())
      newErrors.label = "Error";
    if (!dataType)
      newErrors.dataType = "Error";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ label, dataType });
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
          color: theme.custom.textColor,
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
          sx={{
            height: "40px",
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Create Column
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateColumnModal;
