import { useEffect, useRef } from "react";
import { useScenarioStore } from "../../store/useScenarioStore";
import { renderStatusBadge } from "../cells/status-badge.cell";
import {
  getCellContextMenu,
  getHeaderContextMenu,
} from "../utils/context-menu";

interface UseScenarioGridEventsProps {
  gridId: string;
  gridData: any;
  onSelectionChange?: (count: number) => void;
}

export const useScenarioGridEvents = ({
  gridId,
  gridData,
  onSelectionChange,
}: UseScenarioGridEventsProps) => {
  const gridDataRef = useRef(gridData);

  useEffect(() => {
    gridDataRef.current = gridData;
  }, [gridData]);

  useEffect(() => {
    (window as any).handleTreeGridEdit = (rowId: string) => {
      const { setEditingGroupId, setEditingGroupName, setIsEditModalOpen } =
        useScenarioStore.getState();
      const currentRows = gridDataRef.current?.Body?.[0] || [];

      // Recursive function to find row by ID
      const findRecursive = (rows: any[]): any => {
        for (const r of rows) {
          if (r.id === rowId) return r;
          if (r.Items) {
            const found = findRecursive(r.Items);
            if (found) return found;
          }
        }
        return null;
      };

      const targetRow = findRecursive(currentRows);
      if (targetRow) {
        setEditingGroupId(rowId);
        setEditingGroupName(targetRow.A || "");
        setIsEditModalOpen(true);
      }
    };

    // Header context menu handlers
    (window as any).handleAddColRight = (grid: any, col: string) => {
      grid.AddCols(1, col, 1, 1, 1);
    };
    (window as any).handleAddColLeft = (grid: any, col: string) => {
      grid.AddCols(1, col, 0, 1, 1);
    };
    (window as any).handleComponentAggregator = (_grid: any, col: string) => {
      const { setActiveColumn, setIsComponentAggregatorOpen } =
        useScenarioStore.getState();
      setActiveColumn(col);
      setIsComponentAggregatorOpen(true);
    };
    (window as any).handleCostAggregator = (_grid: any, col: string) => {
      const { setActiveColumn, setIsCostAggregatorOpen } =
        useScenarioStore.getState();
      setActiveColumn(col);
      setIsCostAggregatorOpen(true);
    };
    (window as any).handleMarkupComponent = (_grid: any, col: string) => {
      const {
        setActiveColumn,
        setIsMarginMarkupModalOpen,
        setMarginMarkupType,
      } = useScenarioStore.getState();
      setActiveColumn(col);
      setMarginMarkupType("Markup");
      setIsMarginMarkupModalOpen(true);
    };
    (window as any).handleMarginComponent = (_grid: any, col: string) => {
      const {
        setActiveColumn,
        setIsMarginMarkupModalOpen,
        setMarginMarkupType,
      } = useScenarioStore.getState();
      setActiveColumn(col);
      setMarginMarkupType("Margin");
      setIsMarginMarkupModalOpen(true);
    };
    (window as any).handleGeneralFormulaComponent = (
      _grid: any,
      col: string,
    ) => {
      console.log(`Triggering General Formula for ${col}`);
    };
    (window as any).handleDeleteCol = (grid: any, col: string) => {
      // Hide the column itself
      grid.HideCol(col);

      // Hide all associated component columns if this was an aggregator
      Object.keys(grid.Cols).forEach((c) => {
        if (c.startsWith(`Comp_${col}_`)) {
          grid.HideCol(c);
        }
      });
    };
    (window as any).handleTreeGridDeleteRow = (rowId: string) => {
      const { setRowToDeleteId, setIsDeleteModalOpen } =
        useScenarioStore.getState();
      setRowToDeleteId(rowId);
      setIsDeleteModalOpen(true);
    };
    (window as any).handleCalculate = (
      rowId: string,
      col: string,
      type?: string,
    ) => {
      const { setActiveCell, setIsAggregatorDrawerOpen } =
        useScenarioStore.getState();
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
              console.error("Failed to parse items data", e);
            }
          }
        }
      }

      setActiveCell({
        rowId,
        col,
        items,
        type: aggregatorType,
      });
      setIsAggregatorDrawerOpen(true);
    };

    const enterPressedRef = { current: false };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        enterPressedRef.current = true;
      } else {
        enterPressedRef.current = false;
      }
    };

    // Use capture phase to ensure we catch it before TreeGrid does any magic
    document.addEventListener("keydown", handleGlobalKeyDown, true);

    const onHandleEditFinish = (
      grid: any,
      row: any,
      col: string,
      save: any,
      val: any,
    ) => {
      if (grid.id !== gridId) return val;

      // Only trigger if saved (save === 1) AND Enter was the reason
      const wasEnter = enterPressedRef.current;
      enterPressedRef.current = false; // Reset immediately

      if (save !== 1 || !wasEnter) {
        return val;
      }

      // Exclude Header, Filter, Space rows
      if (
        row.Kind === "Header" ||
        row.Kind === "Filter" ||
        row.Kind === "Space"
      ) {
        return val;
      }

      // Get cell coordinates
      const cellElement = grid.GetCell(row, col);
      if (!cellElement) {
        return val;
      }

      const rect = cellElement.getBoundingClientRect();
      const { setCommentCell, setIsCommentPopoverOpen } =
        useScenarioStore.getState();

      setCommentCell({
        rowId: row.id,
        col: col,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        } as any,
      });

      // Brief delay to ensure the grid finishes its internal state update
      setTimeout(() => {
        setIsCommentPopoverOpen(true);
      }, 150);

      return val;
    };

    (window as any).handleCommentFromMenu = (
      _grid: any,
      row: any,
      col: string,
    ) => {
      const { setCommentModalCell, setIsCommentModalOpen } =
        useScenarioStore.getState();
      setCommentModalCell({ rowId: row.id, col });
      setIsCommentModalOpen(true);
    };

    const onGetHtmlValue = (grid: any, row: any, col: string, val: string) => {
      if (!grid || grid.id !== gridId) return val;
      if (!row || row.Kind !== "Data") return val;

      if (col === "is_published") {
        // Hiding status for child rows (nested rows have Level > 0)
        // Group rows are typically Level 0 (top-level)
        if (row.Level > 0) return "";

        const isPublished = String(val) === "1";
        const status = isPublished ? "published" : "draft";

        return renderStatusBadge(status);
      }
      return val;
    };

    const onHandleRightClick = (grid: any, row: any, col: string) => {
      if (!grid || grid.id !== gridId) return 0;
      if (row.Kind === "Header") {
        const menuItems = getHeaderContextMenu(grid, col);
        grid.ShowMenu(row, col, { Items: menuItems });
        return 1;
      } else {
        // Cell context menu
        const menuItems = getCellContextMenu(grid, row, col);
        if (menuItems.length > 0) {
          grid.ShowMenu(row, col, { Items: menuItems });
          return 1;
        }
      }
      return 0;
    };

    const updateSelectionCount = (grid: any) => {
      if (!grid || grid.id !== gridId) return;
      // Small delay to let TreeGrid finish updating the internal selection state
      setTimeout(() => {
        const selRows = grid.GetSelRows();
        onSelectionChange?.(selRows.length);
      }, 50);
    };

    if (window.TGSetEvent) {
      window.TGSetEvent("OnRightClick", gridId, onHandleRightClick);
      window.TGSetEvent("OnSelect", gridId, (grid: any) =>
        updateSelectionCount(grid),
      );
      window.TGSetEvent("OnSelectAll", gridId, (grid: any) =>
        updateSelectionCount(grid),
      );
      window.TGSetEvent("OnGetHtmlValue", gridId, onGetHtmlValue);
      window.TGSetEvent("OnEndEdit", gridId, onHandleEditFinish);
    }

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown, true);

      delete (window as any).handleTreeGridEdit;
      delete (window as any).handleAddColRight;
      delete (window as any).handleAddColLeft;
      delete (window as any).handleComponentAggregator;
      delete (window as any).handleCostAggregator;
      delete (window as any).handleMarkupComponent;
      delete (window as any).handleMarginComponent;
      delete (window as any).handleGeneralFormulaComponent;
      delete (window as any).handleDeleteCol;
      delete (window as any).handleTreeGridDeleteRow;
      delete (window as any).handleCalculate;
      delete (window as any).handleCommentFromMenu;

      if (window.TGDelEvent) {
        window.TGDelEvent("OnRightClick", gridId);
        window.TGDelEvent("OnSelect", gridId);
        window.TGDelEvent("OnSelectAll", gridId);
        window.TGDelEvent("OnGetHtmlValue", gridId);
        window.TGDelEvent("OnEndEdit", gridId);
      }
    };
  }, [gridId, onSelectionChange]);
};
