import {
  useGetScenario,
  usePartialPublishScenario,
  usePublishScenario,
  useSaveScenarioGrid,
} from "@/services/queries/scenario-builder/scenario-builder.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import CommentsSidebar from "./components/drawers/CommentsSidebar";
import ScenarioDrawers from "./components/ScenarioDrawers";
import ScenarioModals from "./components/ScenarioModals";
import { useScenarioStore } from "./store/useScenarioStore";
import { ScenarioDetailsLayout } from "./tree-grid/config/details-layout";
import type { ScenarioRow } from "./tree-grid/hooks/useScenarioGridData";
import { useScenarioGridData } from "./tree-grid/hooks/useScenarioGridData";
import { useScenarioGridEvents } from "./tree-grid/hooks/useScenarioGridEvents";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import {
  registerClearHighlightsGlobal,
  registerStartScenarioColumnSelection,
  unregisterGridHighlightsGlobals,
} from "./utils/gridHighlights";

export const SCENARIO_BUILDER_GRID_ID = "ScenarioGridDetails";
const gridContainerId = "TreeGrid_" + SCENARIO_BUILDER_GRID_ID;

const ScenarioDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenario } = useGetScenario(id);
  const setIsDrawerOpen = useScenarioStore((state) => state.setIsDrawerOpen);
  const activeCell = useScenarioStore((state) => state.activeCell);
  const isCommentsSidebarOpen = useScenarioStore(
    (state) => state.isCommentsSidebarOpen,
  );

  const { gridData, setGridData, handleEditRowConfirm, processAddItems } =
    useScenarioGridData();

  useEffect(() => {
    if (scenario?.grid_data?.Body) {
      console.log("Syncing scenario grid_data from API:", scenario.grid_data);

      const rawData = scenario.grid_data as { Body: ScenarioRow[][] };

      // Helper to recursively set CanSelect and PanelSelect
      const processRow = (row: ScenarioRow, level: number): ScenarioRow => {
        const updatedRow = {
          ...row,
          CanSelect: level === 0 ? 1 : 0,
          PanelSelect: level === 0 ? 1 : 0,
        };
        if (updatedRow.Items) {
          updatedRow.Items = updatedRow.Items.map((child) =>
            processRow(child, level + 1),
          );
        }
        return updatedRow;
      };

      const transformedBody = rawData.Body.map((page) =>
        page.map((row) => processRow(row, 0)),
      );

      setGridData({ ...rawData, Body: transformedBody });
    }
  }, [scenario, setGridData]);

  const { mutate: saveScenarioGrid, isPending: isSaving } =
    useSaveScenarioGrid();
  const { mutate: publishScenario, isPending: isFullPublishing } =
    usePublishScenario();
  const { mutate: partialPublishScenario, isPending: isPartialPublishing } =
    usePartialPublishScenario();

  const isPublishing = isFullPublishing || isPartialPublishing;
  const showToast = useToastStore((state) => state.showToast);

  const [selectedRowsCount, setSelectedRowsCount] = useState(0);

  const handlePublish = useCallback(() => {
    if (!id) return;
    publishScenario(id, {
      onSuccess: (response) => {
        showToast(
          response?.message || "Scenario published successfully",
          "success",
        );
      },
      onError: (error) => {
        showToast(
          getErrorMessage(error, "Failed to publish scenario"),
          "error",
        );
      },
    });
  }, [id, publishScenario, showToast]);

  const handlePartialPublish = useCallback(
    (itemIds: string[], groupIds: string[]) => {
      if (!id || (itemIds.length === 0 && groupIds.length === 0)) return;
      partialPublishScenario(
        { scenario_id: id, item_ids: itemIds, group_ids: groupIds },
        {
          onSuccess: (response) => {
            showToast(
              response?.message || "Partial publish successful",
              "success",
            );
            const grid = (window as any).Grids?.[SCENARIO_BUILDER_GRID_ID];
            if (grid) {
              grid.SelectAllRows(0);
              setSelectedRowsCount(0);
            }
          },
          onError: (error) => {
            showToast(
              getErrorMessage(error, "Failed to perform partial publish"),
              "error",
            );
          },
        },
      );
    },
    [id, partialPublishScenario, showToast],
  );

  const handleSaveAsDraft = () => {
    if (!id) return;

    saveScenarioGrid(
      { scenario_id: id, grid_data: gridData },
      {
        onSuccess: (response) => {
          showToast(
            response?.message || "Scenario saved as draft successfully",
            "success",
          );
        },
        onError: (error) => {
          showToast(getErrorMessage(error, "Failed to save scenario"), "error");
        },
      },
    );
  };

  const handleExport = (format: string) => {
    const grid = (window as any).Grids?.[SCENARIO_BUILDER_GRID_ID];
    if (grid) {
      const type = format === "excel" ? "XLSX" : "CSV";
      grid.ExportFormat = type;
      grid.ExportType = type;
      grid.ExportRows = "Visible";
      grid.ExportCols = "Visible";
      grid.ActionExport();
    }
  };

  useScenarioGridEvents({
    gridId: SCENARIO_BUILDER_GRID_ID,
    gridData,
    onSelectionChange: setSelectedRowsCount,
  });

  useEffect(() => {
    registerClearHighlightsGlobal({ gridId: SCENARIO_BUILDER_GRID_ID });
    if (activeCell) {
      registerStartScenarioColumnSelection({
        gridId: SCENARIO_BUILDER_GRID_ID,
      });
    }
    return () => {
      unregisterGridHighlightsGlobals();
    };
  }, [activeCell]);

  useTreeGridInit(
    SCENARIO_BUILDER_GRID_ID,
    gridContainerId,
    ScenarioDetailsLayout,
    gridData,
  );

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
        onSaveAsDraft={handleSaveAsDraft}
        onExport={handleExport}
        onPublish={handlePublish}
        onPartialPublish={handlePartialPublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        selectedRowsCount={selectedRowsCount}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              width: "100%",
              p: 2,
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                minWidth: 0,
                minHeight: 0,
                borderRadius: 1,
                p: 2,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                id={gridContainerId}
                sx={{
                  flex: 1,
                  minHeight: 0,
                  minWidth: 0,
                  height: "100%",
                  width: "100%",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
          <ScenarioDrawers gridId={SCENARIO_BUILDER_GRID_ID} />
        </Box>

        {isCommentsSidebarOpen && (
          <Box
            sx={{
              width: 360,
              height: "100%",
              flexShrink: 0,
              p: 2,
              pl: 0,
              transition: "width 0.3s ease-in-out",
            }}
          >
            <CommentsSidebar />
          </Box>
        )}
      </Box>
      <ScenarioModals
        gridId={SCENARIO_BUILDER_GRID_ID}
        processAddItems={processAddItems}
        handleEditRowConfirm={handleEditRowConfirm}
      />
    </Box>
  );
};

export default ScenarioDetailsPage;
