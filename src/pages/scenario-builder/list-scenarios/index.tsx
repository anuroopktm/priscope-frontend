import {
  useDeleteScenario,
  useListScenarios,
} from "@/services/queries/scenario-builder/scenario-builder.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { ScenarioGridLayout } from "./tree-grid/config/layout";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import { mapScenariosToGridBody } from "./tree-grid/utils/data-mapper";

declare global {
  interface Window {
    handleTreeGridDelete?: (id: string) => void;
    handleTreeGridEdit?: (id: string) => void;
  }
}

const gridId = "ScenarioGrid";
const gridContainerId = "TreeGrid_" + gridId;

const ScenarioListingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedForFork, setSelectedForFork] = useState<string | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  const { data: scenariosData } = useListScenarios({
    search: searchTerm,
    filter: {},
    page_size: 20,
    skip: 0,
  });

  const { mutate: deleteScenario, isPending: isDeleting } = useDeleteScenario();

  const handleGridInit = (grid: any) => {
    if (window.TGSetEvent) {
      window.TGSetEvent(
        "OnSelect",
        gridId,
        (grid: any, row: any, deselect: boolean) => {
          if (deselect) {
            setSelectedForFork(null);
          } else {
            setSelectedForFork(row.id);
          }
        },
      );
    }
  };

  useEffect(() => {
    window.handleTreeGridDelete = (id: string) => {
      setSelectedRowId(id);
      setDeleteModalOpen(true);
    };

    window.handleTreeGridEdit = (id: string) => {
      navigate(`/scenario-builder/details/${id}`);
    };

    return () => {
      delete window.handleTreeGridDelete;
      delete window.handleTreeGridEdit;
      if (window.TGDelEvent) {
        window.TGDelEvent("OnSelect", gridId);
      }
    };
  }, [navigate]);

  const gridData = useMemo(() => {
    if (!scenariosData) return null;
    return mapScenariosToGridBody(scenariosData?.scenarios);
  }, [scenariosData]);

  useTreeGridInit(
    gridId,
    gridContainerId,
    ScenarioGridLayout,
    gridData,
    handleGridInit,
  );

  const handleDeleteConfirm = () => {
    if (!selectedRowId) return;

    deleteScenario(selectedRowId, {
      onSuccess: () => {
        showToast("Scenario deleted successfully", "success");
        setDeleteModalOpen(false);
        setSelectedRowId(null);
      },
      onError: (error) => {
        showToast(getErrorMessage(error, "Failed to delete scenario"), "error");
      },
    });
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
        <ActionHeader
          onSearch={setSearchTerm}
          selectedScenarioId={selectedForFork}
        />

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
        isLoading={isDeleting}
      />
    </>
  );
};

export default ScenarioListingPage;
