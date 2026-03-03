import { useGetScenario } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import AddAsGroupModal from "./components/items-master-drawer/components/AddAsGroupModal";
import ItemsMasterDrawer from "./components/items-master-drawer/ItemsMasterDrawer";
import ComponentAggregatorModal from "./components/modals/ComponentAggregatorModal";
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

  useScenarioGridEvents({
    gridId,
    gridData,
    openEditGroupModal,
    openComponentAggregatorModal,
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
          p: 2,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
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
    </Box>
  );
};

export default ScenarioDetailsPage;
