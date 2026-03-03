import { useGetScenario } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import ComponentAggregatorDrawer from "./components/drawers/ComponentAggregatorDrawer";
import AddAsGroupModal from "./components/items-master-drawer/components/AddAsGroupModal";
import ItemsMasterDrawer from "./components/items-master-drawer/ItemsMasterDrawer";
import ComponentAggregatorModal from "./components/modals/ComponentAggregatorModal";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import { ScenarioDetailsLayout } from "./tree-grid/config/details-layout";
import { useScenarioGridData } from "./tree-grid/hooks/useScenarioGridData";
import { useScenarioGridEvents } from "./tree-grid/hooks/useScenarioGridEvents";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";

const gridId = "ScenarioGridDetails";
const gridContainerId = "TreeGrid_" + gridId;

const ScenarioDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenario } = useGetScenario(id);

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const [itemsToGroup, setItemsToGroup] = useState<any[]>([]);

  // Local editing state for group renaming
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>("");

  // Component Aggregator state
  const [isComponentAggregatorOpen, setIsComponentAggregatorOpen] =
    useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  // Aggregator Drawer state
  const [isAggregatorDrawerOpen, setIsAggregatorDrawerOpen] =
    useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<{
    rowId: string;
    col: string;
  } | null>(null);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [rowToDeleteId, setRowToDeleteId] = useState<string | null>(null);

  const { gridData, handleEditRowConfirm, processAddItems } =
    useScenarioGridData();

  // Handle Event Triggers from TreeGrid
  const openEditGroupModal = (rowId: string, groupName: string) => {
    setEditingGroupId(rowId);
    setEditingGroupName(groupName);
    setIsEditModalOpen(true);
  };

  const openComponentAggregatorModal = (col: string) => {
    setActiveColumn(col);
    setIsComponentAggregatorOpen(true);
  };

  const openComponentAggregatorDrawer = (rowId: string, col: string) => {
    setActiveCell({ rowId, col });
    setIsAggregatorDrawerOpen(true);
  };

  const openDeleteModal = (rowId: string) => {
    setRowToDeleteId(rowId);
    setIsDeleteModalOpen(true);
  };

  const isGroupToDelete = rowToDeleteId?.startsWith("group_");

  useScenarioGridEvents({
    gridId,
    gridData,
    openEditGroupModal,
    openComponentAggregatorModal,
    openComponentAggregatorDrawer,
    openDeleteModal,
  });

  useTreeGridInit(gridId, gridContainerId, ScenarioDetailsLayout, gridData);

  const handleAddItems = (items: any[], isGroup: boolean) => {
    if (!items.length) return;

    if (isGroup) {
      setItemsToGroup(items);
      setIsDrawerOpen(false);
      // Short delay to ensure drawer closing animation doesn't look janky with modal opening
      setTimeout(() => setIsGroupModalOpen(true), 100);
    } else {
      processAddItems(items);
      setIsDrawerOpen(false);
    }
  };

  const handleGroupConfirm = (groupName: string) => {
    processAddItems(itemsToGroup, groupName);
    setItemsToGroup([]);
    setIsGroupModalOpen(false);
  };

  const handleEditConfirm = (newName: string) => {
    handleEditRowConfirm(newName, editingGroupId);
    setEditingGroupId(null);
    setEditingGroupName("");
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const grid = (window as any).Grids?.[gridId];
    if (grid && rowToDeleteId) {
      const row = grid.GetRowById(rowToDeleteId);
      if (row) {
        grid.DeleteRow(row, 1);
      }
    }
    setRowToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const handleComponentAggregatorConfirm = (data: {
    label: string;
    systemField: string;
    setEntireColumn: boolean;
  }) => {
    const grid = (window as any).Grids?.[gridId];
    if (grid && activeColumn) {
      // Use the existing column name instead of creating a new one
      const colName = activeColumn;

      // Set the header caption
      // Most TreeGrid versions have 'Header' as the main header row object
      const headerRow = grid.Header || grid.GetRowById("Header");
      if (headerRow) {
        grid.SetValue(headerRow, colName, data.label, 1);
      } else {
        // Fallback: search for row with Kind="Header"
        let row = grid.GetFirst();
        while (row) {
          if (row.Kind === "Header") {
            grid.SetValue(row, colName, data.label, 1);
            break;
          }
          row = grid.GetNext(row);
        }
      }

      // Mark the column as an aggregator column
      grid.SetAttribute(null, colName, "AggregatorType", "Component", 1);

      // Make the column take width as per header text
      // Wrap in setTimeout to ensure the grid has processed the SetValue first
      setTimeout(() => {
        // Disable RelWidth so it doesn't stretch beyond its content
        grid.SetAttribute(null, colName, "RelWidth", 0, 1);
        grid.SetAttribute(null, colName, "Width", null, 1); // Clear fixed width to let AutoFitCol calculate it

        if (grid.AutoFitCol) {
          grid.AutoFitCol(colName);
        } else {
          grid.SetWidth(colName, -1);
        }

        // Update and Render to ensure the whole grid layout (including stretch) is recalculated
        grid.Update();
        grid.Render();
      }, 10);
    }
    setIsComponentAggregatorOpen(false);
    setActiveColumn(null);
  };

  const handleAggregatorUpdate = (items: any[]) => {
    const grid = (window as any).Grids?.[gridId];
    if (grid && activeCell) {
      const row = grid.GetRowById(activeCell.rowId);
      if (row) {
        // Calculate total cost for the trigger cell (Sum of Cost column)
        const totalAmount = items.reduce(
          (acc, item) => acc + (Number(item.cost) || 0),
          0,
        );
        // Log target info
        const targetCol = activeCell.col;
        const targetObj = grid.Cols[targetCol];
        // TreeGrid requires numeric Section (0=left, 1=mid, 2=right) and Position
        const targetSec = targetObj?.Sec ?? 1;
        const targetPos = targetObj?.Pos ?? 100;

        // Get list of all currently used item names to clean up duplicates
        const currentItemNames = items
          .map((i) => (i.name || "").trim().toLowerCase())
          .filter(Boolean);

        // --- PRE-SYNC CLEANUP ---
        // Hide ANY existing columns that look like they belong to the aggregator
        // or that have a caption matching one of our current items.
        // This prevents the "Double Shirt" issue.
        Object.keys(grid.Cols).forEach((c) => {
          const caption = (grid.Header?.[c] || "")
            .toString()
            .trim()
            .toLowerCase();
          const isCompCol = c.startsWith("Comp");
          if (isCompCol || currentItemNames.includes(caption)) {
            grid.HideCol(c);
          }
        });

        // Ensure grid state is fresh
        grid.Update();

        // Process each item to create/populate columns to the left
        items.forEach((item, index) => {
          if (!item.name) return;

          const cleanName = item.name.trim();
          const safeName = cleanName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          const colId = "Comp" + (safeName || "Item");

          const insertPos = targetPos + index;

          if (!grid.Cols[colId]) {
            // AddCol(col, sec, pos, width, show, type, caption)
            grid.AddCol(
              colId,
              targetSec,
              insertPos,
              110,
              1,
              "Float",
              cleanName,
            );
          } else {
            grid.ShowCol(colId);
          }

          // Set attributes to ensure it's movable and visible
          grid.SetAttribute(null, colId, "Caption", cleanName, 1);
          grid.SetAttribute(null, colId, "Visible", 1, 1);
          grid.SetAttribute(null, colId, "CanShow", 1, 1);
          grid.SetAttribute(null, colId, "CanMove", 1, 1);
          grid.SetAttribute(null, colId, "Type", "Float", 1);
          grid.SetAttribute(null, colId, "Format", "$0.00", 1);
          grid.SetAttribute(null, colId, "Width", 110, 1);
          grid.SetAttribute(null, colId, "CanEdit", 1, 1);

          // Force physical position to strictly be left of the trigger
          grid.MoveCol(colId, targetCol, 0, 1);

          // Sync Header Caption
          const headerRow = grid.Header || grid.GetRowById("Header");
          if (headerRow) {
            grid.SetValue(headerRow, colId, cleanName, 1);
          }

          // Parse and set the value
          const rawVal =
            typeof item.costPerUnit === "string"
              ? item.costPerUnit.replace(/[^0-9.]/g, "")
              : item.costPerUnit;
          const val = parseFloat(rawVal) || 0;

          grid.SetValue(row, colId, val, 1);
        });

        // Final summary update
        const total = parseFloat(totalAmount as any) || 0;

        // Format the trigger column as currency
        grid.SetAttribute(null, targetCol, "Type", "Float", 1);
        grid.SetAttribute(null, targetCol, "Format", "$0.00", 1);

        grid.SetValue(row, targetCol, total, 1);

        grid.Update();
        grid.Render();
      }
    }
    setIsAggregatorDrawerOpen(false);
    setActiveCell(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        minHeight: 0,
        bgcolor: "brand.background",
      }}
    >
      <ActionHeader
        title={scenario?.name}
        onAddItems={() => setIsDrawerOpen(true)}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Grid Section */}
        <Box
          sx={{
            flex: isAggregatorDrawerOpen ? 0.5 : 1,
            minHeight: 0,
            width: "100%",
            p: 2,
            transition: "flex 0.3s ease-in-out",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: 1,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <Box
              id={gridContainerId}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>

        {/* Bottom Panel Section (Split View) */}
        {isAggregatorDrawerOpen && (
          <Box
            sx={{
              flex: 0.5,
              minHeight: 0,
              width: "100%",
              px: 2,
              transition: "flex 0.3s ease-in-out",
            }}
          >
            <ComponentAggregatorDrawer
              onClose={() => {
                setIsAggregatorDrawerOpen(false);
                setActiveCell(null);
              }}
              onUpdate={handleAggregatorUpdate}
            />
          </Box>
        )}
      </Box>

      <ItemsMasterDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddItems={handleAddItems}
      />

      <AddAsGroupModal
        open={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onConfirm={handleGroupConfirm}
      />

      <AddAsGroupModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        title="Edit Group"
        initialValue={editingGroupName}
        confirmLabel="Save"
      />

      <ComponentAggregatorModal
        open={isComponentAggregatorOpen}
        onClose={() => setIsComponentAggregatorOpen(false)}
        onConfirm={handleComponentAggregatorConfirm}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={isGroupToDelete ? "Delete Group" : "Delete Item"}
        message={
          isGroupToDelete
            ? "Are you sure you want to delete this group and all items within it? This action cannot be undone."
            : "Are you sure you want to delete this item? This action cannot be undone."
        }
      />
    </Box>
  );
};

export default ScenarioDetailsPage;
