import { useListCurrencies } from "@/services/queries/common/common.queries";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteConfirmModal from "../../../list-scenarios/components/DeleteConfirmModal";
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

const renderDeleteIcon = (id: string) => {
  return `
    <div 
      onclick="window.handleDeleteAggregatorRow && window.handleDeleteAggregatorRow('${id}')"
      style="display: flex; justify-content: center; align-items: center; cursor: pointer; height: 100%; color: #ef4444;"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    </div>
  `;
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const [gridData] = useState<{ Body: any[][] }>({
    Body: [
      initialItems.length > 0
        ? initialItems.map((item) => ({
            ...item,
            F: renderDeleteIcon(item.id),
          }))
        : [],
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
      setRowToDelete(rowId);
      setDeleteModalOpen(true);
    };
    return () => {
      delete (window as any).handleDeleteAggregatorRow;
    };
  }, []);

  const handleDeleteConfirm = () => {
    const grid = (window as any).Grids?.[drawerGridId];
    if (grid && rowToDelete) {
      const row = grid.GetRowById(rowToDelete);
      if (row) {
        grid.DeleteRow(row, 2); // 2 = delete row physically from view
      }
    }
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

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
            name: grid.GetValue(row, "A"),
            currency: grid.GetValue(row, "B"),
            cost: grid.GetValue(row, "C"),
            costFor: grid.GetValue(row, "D"),
            costPerUnit: grid.GetValue(row, "E"),
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

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ComponentAggregatorPanel;
