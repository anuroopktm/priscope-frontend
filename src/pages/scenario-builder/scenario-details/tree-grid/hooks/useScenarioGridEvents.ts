import { useEffect } from "react";
import { getHeaderContextMenu } from "../utils/context-menu";

interface UseScenarioGridEventsProps {
  gridId: string;
  gridData: any;
  handleDeleteRow: (id: string) => void;
  openEditGroupModal: (id: string, name: string) => void;
}

export const useScenarioGridEvents = ({
  gridId,
  gridData,
  handleDeleteRow,
  openEditGroupModal,
}: UseScenarioGridEventsProps) => {
  useEffect(() => {
    (window as any).handleTreeGridDelete = handleDeleteRow;

    (window as any).handleTreeGridEdit = (rowId: string) => {
      const currentRows = gridData?.Body?.[0] || [];
      const targetRow = currentRows.find((r: any) => r.id === rowId);
      if (targetRow) {
        openEditGroupModal(rowId, targetRow.A || "");
      }
    };

    // Header context menu handlers (placeholders)
    const assignGlobal = (name: string, logMessage: string) => {
      (window as any)[name] = (_grid: any, col: string) => {
        console.log(`Header Menu: ${logMessage}`, col);
      };
    };

    assignGlobal("handleAddColRight", "Add Column Right");
    assignGlobal("handleAddColLeft", "Add Column Left");
    assignGlobal("handleComponentAggregator", "Component Aggregator");
    assignGlobal("handleCostAggregator", "Cost Aggregator");
    assignGlobal("handleMarkupComponent", "Markup Component");
    assignGlobal("handleMarginComponent", "Margin Component");
    assignGlobal("handleGeneralFormulaComponent", "General Formula Component");
    assignGlobal("handleDeleteCol", "Delete Column");

    const onHandleRightClick = (grid: any, row: any, col: string) => {
      if (!grid || grid.id !== gridId) return 0;
      if (row.Kind === "Header") {
        const caption = grid.Header[col];
        const hasText = !!(caption && caption.trim());
        const menuItems = getHeaderContextMenu(grid, col, hasText);

        grid.ShowMenu(row, col, { Items: menuItems });
        return 1;
      }
      return 0;
    };

    if (window.TGSetEvent) {
      window.TGSetEvent("OnRightClick", gridId, onHandleRightClick);
    }

    return () => {
      delete (window as any).handleTreeGridDelete;
      delete (window as any).handleTreeGridEdit;
      delete (window as any).handleAddColRight;
      delete (window as any).handleAddColLeft;
      delete (window as any).handleComponentAggregator;
      delete (window as any).handleCostAggregator;
      delete (window as any).handleMarkupComponent;
      delete (window as any).handleMarginComponent;
      delete (window as any).handleGeneralFormulaComponent;
      delete (window as any).handleDeleteCol;

      if (window.TGDelEvent) {
        window.TGDelEvent("OnRightClick", gridId);
      }
    };
  }, [handleDeleteRow, openEditGroupModal, gridData, gridId]);
};
