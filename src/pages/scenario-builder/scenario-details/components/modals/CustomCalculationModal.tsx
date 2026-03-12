import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface Token {
  id: string;
  type: "column" | "numeric" | "operator";
  value: string;
  label: string;
}

interface CustomCalculationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (formula: string, label?: string) => void;
  initialValue?: string;
  gridId?: string; // ScenarioGridDetails
  targetRowId?: string | null;
}

const CustomCalculationModal = ({
  open,
  onClose,
  onConfirm,
  initialValue = "",
  gridId = "ScenarioGridDetails",
  targetRowId = null,
}: CustomCalculationModalProps) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [numericValue, setNumericValue] = useState("");

  // Sync tokens when modal opens (simple parsing)
  useEffect(() => {
    if (open) {
      if (initialValue) {
        // Use regex to find tokens: matches bracketed text [like this] OR non-space sequences
        const matches = initialValue.match(/\[[^\]]+\]|\S+/g) || [];
        const initialTokens: Token[] = matches.map((v, i) => {
          let type: Token["type"] = "operator";
          let label = v;

          if (v.startsWith("[") && v.endsWith("]")) {
            type = "column";
            const colName = v.slice(1, -1);
            const grid = (window as any).Grids?.[gridId];
            label = grid?.Header?.[colName] || colName;
          } else if (!isNaN(Number(v))) {
            type = "numeric";
          }

          return {
            id: `init-${i}-${Date.now()}`,
            type,
            value: v,
            label,
          };
        });
        setTokens(initialTokens);
      } else {
        setTokens([]);
      }
    }
  }, [open]); // Only run when open state changes

  const columns = useMemo(() => {
    const grid = (window as any).Grids?.[gridId];
    if (!grid) return [];

    const colNames = grid.GetCols();
    return colNames
      .map((name: string) => ({
        name,
        caption: grid.Header[name] || name,
        type: grid.GetAttribute(null, name, "Type"),
      }))
      .filter((col: any) => {
        const type = String(col.type || "").toLowerCase();
        const isNumeric = type === "float" || type === "int";
        const caption = String(col.caption || "").toLowerCase();

        // Keywords that suggest a column is likely numeric even if typed as Text/Html
        const likelyNumeric =
          caption.includes("cost") ||
          caption.includes("price") ||
          caption.includes("margin") ||
          caption.includes("markup") ||
          caption.includes("aggregator") ||
          caption.includes("iterator") ||
          caption.includes("amount") ||
          caption.includes("amt");

        return (
          col.caption &&
          typeof col.caption === "string" &&
          col.caption.trim() !== "" &&
          col.type !== "Panel" &&
          col.name !== "Panel" &&
          (isNumeric || likelyNumeric)
        );
      });
  }, [open, gridId]);

  const addToExpression = (
    type: Token["type"],
    value: string,
    label: string,
  ) => {
    const newToken: Token = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      value,
      label,
    };
    setTokens((prev) => [...prev, newToken]);
  };

  const removeToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddNumeric = () => {
    if (numericValue) {
      addToExpression("numeric", numericValue, numericValue);
      setNumericValue("");
    }
  };

  const handleConfirm = () => {
    const formula = tokens.map((t) => t.value).join(" ");
    const columnLabels = Array.from(
      new Set(tokens.filter((t) => t.type === "column").map((t) => t.label)),
    );

    const label =
      columnLabels.length > 0 ? columnLabels.join(", ") : tokens[0]?.label;

    onConfirm(formula.trim(), label);
    setTokens([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "4px" },
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "#1a365d", fontWeight: "bold", px: 3, py: 2 }}
      >
        Custom calculation
      </Typography>
      <Divider />

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}
      >
        <Paper
          variant="outlined"
          sx={{
            minHeight: 80,
            p: 1.5,
            bgcolor: "grey.50",
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignContent: "flex-start",
            borderRadius: "4px",
          }}
        >
          {tokens.map((token) => (
            <Chip
              key={token.id}
              label={token.label}
              onDelete={() => removeToken(token.id)}
              sx={{
                borderRadius: "4px",
                height: "32px",
                fontWeight: "bold",
                bgcolor: "#e2e8f0",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
                "& .MuiChip-deleteIcon": {
                  color: "#1e293b",
                  fontSize: "16px",
                },
              }}
            />
          ))}
          {tokens.length === 0 && (
            <Typography variant="body2" sx={{ color: "grey.400" }}>
              Add Column, numeric or math operator to define custom calculation
            </Typography>
          )}
        </Paper>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: "bold", color: "#1e293b" }}
          >
            Select column
          </Typography>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <FormControl fullWidth size="small">
              <InputLabel shrink>Item Column</InputLabel>
              <Select
                value={selectedColumn}
                onChange={(e: any) => {
                  const colName = e.target.value as string;
                  if (colName) {
                    const colObj = columns.find((c: any) => c.name === colName);
                    const label = colObj?.caption || colName;
                    const grid = (window as any).Grids?.[gridId];

                    if (grid && targetRowId) {
                      const row = grid.GetRowById(targetRowId);
                      if (row) {
                        addToExpression("column", `[${colName}]`, label);
                      } else {
                        addToExpression("column", `[${colName}]`, label);
                      }
                    } else {
                      addToExpression("column", `[${colName}]`, label);
                    }
                    setSelectedColumn("");
                  }
                }}
                displayEmpty
                notched
                label="Item Column"
                sx={{ borderRadius: "4px" }}
              >
                <MenuItem value="" disabled>
                  Select Column
                </MenuItem>
                {columns.map((col: any) => (
                  <MenuItem key={col.name} value={col.name}>
                    {col.caption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "bold", color: "#1e293b" }}
            >
              Numeric
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value)}
                placeholder="Enter Numeric Value"
                label="Item Column"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "4px" },
                }}
              />
              <Button variant="contained" onClick={handleAddNumeric}>
                Add
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "bold", color: "#1e293b" }}
            >
              Select operator
            </Typography>
            <Stack direction="row" spacing={1}>
              {["+", "-", "×", "÷", "(", ")"].map((op) => (
                <IconButton
                  key={op}
                  onClick={() => {
                    const value = op === "×" ? "*" : op === "÷" ? "/" : op;
                    addToExpression("operator", value, op);
                  }}
                  sx={{
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    width: 40,
                    height: 40,
                    color: "#64748b",
                    fontSize: 24,
                  }}
                >
                  {op}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleConfirm}
          disabled={tokens.length === 0}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomCalculationModal;
