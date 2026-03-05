import { useEffect } from "react";
import {
  getCellContextMenu,
  getHeaderContextMenu,
} from "../utils/context-menu";

interface UseScenarioGridEventsProps {
  gridId: string;
  gridData: any;
  openEditGroupModal: (id: string, name: string) => void;
  openComponentAggregatorModal: (col: string) => void;
  openCostAggregatorModal: (col: string) => void;
  openComponentAggregatorDrawer: (
    rowId: string,
    col: string,
    type?: string,
  ) => void;
  openDeleteModal: (rowId: string) => void;
  openMarkupComponentModal: (col: string) => void;
  openMarginComponentModal: (col: string) => void;
}

export const useScenarioGridEvents = ({
  gridId,
  gridData,
  openEditGroupModal,
  openComponentAggregatorModal,
  openCostAggregatorModal,
  openComponentAggregatorDrawer,
  openDeleteModal,
  openMarkupComponentModal,
  openMarginComponentModal,
}: UseScenarioGridEventsProps) => {
  useEffect(() => {
    (window as any).handleTreeGridEdit = (rowId: string) => {
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
        openEditGroupModal(rowId, targetRow.A || "");
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
      openComponentAggregatorModal(col);
    };
    (window as any).handleCostAggregator = (_grid: any, col: string) => {
      openCostAggregatorModal(col);
    };
    (window as any).handleMarkupComponent = (_grid: any, col: string) => {
      openMarkupComponentModal(col);
    };
    (window as any).handleMarginComponent = (_grid: any, col: string) => {
      openMarginComponentModal(col);
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
      openDeleteModal(rowId);
    };
    (window as any).handleCalculate = (
      rowId: string,
      col: string,
      type?: string,
    ) => {
      openComponentAggregatorDrawer(rowId, col, type);
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

    if (window.TGSetEvent) {
      window.TGSetEvent("OnRightClick", gridId, onHandleRightClick);
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
      }
    };
  }, [
    openEditGroupModal,
    openComponentAggregatorModal,
    openCostAggregatorModal,
    openComponentAggregatorDrawer,
    openDeleteModal,
    openMarkupComponentModal,
    openMarginComponentModal,
    gridData,
    gridId,
  ]);
};
