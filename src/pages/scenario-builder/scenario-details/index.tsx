import { useGetScenario } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import ComponentAggregatorDrawer from "./components/drawers/ComponentAggregatorDrawer";
import CostAggregatorDrawer from "./components/drawers/CostAggregatorDrawer";
import MarginMarkupDrawer from "./components/drawers/MarginMarkupDrawer";
import AddAsGroupModal from "./components/items-master-drawer/components/AddAsGroupModal";
import ItemsMasterDrawer from "./components/items-master-drawer/ItemsMasterDrawer";
import ComponentAggregatorModal from "./components/modals/ComponentAggregatorModal";
import CostAggregatorModal from "./components/modals/CostAggregatorModal";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import MarginMarkupModal from "./components/modals/MarginMarkupModal";
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
  const [isCostAggregatorOpen, setIsCostAggregatorOpen] =
    useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  // Aggregator Drawer state
  const [isAggregatorDrawerOpen, setIsAggregatorDrawerOpen] =
    useState<boolean>(false);
  const [activeCell, setActiveCell] = useState<{
    rowId: string;
    col: string;
    items?: any[];
    type?: string;
  } | null>(null);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [rowToDeleteId, setRowToDeleteId] = useState<string | null>(null);

  // Margin/Markup state
  const [isMarginMarkupModalOpen, setIsMarginMarkupModalOpen] = useState(false);
  const [marginMarkupType, setMarginMarkupType] = useState<"Margin" | "Markup">(
    "Margin",
  );

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
  const openCostAggregatorModal = (col: string) => {
    setActiveColumn(col);
    setIsCostAggregatorOpen(true);
  };

  const openComponentAggregatorDrawer = (
    rowId: string,
    col: string,
    type?: string,
  ) => {
    const grid = (window as any).Grids?.[gridId];
    let items: any[] = [];
    let aggregatorType = type || "Component";

    if (grid) {
      if (!type) {
        aggregatorType =
          grid.GetAttribute(null, col, "AggregatorType") || "Component";
      }
      const row = grid.GetRowById(rowId);
      if (row) {
        const itemsData = grid.GetAttribute(row, col, "ItemsData");
        if (itemsData) {
          try {
            items = JSON.parse(itemsData);
          } catch (e) {
            console.error("Error parsing ItemsData:", e);
          }
        }
      }
    }
    setActiveCell({ rowId, col, items, type: aggregatorType });
    setIsAggregatorDrawerOpen(true);
  };

  const openDeleteModal = (rowId: string) => {
    setRowToDeleteId(rowId);
    setIsDeleteModalOpen(true);
  };

  const openMarkupComponentModal = (col: string) => {
    setActiveColumn(col);
    setMarginMarkupType("Markup");
    setIsMarginMarkupModalOpen(true);
  };

  const openMarginComponentModal = (col: string) => {
    setActiveColumn(col);
    setMarginMarkupType("Margin");
    setIsMarginMarkupModalOpen(true);
  };

  const handleMarginMarkupConfirm = (data: {
    label: string;
    mapping: string;
    entireColumn: boolean;
  }) => {
    const grid = (window as any).Grids?.[gridId];
    if (grid && activeColumn) {
      const colName = activeColumn;
      const fullLabel = `${data.label} (${marginMarkupType} iterator)`;
      const headerRow = grid.Header || grid.GetRowById("Header");
      if (headerRow) {
        grid.SetValue(headerRow, colName, fullLabel, 1);
      }
      grid.SetAttribute(null, colName, "AggregatorType", marginMarkupType, 1);
      grid.SetAttribute(null, colName, "Mapping", data.mapping, 1);
      grid.SetAttribute(
        null,
        colName,
        "EntireColumn",
        data.entireColumn ? 1 : 0,
        1,
      );

      setTimeout(() => {
        grid.SetAttribute(null, colName, "RelWidth", 0, 1);
        grid.SetAttribute(null, colName, "Width", null, 1);
        if (grid.AutoFitCol) {
          grid.AutoFitCol(colName);
        } else {
          grid.SetWidth(colName, -1);
        }
        grid.Update();
        grid.Render();
      }, 10);

      grid.Update();
    }
  };

  const isGroupToDelete = rowToDeleteId?.startsWith("group_");

  useScenarioGridEvents({
    gridId,
    gridData,
    openEditGroupModal,
    openComponentAggregatorModal,
    openCostAggregatorModal,
    openComponentAggregatorDrawer,
    openDeleteModal,
    openMarkupComponentModal,
    openMarginComponentModal,
  });

  // Handle Scenario Column Selection for Tariff
  useEffect(() => {
    const clearHighlights = (grid: any) => {
      if (!grid) return;
      Object.keys(grid.Cols).forEach((c) => {
        grid.SetAttribute(null, c, "Background", "", 1);
        grid.SetAttribute(null, c, "Cursor", "", 1);
      });
      grid.Render();

      if (window.TGDelEvent) {
        window.TGDelEvent("OnClick", grid.id);
      }
    };

    (window as any).startScenarioColumnSelection = (
      aggRowId: string,
      aggGridId: string,
    ) => {
      const mainGridInstance = (window as any).Grids?.[gridId];
      if (!mainGridInstance || !activeCell) return;

      // Highlight logic
      Object.keys(mainGridInstance.Cols).forEach((col) => {
        const header = mainGridInstance.GetValue(mainGridInstance.Header, col);
        if (
          typeof header === "string" &&
          (header.toLowerCase().includes("price") ||
            header.toLowerCase().includes("cost"))
        ) {
          mainGridInstance.SetAttribute(null, col, "Background", "#FFF9C4", 1); // Light yellow highlight
          mainGridInstance.SetAttribute(null, col, "Cursor", "pointer", 1);
        }
      });
      mainGridInstance.Render();

      // Temporarily register OnClick to catch the selection
      const handleClick = (grid: any, row: any, col: string) => {
        console.log("ScenarioColumnSelection clicked:", {
          rowId: row?.id,
          col,
          rowKind: row?.Kind,
        });
        if (row && row.Kind === "Data" && col) {
          const header = grid.GetValue(grid.Header, col);
          console.log("Column header:", header);
          if (
            typeof header === "string" &&
            (header.toLowerCase().includes("price") ||
              header.toLowerCase().includes("cost"))
          ) {
            // Selected this column!
            // Retrieve value safely
            let value = grid.GetValue(row, col);
            console.log("Raw cell value:", value);

            // If it's a string, try to strip currency symbols for calculation
            if (typeof value === "string") {
              const cleanVal = value.replace(/[^0-9.]/g, "");
              if (cleanVal && !isNaN(parseFloat(cleanVal))) {
                value = parseFloat(cleanVal);
              }
            }

            console.log("Cleaned cell value:", value);

            if (value != null) {
              console.log("Triggering finishScenarioColumnSelection");
              if ((window as any).finishScenarioColumnSelection) {
                (window as any).finishScenarioColumnSelection(
                  header,
                  col,
                  aggRowId,
                  aggGridId,
                  value,
                );

                clearHighlights(grid);
                return true;
              } else {
                console.error("finishScenarioColumnSelection not found!");
              }
            }
          }
        }
        return false;
      };

      // Use TGSetEvent to safely overwrite the OnClick handler
      console.log("Registering OnClick for grid:", mainGridInstance.id);
      if (window.TGSetEvent) {
        window.TGSetEvent("OnClick", mainGridInstance.id, handleClick);
      }
    };

    // Expose clearHighlights globally so it can be called from the drawer
    (window as any).clearScenarioColumnHighlights = () => {
      const mainGridInstance = (window as any).Grids?.[gridId];
      if (mainGridInstance) {
        clearHighlights(mainGridInstance);
      }
    };

    return () => {
      delete (window as any).startScenarioColumnSelection;
      delete (window as any).clearScenarioColumnHighlights;
    };
  }, [activeCell]);

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
      const fullLabel = `${data.label} (Component iterator)`;
      // Most TreeGrid versions have 'Header' as the main header row object
      const headerRow = grid.Header || grid.GetRowById("Header");
      if (headerRow) {
        grid.SetValue(headerRow, colName, fullLabel, 1);
      } else {
        // Fallback: search for row with Kind="Header"
        let row = grid.GetFirst();
        while (row) {
          if (row.Kind === "Header") {
            grid.SetValue(row, colName, fullLabel, 1);
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

  const handleCostAggregatorConfirm = (data: {
    label: string;
    systemField: string;
    setEntireColumn: boolean;
  }) => {
    const grid = (window as any).Grids?.[gridId];
    if (grid && activeColumn) {
      const colName = activeColumn;
      const fullLabel = `${data.label} (Cost iterator)`;
      const headerRow = grid.Header || grid.GetRowById("Header");
      if (headerRow) {
        grid.SetValue(headerRow, colName, fullLabel, 1);
      } else {
        let row = grid.GetFirst();
        while (row) {
          if (row.Kind === "Header") {
            grid.SetValue(row, colName, fullLabel, 1);
            break;
          }
          row = grid.GetNext(row);
        }
      }

      // Mark the column as a Cost aggregator column
      grid.SetAttribute(null, colName, "AggregatorType", "Cost", 1);

      setTimeout(() => {
        grid.SetAttribute(null, colName, "RelWidth", 0, 1);
        grid.SetAttribute(null, colName, "Width", null, 1);

        if (grid.AutoFitCol) {
          grid.AutoFitCol(colName);
        } else {
          grid.SetWidth(colName, -1);
        }

        grid.Update();
        grid.Render();
      }, 10);
    }
    setIsCostAggregatorOpen(false);
    setActiveColumn(null);
  };

  const handleAggregatorUpdate = (items: any[]) => {
    const grid = (window as any).Grids?.[gridId];
    if (grid && activeCell) {
      const row = grid.GetRowById(activeCell.rowId);
      if (row) {
        // Calculate total cost for the trigger cell (Sum of Cost column)
        const totalAmount = (Array.isArray(items) ? items : []).reduce(
          (acc, item) => {
            const cost =
              typeof item?.cost === "object" ? 0 : Number(item?.cost) || 0;
            return acc + cost;
          },
          0,
        );
        // Log target info
        const targetCol = activeCell.col;
        const targetObj = grid.Cols[targetCol];
        // TreeGrid requires numeric Section (0=left, 1=mid, 2=right) and Position
        const targetSec = targetObj?.Sec ?? 1;
        const targetPos = targetObj?.Pos ?? 100;

        // --- PRE-SYNC CLEANUP ---
        // Delete existing columns so they don't persist when naming changes (e.g. from "Tariff" to "Tariff 1")
        Object.keys(grid.Cols).forEach((c) => {
          if (c.startsWith(`Comp_${targetCol}_`)) {
            grid.DelCol(c);
          }
        });

        grid.Update();

        // Process each item to create/populate columns to the left
        (Array.isArray(items) ? items : []).forEach((item, index) => {
          if (!item || !item.name) return;

          // If type is Custom, Margin or Markup, skip column creation in top panel
          if (
            item.type === "Custom" ||
            item.type === "Margin" ||
            item.type === "Markup"
          )
            return;

          const itemName = String(item.name || "");
          const cleanName = itemName.trim();
          const safeName = cleanName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          const colId = `Comp_${targetCol}_${safeName || "Item"}`;

          const insertPos = targetPos + index;

          if (!grid.Cols[colId]) {
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

          grid.SetAttribute(null, colId, "Caption", cleanName, 1);
          grid.SetAttribute(null, colId, "Visible", 1, 1);
          grid.SetAttribute(null, colId, "CanShow", 1, 1);
          grid.SetAttribute(null, colId, "CanMove", 1, 1);
          grid.SetAttribute(null, colId, "Type", "Float", 1);
          grid.SetAttribute(null, colId, "Format", "$0.00", 1);
          grid.SetAttribute(null, colId, "Width", 110, 1);
          grid.SetAttribute(null, colId, "CanEdit", 1, 1);

          grid.MoveCol(colId, targetCol, 0, 1);

          const headerRow = grid.Header || grid.GetRowById("Header");
          if (headerRow) {
            grid.SetValue(headerRow, colId, cleanName, 1);
          }

          const itemCostPerUnit =
            typeof item.costPerUnit === "object" ? 0 : item.costPerUnit;
          const rawVal =
            typeof itemCostPerUnit === "string"
              ? itemCostPerUnit.replace(/[^0-9.]/g, "")
              : itemCostPerUnit;
          const val = parseFloat(rawVal as any) || 0;

          grid.SetValue(row, colId, val, 1);
        });

        const total = parseFloat(totalAmount as any) || 0;

        grid.SetAttribute(null, targetCol, "Type", "Float", 1);
        grid.SetAttribute(null, targetCol, "Format", "$0.00", 1);

        grid.SetValue(row, targetCol, total, 1);

        grid.SetAttribute(
          row,
          targetCol,
          "ItemsData",
          JSON.stringify(items),
          1,
        );

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
        {isAggregatorDrawerOpen && activeCell && (
          <Box
            sx={{
              flex: 0.5,
              minHeight: 0,
              width: "100%",
              px: 2,
              transition: "flex 0.3s ease-in-out",
            }}
          >
            {activeCell.type === "Cost" ? (
              <CostAggregatorDrawer
                initialItems={activeCell.items}
                mainRowId={activeCell.rowId}
                onClose={() => {
                  setIsAggregatorDrawerOpen(false);
                  setActiveCell(null);
                }}
                onUpdate={handleAggregatorUpdate}
              />
            ) : activeCell.type === "Margin" || activeCell.type === "Markup" ? (
              <MarginMarkupDrawer
                type={activeCell.type as "Margin" | "Markup"}
                initialItems={activeCell.items}
                mainRowId={activeCell.rowId}
                onClose={() => {
                  setIsAggregatorDrawerOpen(false);
                  setActiveCell(null);
                }}
                onUpdate={handleAggregatorUpdate}
              />
            ) : (
              <ComponentAggregatorDrawer
                initialItems={activeCell.items}
                onClose={() => {
                  setIsAggregatorDrawerOpen(false);
                  setActiveCell(null);
                }}
                onUpdate={handleAggregatorUpdate}
              />
            )}
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
      <CostAggregatorModal
        open={isCostAggregatorOpen}
        onClose={() => setIsCostAggregatorOpen(false)}
        onConfirm={handleCostAggregatorConfirm}
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

      <MarginMarkupModal
        open={isMarginMarkupModalOpen}
        onClose={() => setIsMarginMarkupModalOpen(false)}
        onConfirm={handleMarginMarkupConfirm}
        type={marginMarkupType}
      />
    </Box>
  );
};

export default ScenarioDetailsPage;
