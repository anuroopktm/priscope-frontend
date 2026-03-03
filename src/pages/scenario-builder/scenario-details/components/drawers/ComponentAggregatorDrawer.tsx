import { useListCurrencies } from "@/services/queries/common/common.queries";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AggregatorDrawerLayout } from "../../tree-grid/config/aggregator-drawer-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";

interface ComponentAggregatorPanelProps {
  onClose: () => void;
  onUpdate: (items: any[]) => void;
  title?: string;
  initialItems?: any[];
}

const drawerGridId = "AggregatorDrawerGrid";
const drawerGridContainerId = "TreeGrid_" + drawerGridId;

const renderDeleteIcon = (rowId: string) => {
  return `<div style="display: flex; align-items: center; justify-content: center;">
    <button 
      style="background-color: transparent; border: none; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;"
      onmouseover="this.style.backgroundColor='#ffebee'"
      onmouseout="this.style.backgroundColor='transparent'"
      onclick="window.handleDeleteAggregatorRow && window.handleDeleteAggregatorRow('${rowId}')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 3.66732L12.5867 10.3507C12.4813 12.058 12.4287 12.912 12 13.526C11.7884 13.8294 11.5159 14.0855 11.2 14.278C10.562 14.6673 9.70667 14.6673 7.996 14.6673C6.28267 14.6673 5.426 14.6673 4.78667 14.2773C4.47059 14.0845 4.19814 13.8279 3.98667 13.524C3.55867 12.9093 3.50667 12.054 3.404 10.344L3 3.66732M2 3.66732H14M10.704 3.66732L10.2487 2.72865C9.94667 2.10465 9.79533 1.79332 9.53467 1.59865C9.47676 1.55553 9.41545 1.51718 9.35133 1.48398C9.06267 1.33398 8.716 1.33398 8.02333 1.33398C7.31267 1.33398 6.95733 1.33398 6.66333 1.48998C6.59834 1.52479 6.53635 1.56493 6.478 1.60998C6.21467 1.81198 6.06733 2.13532 5.77267 2.78132L5.36867 3.66732" stroke="#EF4444" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>`;
};

const AggregatorGrid = ({ data }: { data: any }) => {
  useTreeGridInit(
    drawerGridId,
    drawerGridContainerId,
    AggregatorDrawerLayout,
    data,
  );
  return (
    <Box id={drawerGridContainerId} sx={{ height: "100%", width: "100%" }} />
  );
};

const ComponentAggregatorPanel = ({
  onClose,
  onUpdate,
  title = "Component aggregator",
  initialItems = [],
}: ComponentAggregatorPanelProps) => {
  const [gridData] = useState<{ Body: any[][] }>({
    Body: [
      initialItems.length > 0
        ? initialItems.map((item) => ({
            ...item,
            F: renderDeleteIcon(item.id),
          }))
        : [
            {
              id: "row_1",
              A: "Button",
              B: "USD",
              C: 4.0,
              D: "Base UOM",
              F: renderDeleteIcon("row_1"),
            },
          ],
    ],
  });

  const { data: currencyData } = useListCurrencies({
    search: "",
    page_size: 100,
    skip: 0,
  });

  // Global handler for deletion
  useEffect(() => {
    (window as any).handleDeleteAggregatorRow = (rowId: string) => {
      const grid = (window as any).Grids?.[drawerGridId];
      if (grid) {
        const row = grid.GetRowById(rowId);
        if (row) {
          grid.DeleteRow(row, 2); // 2 = delete row and remove from DOM
        }
      }
    };
    return () => {
      delete (window as any).handleDeleteAggregatorRow;
    };
  }, []);

  // Update Currencies in Grid when API data arrives
  useEffect(() => {
    const grid = (window as any).Grids?.[drawerGridId];
    if (grid && currencyData?.currencies) {
      const names = currencyData.currencies.map((c) => c.currency).join("|");
      const codes = currencyData.currencies.map((c) => c.id).join("|");

      // Update Enum and EnumKeys for column B
      grid.SetAttribute(null, "B", "Enum", "|" + names, 1);
      grid.SetAttribute(null, "B", "EnumKeys", "|" + codes, 1);
      grid.Render();
    }
  }, [currencyData]);

  const handleAddItem = () => {
    const grid = (window as any).Grids?.[drawerGridId];
    if (grid) {
      const newRow = grid.AddRow(null, null, 1);
      if (newRow) {
        grid.SetValue(newRow, "A", "", 1);
        grid.SetValue(newRow, "B", "USD", 1);
        grid.SetValue(newRow, "C", 0, 1);
        grid.SetValue(newRow, "D", "Base UOM", 1);
        grid.SetValue(newRow, "F", renderDeleteIcon(newRow.id), 1);
        grid.Calculate();
      }
    }
  };

  const handleUpdate = () => {
    const grid = (window as any).Grids?.[drawerGridId];
    if (grid) {
      const rows: any[] = [];
      let row = grid.GetFirst();
      while (row) {
        if (row.Kind === "Data" && !row.Deleted) {
          rows.push({
            id: row.id,
            name: row.A,
            currency: row.B,
            cost: row.C,
            costFor: row.D,
            costPerUnit: row.E,
          });
        }
        row = grid.GetNext(row);
      }
      onUpdate(rows);
    }
  };

  // Global handler for adding items from within the grid
  useEffect(() => {
    (window as any).handleAddItemFromGrid = () => {
      handleAddItem();
    };
    return () => {
      delete (window as any).handleAddItemFromGrid;
    };
  }, [handleAddItem]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "#1a365d" }}
        >
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Grid Content */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          minHeight: 0,
          bgcolor: "background.paper",
          position: "relative",
          p: 0,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <AggregatorGrid data={gridData} />
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          pt: 2,
          display: "flex",
          justifyContent: "start",
          gap: 2,
          bgcolor: "background.paper",
          flexShrink: 0,
        }}
      >
        <Button size="small" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={handleUpdate}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default ComponentAggregatorPanel;
