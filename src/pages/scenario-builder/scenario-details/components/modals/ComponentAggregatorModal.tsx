import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

interface ComponentAggregatorForm {
  label: string;
  systemField: string;
  setEntireColumn: boolean;
}

interface ComponentAggregatorModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    label: string;
    systemField: string;
    setEntireColumn: boolean;
  }) => void;
}

const ComponentAggregatorModal = ({
  open,
  onClose,
  onConfirm,
}: ComponentAggregatorModalProps) => {
  const { control, handleSubmit, reset, register } =
    useForm<ComponentAggregatorForm>({
      defaultValues: {
        label: "",
        systemField: "System Field 1",
        setEntireColumn: false,
      },
    });

  const handleConfirm = (data: ComponentAggregatorForm) => {
    const finalLabel = data.label.trim()
      ? `${data.label} (Component Iterator)`
      : "(Component Iterator)";

    onConfirm({
      label: finalLabel,
      systemField: data.systemField,
      setEntireColumn: data.setEntireColumn,
    });
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <Typography
        variant="h6"
        sx={{ color: "#1a365d", fontWeight: "bold", px: 3, py: 2 }}
      >
        Component Aggregator
      </Typography>
      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}
      >
        <TextField
          {...register("label")}
          fullWidth
          label="Label"
          placeholder="Enter label"
          variant="outlined"
          size="small"
        />

        <FormControl fullWidth size="small">
          <InputLabel shrink>Map System Field (Optional)</InputLabel>
          <Controller
            name="systemField"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Map System Field (Optional)" notched>
                <MenuItem value="System Field 1">System Field 1</MenuItem>
                <MenuItem value="System Field 2">System Field 2</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <FormControlLabel
          sx={{ width: "fit-content" }}
          control={
            <Controller
              name="setEntireColumn"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} />
              )}
            />
          }
          label="Set for entire column"
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
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComponentAggregatorModal;
