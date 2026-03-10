import {
  useGetScenario,
  usePartialPublishScenario,
  usePublishScenario,
  useSaveScenarioGrid,
} from "@/services/queries/scenario-builder/scenario-builder.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

declare global {
  interface Window {
    handleTreeGridDeleteRow?: (id: string) => void;
    handleTreeGridEdit?: (id: string) => void;
  }
}

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
  const setEditingGroupId = useScenarioStore(
    (state) => state.setEditingGroupId,
  );
  const setEditingGroupName = useScenarioStore(
    (state) => state.setEditingGroupName,
  );
  const setIsEditModalOpen = useScenarioStore(
    (state) => state.setIsEditModalOpen,
  );
  const setRowToDeleteId = useScenarioStore((state) => state.setRowToDeleteId);
  const setIsDeleteModalOpen = useScenarioStore(
    (state) => state.setIsDeleteModalOpen,
  );
  const {
    gridData,
    setGridData,
    handleEditRowConfirm,
    handleDeleteRow,
    prepareAddItems,
  } = useScenarioGridData();

  const { mutate: saveScenarioGrid, isPending: isSaving } =
    useSaveScenarioGrid();
  const { mutate: publishScenario, isPending: isFullPublishing } =
    usePublishScenario();
  const { mutate: partialPublishScenario, isPending: isPartialPublishing } =
    usePartialPublishScenario();

  const isPublishing = isFullPublishing || isPartialPublishing;
  const showToast = useToastStore((state) => state.showToast);

  const [selectedRowsCount, setSelectedRowsCount] = useState(0);

  const handleSaveAsDraft = useCallback(
    (
      dataToSave?: any,
      onSuccess?: () => void,
      onError?: (error: any) => void,
    ) => {
      if (!id) return;

      saveScenarioGrid(
        { scenario_id: id, grid_data: dataToSave || gridData },
        {
          onSuccess: (response) => {
            showToast(
              response?.message || "Scenario saved as draft successfully",
              "success",
            );
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            showToast(
              getErrorMessage(error, "Failed to save scenario"),
              "error",
            );
            if (onError) onError(error);
          },
        },
      );
    },
    [id, gridData, saveScenarioGrid, showToast],
  );

  const handleEditRowConfirmWrapped = useCallback(
    (newName: string, rowId: string | null) => {
      handleEditRowConfirm(newName, rowId, (newData) => {
        handleSaveAsDraft(newData);
      });
    },
    [handleEditRowConfirm, handleSaveAsDraft],
  );

  const handleDeleteRowConfirm = useCallback(
    (rowId: string) => {
      handleDeleteRow(rowId, (newData) => {
        handleSaveAsDraft(newData);
      });
    },
    [handleDeleteRow, handleSaveAsDraft],
  );

  const handleProcessAddItems = useCallback(
    (items: any[], groupName?: string, selectedHeaders?: string[]) => {
      const newState = prepareAddItems(
        gridData,
        items,
        groupName,
        selectedHeaders,
      );

      handleSaveAsDraft(
        newState,
        () => {
          // Success: update grid and close drawer
          setGridData(newState);
          setIsDrawerOpen(false);
        },
        () => {
          // Error: don't add to grid, but still close drawer according to user request
          setIsDrawerOpen(false);
        },
      );
    },
    [
      prepareAddItems,
      gridData,
      handleSaveAsDraft,
      setGridData,
      setIsDrawerOpen,
    ],
  );

  useEffect(() => {
    if (scenario?.grid_data?.Body) {
      console.log("Syncing scenario grid_data from API:", scenario.grid_data);

      const rawData = scenario.grid_data as { Body: ScenarioRow[][] };

      // Helper to recursively set CanSelect and PanelSelect
      const processRow = (row: ScenarioRow, level: number): ScenarioRow => {
        const isPublished = String(row.is_published) === "1";
        const updatedRow = {
          ...row,
          CanSelect: isPublished ? 0 : 1,
          PanelSelect: isPublished ? 0 : 1,
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

  useEffect(() => {
    window.handleTreeGridEdit = (id: string) => {
      setEditingGroupId(id);
      const grid = (window as any).Grids?.[SCENARIO_BUILDER_GRID_ID];
      if (grid) {
        const row = grid.GetRowById(id);
        if (row) {
          setEditingGroupName(row.A || "");
        }
      }
      setIsEditModalOpen(true);
    };

    window.handleTreeGridDeleteRow = (id: string) => {
      setRowToDeleteId(id);
      setIsDeleteModalOpen(true);
    };

    return () => {
      delete window.handleTreeGridEdit;
      delete window.handleTreeGridDeleteRow;
    };
  }, [
    setEditingGroupId,
    setEditingGroupName,
    setIsEditModalOpen,
    setRowToDeleteId,
    setIsDeleteModalOpen,
  ]);

  const layoutRef = useRef({
    key: "",
    layout: ScenarioDetailsLayout,
  });

  const layout = useMemo(() => {
    if (!gridData?.Body?.[0]) return ScenarioDetailsLayout;

    const initialColNames = ScenarioDetailsLayout.Cols.map((c: any) => c.Name);
    const extraColsSet = new Set<string>();

    const collectKeys = (rows: ScenarioRow[]) => {
      rows.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (
            !initialColNames.includes(key) &&
            ![
              "id",
              "itemId",
              "Def",
              "Items",
              "Expanded",
              "Selected",
              "CanSelect",
              "PanelSelect",
              "ACanEdit",
              "AHtmlPostfix",
              "is_published",
              "Kind",
              "Level",
              "D",
            ].includes(key)
          ) {
            extraColsSet.add(key);
          }
        });
        if (row.Items) collectKeys(row.Items);
      });
    };

    collectKeys(gridData.Body[0]);

    if (extraColsSet.size === 0) return ScenarioDetailsLayout;

    const extraColsKey = Array.from(extraColsSet).sort().join(",");

    if (layoutRef.current.key === extraColsKey) {
      return layoutRef.current.layout;
    }

    const statusColIndex = ScenarioDetailsLayout.Cols.findIndex(
      (c) => c.Name === "is_published",
    );
    const baseCols = [...ScenarioDetailsLayout.Cols];
    let statusCol: any = null;
    if (statusColIndex > -1) {
      statusCol = baseCols.splice(statusColIndex, 1)[0];
    }

    const newCols = [...baseCols];
    const newHeader: any = { ...ScenarioDetailsLayout.Header };

    extraColsSet.forEach((colName) => {
      newCols.push({
        Name: colName,
        RelWidth: "1",
        Type: "Text",
        CanSort: "0",
      });
      newHeader[colName] = colName;
    });

    if (statusCol) {
      newCols.push(statusCol);
    }

    const newLayout = {
      ...ScenarioDetailsLayout,
      Cols: newCols,
      Header: newHeader,
    };

    layoutRef.current = {
      key: extraColsKey,
      layout: newLayout,
    };

    return newLayout;
  }, [gridData]);

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
        processAddItems={handleProcessAddItems}
        handleEditRowConfirm={handleEditRowConfirmWrapped}
        handleDeleteRowConfirm={handleDeleteRowConfirm}
      />
      {(() => {
        // This is a trick to re-init treegrid when layout changes
        return (
          <TreeGridIniter
            gridId={SCENARIO_BUILDER_GRID_ID}
            containerId={gridContainerId}
            layout={layout}
            data={gridData}
          />
        );
      })()}
    </Box>
  );
};

// Helper component to handle TreeGrid init and updates
const TreeGridIniter = ({ gridId, containerId, layout, data }: any) => {
  useTreeGridInit(gridId, containerId, layout, data);
  return null;
};

export default ScenarioDetailsPage;
