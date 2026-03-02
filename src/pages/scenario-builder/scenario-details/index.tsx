import { useGetScenario } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import AddAsGroupModal from "./components/items-master-drawer/components/AddAsGroupModal";
import ItemsMasterDrawer from "./components/items-master-drawer/ItemsMasterDrawer";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [itemsToGroup, setItemsToGroup] = useState<any[]>([]);

  // Local editing state for group renaming
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>("");

  const { gridData, handleDeleteRow, handleEditRowConfirm, processAddItems } =
    useScenarioGridData();

  // Handle Event Triggers from TreeGrid
  const openEditGroupModal = (rowId: string, groupName: string) => {
    setEditingGroupId(rowId);
    setEditingGroupName(groupName);
    setIsEditModalOpen(true);
  };

  useScenarioGridEvents({
    gridId,
    gridData,
    handleDeleteRow,
    openEditGroupModal,
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
    </Box>
  );
};

export default ScenarioDetailsPage;
