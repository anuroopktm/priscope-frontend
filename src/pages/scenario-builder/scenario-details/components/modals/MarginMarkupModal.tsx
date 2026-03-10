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
import { useMemo, useState } from "react";

interface MarginMarkupModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    label: string;
    mapping: string;
    entireColumn: boolean;
  }) => void;
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
  const [label, setLabel] = useState("");
  const [mapping, setMapping] = useState("");
  const [entireColumn, setEntireColumn] = useState(false);

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
        return (
          col.caption &&
          typeof col.caption === "string" &&
          col.caption.trim() !== "" &&
          col.name !== "Panel"
        );
      });
  }, [open, gridId]);

  const handleConfirm = () => {
    onConfirm({ label, mapping, entireColumn });
    setLabel("");
    setMapping("");
    setEntireColumn(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          label="Enter label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label"
          InputLabelProps={{ shrink: true }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
        />

        <FormControl fullWidth size="small">
          <InputLabel shrink>Customer Cost Mapping (Optional)</InputLabel>
          <Select
            value={mapping}
            onChange={(e) => setMapping(e.target.value as string)}
            notched
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
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={entireColumn}
              onChange={(e) => setEntireColumn(e.target.checked)}
              sx={{ color: "#114a70", "&.Mui-checked": { color: "#114a70" } }}
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
          onClick={onClose}
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
          onClick={handleConfirm}
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
