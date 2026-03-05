import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { MarginMarkupDrawerLayout } from "../../tree-grid/config/margin-markup-drawer-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";

interface MarginMarkupDrawerProps {
  onClose: () => void;
  onUpdate: (items: any[]) => void;
  type: "Margin" | "Markup";
  initialItems?: any[];
  mainRowId?: string;
  gridId?: string;
}

const renderSelectButton = (
  rowId: string,
  gridId: string,
  col: string,
  name: any = "Select",
) => {
  const isSelected = name !== "Select" && name != null;
  const nameStr = typeof name === "string" ? name : String(name || "");

  if (!isSelected) {
    return `
      <div style="display: flex; align-items: center; gap: 8px; height: 100%; padding: 0 8px;">
        <button 
          onclick="window.handleOpenColumnSelection && window.handleOpenColumnSelection('${rowId}', '${gridId}', '${col}')"
          style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 4px; color: #0369A1; font-size: 10.5px; font-weight: 600; cursor: pointer; padding: 1px 10px; min-width: 60px; height: 22px; transition: all 0.2s;"
          onmouseover="this.style.background='#BAE6FD'"
          onmouseout="this.style.background='#E0F2FE'"
        >
          Select
        </button>
      </div>
    `;
  }

  return `
    <div 
      onclick="window.handleOpenColumnSelection && window.handleOpenColumnSelection('${rowId}', '${gridId}', '${col}')"
      style="display: flex; align-items: center; justify-content: flex-start; gap: 12px; height: 100%; padding: 0 12px; cursor: pointer;"
    >
      <div style="background: #E0F2FE; border-radius: 4px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; color: #0369A1;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
      </div>
      <span style="font-size: 13px; color: #1e3a8a; font-weight: 600;">${nameStr}</span>
    </div>
  `;
};

const renderInputCell = (value: any, rowId: string, col: string) => {
  const val = value || "";
  return `
      <div style="padding: 0 8px; height: 100%; display: flex; align-items: center;">
        <input 
          type="text" 
          value="${val}" 
          placeholder="Enter %"
          oninput="window.handleMarginMarkupInput && window.handleMarginMarkupInput('${rowId}', '${col}', this.value)"
          style="width: 100%; border: none; outline: none; background: transparent; font-size: 13px; color: #1e3a8a;"
        />
      </div>
    `;
};

const MarginMarkupDrawer = ({
  onClose,
  onUpdate,
  type,
  initialItems = [],
  mainRowId,
  gridId = "MarginMarkupDrawerGrid",
}: MarginMarkupDrawerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [data, setData] = useState<any[]>(
    initialItems.length > 0
      ? initialItems
      : [{ id: "1", percent: "", column: "Select", value: 0 }],
  );

  const title = type === "Margin" ? "Margin Component" : "Markup Component";

  const updatedLayout = useMemo(() => {
    const layout = JSON.parse(JSON.stringify(MarginMarkupDrawerLayout));
    layout.Header.A = `${type} %`;
    layout.Cols[0].Caption = `${type} %`;
    return layout;
  }, [type]);

  const gridData = useMemo(() => {
    return {
      Body: [
        data.map((item) => ({
          id: item.id,
          A: renderInputCell(item.percent, item.id, "A"),
          B: renderSelectButton(item.id, gridId, "B", item.column),
          C: item.value || 0,
        })),
      ],
    };
  }, [data, gridId]);

  useEffect(() => {
    (window as any).handleOpenColumnSelection = (
      rowId: string,
      _gridId: string,
      col: string,
    ) => {
      if ((window as any).startScenarioColumnSelection) {
        (window as any).startScenarioColumnSelection(rowId, gridId);
      }
    };

    (window as any).handleMarginMarkupInput = (
      rowId: string,
      _col: string,
      value: string,
    ) => {
      setData((prev) =>
        prev.map((item) =>
          item.id === rowId ? { ...item, percent: value } : item,
        ),
      );
    };

    (window as any).finishScenarioColumnSelection = (
      name: string,
      colId: string,
      rowId: string,
      _gridId: string,
      value: number,
    ) => {
      setData((prev) =>
        prev.map((item) =>
          item.id === rowId
            ? { ...item, column: name, columnId: colId, columnValue: value }
            : item,
        ),
      );
    };

    return () => {
      delete (window as any).handleOpenColumnSelection;
      delete (window as any).handleMarginMarkupInput;
      delete (window as any).finishScenarioColumnSelection;
      if ((window as any).clearScenarioColumnHighlights) {
        (window as any).clearScenarioColumnHighlights();
      }
    };
  }, [gridId]);

  const calculateTotal = (percentStr: string, baseValue: number) => {
    const percent = parseFloat(percentStr) || 0;
    if (type === "Margin") {
      // Calculation for margin: (baseValue / (1 - margin%)) - baseValue
      // Or simply: baseValue / (1 - percent/100) * (percent/100)
      return baseValue / (1 - percent / 100) - baseValue;
    } else {
      // Markup = baseValue * markup%
      return (baseValue * percent) / 100;
    }
  };

  const handleDone = () => {
    const finalItems = data.map((item) => {
      const val = calculateTotal(item.percent, item.columnValue || 0);
      return {
        id: item.id,
        name: `${type} (${item.percent}%)`,
        percent: item.percent,
        column: item.column,
        columnId: item.columnId,
        cost: val,
        costPerUnit: val,
        type,
      };
    });
    onUpdate(finalItems);
    onClose();
  };

  useTreeGridInit(
    gridId,
    "MarginMarkupDrawerContainer",
    updatedLayout,
    gridData,
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        borderRadius: "12px 12px 0 0",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1a365d" }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            p: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "#1e40af" }}
            >
              Calculate - Cost aggregator
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  textTransform: "none",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                Saved Template
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => setAnchorEl(null)}>
                  Default Template
                </MenuItem>
              </Menu>
              <Button
                variant="contained"
                startIcon={<BookmarkAddIcon />}
                size="small"
                sx={{
                  bgcolor: "#114a70",
                  textTransform: "none",
                  borderRadius: "6px",
                  px: 2,
                  "&:hover": { bgcolor: "#0d3a58" },
                }}
              >
                Save Template
              </Button>
            </Stack>
          </Box>

          <Box
            id="MarginMarkupDrawerContainer"
            sx={{
              height: "140px",
              width: "100%",
              "& .TGMain": { border: "none" },
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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
            onClick={handleDone}
            sx={{
              borderRadius: "8px",
              bgcolor: "#114a70",
              "&:hover": { bgcolor: "#0d3a58" },
              textTransform: "none",
              fontWeight: "bold",
              px: 4,
            }}
          >
            Done
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MarginMarkupDrawer;
