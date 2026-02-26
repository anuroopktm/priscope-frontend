import { useListScenarios } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ActionHeader } from "./components/ActionHeader";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { ScenarioGridLayout } from "./tree-grid/config/layout";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import { mapScenariosToGridBody } from "./tree-grid/utils/data-mapper";

// Extend Window interface for the global handler
declare global {
  interface Window {
    handleTreeGridDelete?: (id: string) => void;
  }
}

const gridId = "ScenarioGrid";
const gridContainerId = "TreeGrid_" + gridId;

const ScenarioBuilderPage = () => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const { data: scenariosData, refetch } = useListScenarios({
    search: searchTerm,
    filter: {},
    page_size: 20,
    skip: 0,
  });

  // Global handler for TreeGrid delete action
  useEffect(() => {
    window.handleTreeGridDelete = (id: string) => {
      setSelectedRowId(id);
      setDeleteModalOpen(true);
    };

    return () => {
      delete window.handleTreeGridDelete;
    };
  }, []);

  const gridData = useMemo(() => {
    if (!scenariosData) return null;
    return mapScenariosToGridBody(scenariosData?.scenarios);
  }, [scenariosData]);

  const gridRef = useTreeGridInit(
    gridId,
    gridContainerId,
    ScenarioGridLayout,
    gridData,
  );

  const handleDeleteConfirm = () => {
    console.log("Confirm Delete:", selectedRowId);
    // TODO: Add actual delete API call here
    // Example: mutation.mutate(selectedRowId);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          bgcolor: "brand.background",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <ActionHeader onSearch={setSearchTerm} />

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
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
      </Box>
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default ScenarioBuilderPage;
