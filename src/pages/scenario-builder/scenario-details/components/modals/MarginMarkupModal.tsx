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
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

interface MarginMarkupForm {
  label: string;
  mapping: string;
  entireColumn: boolean;
}

interface MarginMarkupModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: MarginMarkupForm) => void;
  type: "Margin" | "Markup";
  gridId?: string;
}

const MarginMarkupModal = ({
  open,
  onClose,
  onConfirm,
  type,
  gridId = "ScenarioGridDetails",
}: MarginMarkupModalProps) => {
  const { control, handleSubmit, reset, register } = useForm<MarginMarkupForm>({
    defaultValues: {
      label: "",
      mapping: "",
      entireColumn: false,
    },
  });

  const title = type === "Margin" ? "Margin Component" : "Markup Component";

  const columns = useMemo(() => {
    const grid = (window as any).Grids?.[gridId];
    if (!grid) return [];

    const colNames = grid.GetCols();
    return colNames
      .map((name: string) => ({
        name,
        caption: grid.Header?.[name] || name,
      }))
      .filter((col: any) => {
        return col.caption && col.caption.trim() !== "" && col.name !== "Panel";
      });
  }, [open, gridId]);

  const handleConfirm = (data: MarginMarkupForm) => {
    onConfirm(data);
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
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "#1a365d", fontWeight: "bold", px: 3, py: 2 }}
      >
        {title}
      </Typography>
      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}
      >
        <TextField
          fullWidth
          size="small"
          label="Label"
          {...register("label")}
          placeholder="Enter label"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
        />

        <FormControl fullWidth size="small">
          <InputLabel shrink>Customer Cost Mapping (Optional)</InputLabel>
          <Controller
            name="mapping"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                notched
                displayEmpty
                label="Customer Cost Mapping (Optional)"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {columns.map((col: any) => (
                  <MenuItem key={col.name} value={col.name}>
                    {col.caption}
                  </MenuItem>
                ))}
                <MenuItem value="abc_cost">ABC Cost</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <FormControlLabel
          control={
            <Controller
              name="entireColumn"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  sx={{
                    color: "#114a70",
                    "&.Mui-checked": { color: "#114a70" },
                  }}
                />
              )}
            />
          }
          label={
            <Typography sx={{ fontWeight: 500 }}>
              Set for entire column
            </Typography>
          }
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "flex-start", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => handleClose()}
          sx={{
            borderRadius: "8px",
            color: "#114a70",
            borderColor: "#114a70",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(handleConfirm)}
          sx={{
            borderRadius: "8px",
            bgcolor: "#114a70",
            "&:hover": { bgcolor: "#0d3a58" },
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarginMarkupModal;
