import { useListCurrencies } from "@/services/queries/common/common.queries";
import {
  useCreateScenarioAggregator,
  useGetScenarioAggregator,
} from "@/services/queries/scenario-builder/scenario-builder.queries";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DeleteConfirmModal from "../../../list-scenarios/components/DeleteConfirmModal";
import { ComponentDrawerLayout } from "../../tree-grid/config/component-drawer-layout";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";

interface ComponentAggregatorDrawerProps {
  onClose: () => void;
  onUpdate: (items: any[]) => void;
  title?: string;
  initialItems?: any[];
  scenarioId?: string;
  cellId?: string;
}

const drawerGridId = "ComponentAggregatorGrid";
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

const scrapeAggregatorGridData = (gridId: string) => {
  const grid = (window as any).Grids?.[gridId];
  if (!grid) return null;

  const processRow = (gridRow: any): any => {
    const rowData: any = {
      id: gridRow.id,
      Def: gridRow.Def?.Name || gridRow.Def,
    };

    ["Component Name", "Currency", "Cost", "Cost for", "Cost per unit"].forEach(
      (colName) => {
        const val = grid.GetValue(gridRow, colName);
        if (val !== undefined && val !== null && val !== "") {
          rowData[colName] = val;
        }
      },
    );

    if (gridRow.firstChild) {
      const children: any[] = [];
      let child = gridRow.firstChild;
      while (child) {
        if (child.Kind === "Data" && !child.Deleted) {
          children.push(processRow(child));
        }
        child = child.nextSibling;
      }
      if (children.length > 0) {
        rowData.Items = children;
      }
    }
    return rowData;
  };

  const body: any[] = [];
  let row = grid.GetFirst();
  while (row) {
    if (row.Kind === "Data" && !row.parentNode?.id && !row.Deleted) {
      body.push(processRow(row));
    }
    row = grid.GetNext(row);
  }

  return { Body: [body] };
};

const AggregatorGrid = ({ data }: { data: any }) => {
  useTreeGridInit(
    drawerGridId,
    drawerGridContainerId,
    ComponentDrawerLayout,
    data,
  );
  return (
    <Box
      id={drawerGridContainerId}
      sx={{
        width: "100%",
        borderBottom: "1px solid #e2e8f0",
        "& .TGMain": {
          border: "1px solid #e2e8f0 !important",
          borderBottom: "none !important",
        },
        "& div[class*='NoDataRow']": {
          display: "none !important",
        },
      }}
    />
  );
};

const ComponentAggregatorDrawer = ({
  onClose,
  onUpdate,
  title = "Component aggregator",
  initialItems = [],
  scenarioId,
  cellId,
}: ComponentAggregatorDrawerProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const [gridData, setGridData] = useState<{ Body: any[][] } | null>(null);

  const { data: existingAggregator, isLoading: isFetchingData } =
    useGetScenarioAggregator(scenarioId, cellId);

  const { mutate: saveAggregator, isPending: isSaving } =
    useCreateScenarioAggregator();

  const { data: currencyData } = useListCurrencies({
    search: "",
    page_size: 100,
    skip: 0,
  });

  useEffect(() => {
    if (isFetchingData) return;

    const addDeleteIcons = (rows: any[]): any[] => {
      return rows.map((row) => ({
        ...row,
        Actions: renderDeleteIcon(row.id),
        Items: row.Items ? addDeleteIcons(row.Items) : undefined,
      }));
    };

    if (existingAggregator?.data?.Body) {
      // Use remote tree data if it exists
      const processedBody = existingAggregator.data.Body.map((rows: any[]) =>
        addDeleteIcons(rows),
      );
      setGridData({ Body: processedBody });
    } else {
      // Fallback to initialItems (flat)
      setGridData({
        Body: [
          initialItems.length > 0
            ? initialItems.map((item: any) => ({
                ...item,
                "Component Name": item.name || "",
                Currency: item.currency || "USD",
                Cost: item.cost || 0,
                "Cost for": item.costFor || "Base UOM",
                Actions: renderDeleteIcon(item.id),
              }))
            : [],
        ],
      });
    }
  }, [existingAggregator, isFetchingData, initialItems]);

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
      const names = currencyData.currencies
        .map((c: any) => c.currency)
        .join("|");
      const codes = currencyData.currencies.map((c: any) => c.id).join("|");

      // Update Enum and EnumKeys for column B
      grid.SetAttribute(null, "Currency", "Enum", "|" + names, 1);
      grid.SetAttribute(null, "Currency", "EnumKeys", "|" + codes, 1);
      grid.Render();
    }
  }, [currencyData]);

  const handleAddItem = useCallback(() => {
    const grid = (window as any).Grids?.[drawerGridId];
    if (grid) {
      const newRow = grid.AddRow(null, null, 1);
      if (newRow) {
        grid.SetValue(newRow, "Component Name", "", 1);
        grid.SetValue(newRow, "Currency", "USD", 1);
        grid.SetValue(newRow, "Cost", 0, 1);
        grid.SetValue(newRow, "Cost for", "Base UOM", 1);
        grid.SetValue(newRow, "Actions", renderDeleteIcon(newRow.id), 1);
        grid.Calculate();
      }
    }
  }, []);

  const handleUpdate = () => {
    const grid = (window as any).Grids?.[drawerGridId];
    if (grid && scenarioId && cellId) {
      // 1. Collect summary items for main grid (flat)
      const summaryRows: any[] = [];
      let row = grid.GetFirst();
      while (row) {
        if (row.Kind === "Data" && !row.Deleted) {
          summaryRows.push({
            id: row.id,
            name: grid.GetValue(row, "Component Name"),
            currency: grid.GetValue(row, "Currency"),
            cost: grid.GetValue(row, "Cost"),
            costFor: grid.GetValue(row, "Cost for"),
            costPerUnit: grid.GetValue(row, "Cost per unit"),
          });
        }
        row = grid.GetNext(row);
      }

      // 2. Scrape full tree data for API
      const fullTreeData = scrapeAggregatorGridData(drawerGridId);

      // 3. Save to backend
      saveAggregator(
        {
          scenario_id: scenarioId,
          payload: {
            aggregator_type: "Component",
            cell_id: cellId,
            data: fullTreeData as any,
          },
        },
        {
          onSuccess: () => {
            // 4. Update main grid UI
            onUpdate(summaryRows);
          },
        },
      );
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
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: "visible",
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
          width: "100%",
          bgcolor: "background.paper",
          position: "relative",
          p: 0,
          borderRadius: 1,
          overflow: "visible",
          minHeight: 60,
          display: "flex",
          ...(isFetchingData && {
            alignItems: "center",
            justifyContent: "center",
          }),
        }}
      >
        {isFetchingData ? (
          <CircularProgress size={20} />
        ) : gridData ? (
          <AggregatorGrid data={gridData} />
        ) : null}
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
        <Button
          size="small"
          variant="contained"
          onClick={handleUpdate}
          disabled={isSaving}
        >
          {isSaving ? "Updating..." : "Update"}
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

export default ComponentAggregatorDrawer;
