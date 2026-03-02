import { useGetScenario } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import AddAsGroupModal from "./components/items-master-drawer/components/AddAsGroupModal";
import ItemsMasterDrawer from "./components/items-master-drawer/ItemsMasterDrawer";
import { ScenarioDetailsLayout } from "./tree-grid/config/details-layout";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import { ScenarioDetailsDummyData } from "./tree-grid/utils/dummy-data";

const gridId = "ScenarioGridDetails";
const gridContainerId = "TreeGrid_" + gridId;

const ScenarioDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenario } = useGetScenario(id);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [gridData, setGridData] = useState<any>(ScenarioDetailsDummyData);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [itemsToGroup, setItemsToGroup] = useState<any[]>([]);

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

  const processAddItems = (items: any[], groupName?: string) => {
    // Map Item Master rows to Scenario grid format
    const newRows = items.map((item) => {
      // Create a copy of the item and ensure it has the required "Def" property for TreeGrid
      // and map some basic fields if they exist in item master
      return {
        ...item,
        id: item.id || `new_${Math.random().toString(36).substr(2, 9)}`,
        Def: "R",
        A: groupName || item.Category || item.A || "",
        B: item.SKU || item.B || "",
        C: item.Description || item.C || "",
        D: item.UPC || item.D || "",
        E: item.Price || item.E || "0",
      };
    });

    setGridData((prev: any) => {
      const currentRows = prev?.Body?.[0] || [];
      return {
        ...prev,
        Body: [[...currentRows, ...newRows]],
      };
    });
  };

  const handleGroupConfirm = (groupName: string) => {
    processAddItems(itemsToGroup, groupName);
    setItemsToGroup([]);
    setIsGroupModalOpen(false);
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
    </Box>
  );
};

export default ScenarioDetailsPage;
