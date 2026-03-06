import { useEffect } from "react";
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
  useEffect(() => {
    (window as any).handleTreeGridEdit = (rowId: string) => {
      const { setEditingGroupId, setEditingGroupName, setIsEditModalOpen } =
        useScenarioStore.getState();
      const currentRows = gridData?.Body?.[0] || [];

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

    const onHandleSelect = (grid: any) => {
      if (!grid || grid.id !== gridId) return;
      const selRows = grid.GetSelRows();
      onSelectionChange?.(selRows.length);
    };

    const onHandleEditFinish = (
      grid: any,
      row: any,
      col: string,
      _save: any,
      val: any,
    ) => {
      if (grid.id !== gridId) return val;

      // Exclude Header, Filter, Space rows
      if (
        row.Kind === "Header" ||
        row.Kind === "Filter" ||
        row.Kind === "Space"
      ) {
        return val;
      }

      // Get cell coordinates using standard DOM method on the cell element
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
      }, 100);

      return val;
    };

    const onGetHtmlValue = (grid: any, row: any, col: string, val: string) => {
      if (grid.id !== gridId) return val;
      if (row.Kind === "Header") return val;

      if (col === "is_published") {
        const isPublished = parseInt(val) === 1;
        const status = isPublished ? "published" : "draft";

        return renderStatusBadge(status);
      }
      return val;
    };

    if (window.TGSetEvent) {
      window.TGSetEvent("OnRightClick", gridId, onHandleRightClick);
      window.TGSetEvent("OnSelect", gridId, onHandleSelect);
      window.TGSetEvent("OnGetHtmlValue", gridId, onGetHtmlValue);
      window.TGSetEvent("OnAfterEdit", gridId, onHandleEditFinish);
      window.TGSetEvent("OnEndEdit", gridId, onHandleEditFinish);
    }

    return () => {
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

      if (window.TGDelEvent) {
        window.TGDelEvent("OnRightClick", gridId);
        window.TGDelEvent("OnSelect", gridId);
        window.TGDelEvent("OnGetHtmlValue", gridId);
        window.TGDelEvent("OnAfterEdit", gridId);
        window.TGDelEvent("OnEndEdit", gridId);
      }
    };
  }, [gridData, gridId, onSelectionChange]);
};
