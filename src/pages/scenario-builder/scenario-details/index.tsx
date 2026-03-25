import { useItemMasterStore } from "@/pages/items-master-refactor/store/useItemMasterStore";
import { useGetItemGroup } from "@/services/queries/common/common.queries";
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
import ActivitiesSidebar from "./components/drawers/ActivitiesSidebar";
import CommentsSidebar from "./components/drawers/CommentsSidebar";
import ScenarioDrawers from "./components/ScenarioDrawers";
import ScenarioModals from "./components/ScenarioModals";
import { useScenarioStore } from "./store/useScenarioStore";
import { ScenarioDetailsLayout } from "./tree-grid/config/details-layout";
import { axiosInstance } from "@/services/api/axiosInstance";
import { buildItemMasterTreeGridBody } from "@/pages/items-master-refactor/helper";
import type { ScenarioRow } from "./tree-grid/hooks/useScenarioGridData";
import {
  transformRows,
  useScenarioGridData,
  getUnpackedValue,
} from "./tree-grid/hooks/useScenarioGridData";
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

const syncLocalGridData = (grid: any) => {
  if (!grid) return null;

  const body: any[] = [];
  const colsData: any = {};

  // Scrape column metadata
  Object.keys(grid.Cols).forEach((colName) => {
    const col = grid.Cols[colName];
    const isExtra =
      col.IsExtraCol ||
      col.AggregatorType ||
      colName.startsWith("Comp_") ||
      colName.startsWith("Iterator_");

    const isVisible = grid.GetAttribute(null, colName, "Visible");

    if (col && isExtra && isVisible !== 0 && isVisible !== "0") {
      colsData[colName] = {
        Caption:
          grid.GetAttribute(null, colName, "Caption") ||
          grid.GetValue(grid.Header, colName) ||
          colName,
        MenuType: grid.GetAttribute(null, colName, "MenuType"),
        AggregatorType:
          grid.GetAttribute(null, colName, "AggregatorType") ||
          col.AggregatorType,
        IsExtraCol: 1,
        Format: col.Format,
        Type: col.Type,
        Pos: col.Pos,
        Sec: col.Sec,
      };
    }
  });

  // Helper to recursively scrape rows
  const processRow = (gridRow: any): any => {
    // Only capture keys that are relevant data
    const rowData: any = {
      id: gridRow.id,
      Def: gridRow.Def?.Name || gridRow.Def,
      is_published: gridRow.is_published,
      itemId: gridRow.itemId,
    };

    // Capture values for ALL defined columns
    Object.keys(grid.Cols).forEach((colName) => {
      // ONLY capture if it's a base column or a visible extra column
      const isBase = [
        "itemId",
        "SKU",
        "Description",
        "Category",
        "Shipment quantity",
        "is_published",
      ].includes(colName);
      const isExtra = !!colsData[colName];

      if (isBase || isExtra) {
        if (
          colsData[colName]?.AggregatorType === "Component" ||
          colsData[colName]?.AggregatorType === "Cost"
        ) {
          let rowComponentCols: string[] = [];
          const itemsDataStr = gridRow[colName + "ItemsData"];

          if (itemsDataStr) {
            try {
              const items = JSON.parse(itemsDataStr);
              if (Array.isArray(items)) {
                items.forEach((item) => {
                  if (
                    !item.name ||
                    item.type === "Margin" ||
                    item.type === "Markup"
                  )
                    return;
                  let itemName = String(item.name || "");
                  if (item.type === "Custom" && itemName === "Custom") {
                    itemName = "Custom Calculation";
                  }
                  const safeName = itemName
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toLowerCase();
                  if (safeName) {
                    rowComponentCols.push(`Comp_${colName}_${safeName}`);
                  }
                });
              }
            } catch (e) {
              console.error("Failed to parse ItemsData for formula");
            }
          }

          // Fallback if no ItemsData found
          if (rowComponentCols.length === 0) {
            rowComponentCols = Object.keys(grid.Cols).filter((c) => {
              const parts = c.split("_");
              return (
                parts[0] === "Comp" && parts[1] === colName && !!colsData[c]
              );
            });
          }

          if (rowComponentCols.length > 0) {
            rowData[colName + "Formula"] = rowComponentCols.join(" + ");
            rowData["Calculated"] = 1;
          }
        }

        const val = gridRow[colName];
        if (val !== undefined && val !== null && val !== "") {
          rowData[colName] = val;
        }
      }
    });

    // Handle nested items
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

  let row = grid.GetFirst();
  while (row) {
    if (row.Kind === "Data" && !row.parentNode?.id && !row.Deleted) {
      // Only process top-level rows (recursion handles children)
      body.push(processRow(row));
    }
    row = grid.GetNext(row);
  }

  return { Body: [body], ColsData: colsData };
};

const ScenarioDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: scenario } = useGetScenario(id);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const itemsInjectedRef = useRef(false);
  const setIsDrawerOpen = useScenarioStore((state) => state.setIsDrawerOpen);
  const activeCell = useScenarioStore((state) => state.activeCell);
  const isCommentsSidebarOpen = useScenarioStore(
    (state) => state.isCommentsSidebarOpen,
  );
  const isActivitiesSidebarOpen = useScenarioStore(
    (state) => state.isActivitiesSidebarOpen,
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

  const selectedItems = useItemMasterStore((state) => state.selectedItems);
  const clearSelectedItems = useItemMasterStore(
    (state) => state.clearSelectedItems,
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
  const { mutateAsync: getItemGroupAsync } = useGetItemGroup();

  const isPublishing = isFullPublishing || isPartialPublishing;
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    if (!itemsInjectedRef.current && selectedItems?.length && gridData?.Body) {
      itemsInjectedRef.current = true;
      handleProcessAddItems(selectedItems);
      clearSelectedItems();
    }
  }, [selectedItems, gridData]);

  const handleSaveAsDraft = useCallback(
    (
      dataToSave?: any,
      onSuccess?: () => void,
      onError?: (error: any) => void,
      successMessage?: string,
    ) => {
      if (!id) return;

      const grid = (window as any).Grids?.[SCENARIO_BUILDER_GRID_ID];
      grid?.EndEdit?.(1);

      const syncedData = syncLocalGridData(grid);
      const finalGridData = dataToSave || syncedData || gridData;

      console.log("Saving Final Grid Data:", finalGridData);

      saveScenarioGrid(
        { scenario_id: id, grid_data: finalGridData },
        {
          onSuccess: (response) => {
            showToast(
              successMessage ||
                response?.message ||
                "Scenario saved as draft successfully",
              "success",
            );
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            console.log(error);
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
    async (items: any[], groupName?: string, selectedHeaders?: string[]) => {
      const grid = (window as any).Grids?.[SCENARIO_BUILDER_GRID_ID];
      const syncedData = syncLocalGridData(grid) || gridData;

      if (!syncedData) return;

      // 1. Identify rows missing selected headers
      const idsToFetch: string[] = [];
      const processRowForBackfill = (row: ScenarioRow) => {
        if (row.itemId) {
          const missing =
            selectedHeaders?.some(
              (h) => row[h] === undefined || row[h] === "",
            ) ?? false;
          if (missing && !idsToFetch.includes(row.itemId)) {
            idsToFetch.push(row.itemId);
          }
        }
        if (row.Items) row.Items.forEach(processRowForBackfill);
      };
      syncedData.Body?.[0]?.forEach(processRowForBackfill);

      // 2. Fetch missing items from Item Master API
      const fetchedItemsMap: { [key: string]: any } = {};
      if (idsToFetch.length > 0) {
        try {
          const responses = await Promise.all(
            idsToFetch.map((id) =>
              axiosInstance.get(`/v1/item-master/${id}`).catch((e) => {
                console.error(`Failed to fetch item ${id}`, e);
                return null;
              }),
            ),
          );

          responses.forEach((resp) => {
            if (resp && resp.data) {
              const rawItem = resp.data;
              const body = buildItemMasterTreeGridBody([rawItem]);
              if (body.Body?.[0]?.length > 0) {
                fetchedItemsMap[rawItem.id] = body.Body[0][0];
              }
            }
          });
        } catch (e) {
          console.error("Failed to back-fill items", e);
        }
      }

      // 3. Merge fetched data into syncedData to populate missing cells
      const mergeBackfill = (row: ScenarioRow) => {
        if (row.itemId && fetchedItemsMap[row.itemId]) {
          const cleanItem = fetchedItemsMap[row.itemId];
          Object.keys(cleanItem).forEach((key) => {
            if (!["id", "Def", "is_published", "itemId"].includes(key)) {
              row[key] = getUnpackedValue(cleanItem[key]);
            }
          });
        }
        if (row.Items) row.Items.forEach(mergeBackfill);
      };
      syncedData.Body?.[0]?.forEach(mergeBackfill);

      const newState = prepareAddItems(
        syncedData,
        items,
        groupName,
        selectedHeaders,
      );

      handleSaveAsDraft(
        newState,
        () => {
          // Success: update grid and close drawer
          setGridData(newState);
          clearSelectedItems();
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
      clearSelectedItems,
    ],
  );

  const handleAddGroupItems = useCallback(
    async (groupIds: string[]) => {
      try {
        const results = await Promise.all(
          groupIds.map((id) => getItemGroupAsync(id)),
        );

        const grid = (window as any).Grids?.[SCENARIO_BUILDER_GRID_ID];
        const syncedData = syncLocalGridData(grid) || gridData;

        let newState = { ...syncedData };

        results.forEach((g: any) => {
          if (g?.items) {
            newState = prepareAddItems(newState, g.items, g.name);
          }
        });

        handleSaveAsDraft(newState, () => {
          setGridData(newState);
        });

        showToast("Groups added successfully", "success");
      } catch (error: any) {
        showToast(
          getErrorMessage(error, "Failed to fetch some group items"),
          "error",
        );
      }
    },
    [
      getItemGroupAsync,
      gridData,
      prepareAddItems,
      handleSaveAsDraft,
      setGridData,
      showToast,
    ],
  );

  useEffect(() => {
    if (scenario?.grid_data?.Body) {
      console.log("Syncing scenario grid_data from API:", scenario.grid_data);
      const rawData = scenario.grid_data;
      const isScenarioPublished = scenario.status === "published";
      const transformedBody = rawData.Body.map((rows: ScenarioRow[]) =>
        transformRows(rows, isScenarioPublished),
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

  const handleDeleteSelected = useCallback(() => {
    const grid = (window as any).Grids?.[SCENARIO_BUILDER_GRID_ID];
    if (!grid) return;

    const selRows = grid.GetSelRows();
    if (selRows.length === 0) return;

    // Collect IDs of rows to delete before removing them
    const deletedIds = new Set<string>(selRows.map((r: any) => String(r.id)));

    // Visually remove each row from the grid DOM immediately
    selRows.forEach((row: any) => {
      grid.RemoveRow(row);
    });
    grid.RenderBody();

    // Sync remaining data (deleted rows are now gone from DOM so syncLocalGridData won't include them)
    const syncedData = syncLocalGridData(grid);

    // Also remove from local React state so if the component re-renders, it won't re-add them
    setGridData((prev: any) => {
      if (!prev?.Body?.[0]) return prev;
      const filterRows = (rows: any[]): any[] =>
        rows
          .filter((r: any) => !deletedIds.has(String(r.id)))
          .map((r: any) => ({
            ...r,
            Items: r.Items ? filterRows(r.Items) : undefined,
          }));
      return { ...prev, Body: [filterRows(prev.Body[0])] };
    });

    handleSaveAsDraft(
      syncedData,
      () => {
        setSelectedRowsCount(0);
      },
      undefined,
      "Deletion successful",
    );
  }, [handleSaveAsDraft, setGridData]);

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
    status: scenario?.status,
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
          setEditingGroupName(row.SKU || "");
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
          const lowerKey = key.toLowerCase();
          const colData = gridData.ColsData || {};
          if (
            !initialColNames.includes(key) &&
            !lowerKey.endsWith("formula") &&
            !lowerKey.endsWith("calculated") &&
            !lowerKey.endsWith("itemsdata") &&
            ![
              "id",
              "itemId",
              "Def",
              "Items",
              "Expanded",
              "Selected",
              "CanSelect",
              "CanSelect",
              "PanelSelect",
              "CanEdit",
              "SKUCanEdit",
              "SKUHtmlPostfix",
              "is_published",
              "Kind",
              "Level",
              "D",
              "Color",
            ].includes(key)
          ) {
            if (
              colData[key] ||
              key.startsWith("Comp_") ||
              key.startsWith("Iterator_")
            ) {
              extraColsSet.add(key);
            }
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

    const colData = gridData.ColsData || {};

    const sortedExtraCols = Array.from(extraColsSet).sort((a, b) => {
      const dataA = colData[a];
      const dataB = colData[b];
      if (dataA && dataB) {
        if (dataA.Sec !== dataB.Sec) return dataA.Sec - dataB.Sec;
        return dataA.Pos - dataB.Pos;
      }
      return 0;
    });

    sortedExtraCols.forEach((colName) => {
      // Try to get a better caption if available (e.g. from ItemsData mapping)
      let caption = colName;
      let colConfig: any = {
        Name: colName,
        Width: "150",
        Type: "Text",
        CanSort: "0",
        IsExtraCol: 1,
      };

      if (colData[colName]) {
        if (colData[colName].Caption) {
          caption = colData[colName].Caption;
        }
        if (colData[colName].AggregatorType) {
          colConfig.AggregatorType = colData[colName].AggregatorType;
        }
        if (colData[colName].Format) {
          colConfig.Format = colData[colName].Format;
        }
        if (colData[colName].Type) {
          colConfig.Type = colData[colName].Type;
        }
        if (colData[colName].MenuType) {
          colConfig.MenuType = colData[colName].MenuType;
        }
      }

      newCols.push(colConfig);
      newHeader[colName] = caption;
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
        status={scenario?.status}
        onAddItems={() => setIsDrawerOpen(true)}
        onAddGroupItems={handleAddGroupItems}
        onSaveAsDraft={handleSaveAsDraft}
        onExport={handleExport}
        onPublish={handlePublish}
        onPartialPublish={handlePartialPublish}
        onDeleteSelected={handleDeleteSelected}
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
          <ScenarioDrawers
            gridId={SCENARIO_BUILDER_GRID_ID}
            scenarioId={id}
            onSaveAsDraft={handleSaveAsDraft}
          />
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

        {isActivitiesSidebarOpen && (
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
            <ActivitiesSidebar />
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
