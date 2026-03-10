import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
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

const MarginMarkupDrawer = ({
  onClose,
  onUpdate,
  type,
  initialItems = [],
  mainRowId: _mainRowId,
  gridId = "MarginMarkupDrawerGrid",
}: MarginMarkupDrawerProps) => {
  const [data, setData] = useState<any[]>(
    initialItems.length > 0
      ? initialItems
      : [{ id: "1", percent: "", column: "Select", columnValue: 0, value: 0 }],
  );

  const title = type === "Margin" ? "Margin Component" : "Markup Component";

  const calculateTotal = (percentStr: string, baseValue: number) => {
    const percent = parseFloat(percentStr) || 0;
    // Both Margin and Markup now use the same simple percentage formula as requested:
    // (percent / 100) * baseValue
    return (baseValue * percent) / 100;
  };

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
          A: item.percent,
          B: renderSelectButton(
            item.id,
            gridId,
            "B",
            typeof item.columnValue === "number" && item.column !== "Select"
              ? `$${item.columnValue.toFixed(2)}`
              : item.column,
          ),
          C: item.value || 0,
        })),
      ],
    };
  }, [data, gridId]);

  useEffect(() => {
    (window as any).handleOpenColumnSelection = (
      rowId: string,
      _gridId: string,
      _col: string,
    ) => {
      if ((window as any).startScenarioColumnSelection) {
        (window as any).startScenarioColumnSelection(rowId, gridId);
      }
    };

    const onAfterValueChanged = (
      grid: any,
      row: any,
      _col: string,
      val: any,
    ) => {
      if (grid.id === gridId && _col === "A") {
        const percent = String(val || "");
        setData((prev) => {
          const item = prev.find((i) => i.id === row.id);
          if (item) {
            const total = calculateTotal(percent, item.columnValue || 0);
            grid.SetValue(row, "C", total, 1);
          }
          return prev;
        });
      }
    };

    if (window.TGSetEvent) {
      window.TGSetEvent("OnAfterValueChanged", gridId, onAfterValueChanged);
    }

    (window as any).finishScenarioColumnSelection = (
      name: string,
      colId: string,
      rowId: string,
      _gridId: string,
      value: number,
    ) => {
      setData((prev) =>
        prev.map((item) => {
          if (item.id === rowId) {
            const grid = (window as any).Grids?.[gridId];
            const row = grid?.GetRowById(rowId);
            const currentPercent = row ? String(row.A || "") : item.percent;

            const val = calculateTotal(currentPercent, value);
            return {
              ...item,
              column: name,
              columnId: colId,
              columnValue: value,
              percent: currentPercent,
              value: val,
            };
          }
          return item;
        }),
      );
    };

    return () => {
      delete (window as any).handleOpenColumnSelection;
      delete (window as any).finishScenarioColumnSelection;
      if (window.TGDelEvent) {
        window.TGDelEvent("OnAfterValueChanged", gridId);
      }
      if ((window as any).clearScenarioColumnHighlights) {
        (window as any).clearScenarioColumnHighlights();
      }
    };
  }, [gridId]);

  const handleDone = () => {
    const grid = (window as any).Grids?.[gridId];

    const finalItems = data.map((item) => {
      const row = grid?.GetRowById(item.id);
      const finalPercent = row ? String(row.A || "") : item.percent;
      const finalCost = row ? Number(row.C || 0) : item.value;

      return {
        id: item.id,
        name: `${type} (${finalPercent}%)`,
        percent: finalPercent,
        column: item.column,
        columnId: item.columnId,
        cost: finalCost,
        costPerUnit: finalCost,
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
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflowY: "auto",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#1a365d" }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={() => {
            if ((window as any).clearScenarioColumnHighlights) {
              (window as any).clearScenarioColumnHighlights();
            }
            onClose();
          }}
          size="small"
          sx={{ color: "#64748b" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: 1,
          borderColor: "grey.200",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#1a365d" }}
          >
            Calculate - Cost aggregator
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: 3,
          pb: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            width: "fit-content",
          }}
        >
          <Box
            id="MarginMarkupDrawerContainer"
            sx={{
              height: "70px",
              width: "100%",
              "& .TGMain": { border: "none" },
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if ((window as any).clearScenarioColumnHighlights) {
                (window as any).clearScenarioColumnHighlights();
              }
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleDone}>
            Done
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MarginMarkupDrawer;
