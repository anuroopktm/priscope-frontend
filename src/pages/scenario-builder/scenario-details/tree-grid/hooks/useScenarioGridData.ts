import { useCallback, useState } from "react";

// Data types based on current structure
export interface ScenarioRow {
  id: string;
  itemId?: string;
  Def: string;
  A: string;
  B?: string;
  C?: string;
  D?: string;
  E?: string;
  is_published?: number;
  Selected?: number;
  CanSelect?: number;
  PanelSelect?: number;
  ACanEdit?: number;
  AHtmlPostfix?: string;
  Items?: ScenarioRow[];
  Expanded?: string;
}

const EDIT_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; color: #3B82F6;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
const DELETE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; color: #EF4444;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';

export const useScenarioGridData = () => {
  const [gridData, setGridData] = useState<{ Body: ScenarioRow[][] }>({
    Body: [[]],
  });

  const handleEditRowConfirm = useCallback(
    (newName: string, editingGroupId: string | null) => {
      if (editingGroupId) {
        setGridData((prev) => {
          const currentRows = prev?.Body?.[0] || [];

          // Recursive function to update row text by ID
          const updateRecursive = (rows: ScenarioRow[]): ScenarioRow[] => {
            return rows.map((row) => {
              if (row.id === editingGroupId) {
                return { ...row, A: newName };
              }
              if (row.Items) {
                return { ...row, Items: updateRecursive(row.Items) };
              }
              return row;
            });
          };

          const newRows = updateRecursive(currentRows);
          return {
            ...prev,
            Body: [[...newRows]],
          };
        });
      }
    },
    [],
  );

  const processAddItems = useCallback((items: any[], groupName?: string) => {
    // Map Item Master rows to Scenario grid format
    // New Structure: A: SKU, B: Description, C: UPC, D: Price
    const mappedItems: ScenarioRow[] = items.map((item) => {
      return {
        id: `row_${Math.random().toString(36).substr(2, 9)}`,
        itemId: item.id || "",
        Def: "R",
        A: item.SKU || item.A || "",
        B: item.Description || item.B || "",
        C: item.UPC || item.C || "",
        D: item.Price || item.D || "0",
        is_published: 0,
        Selected: 0,
        CanSelect: groupName ? 0 : 1,
        PanelSelect: groupName ? 0 : 1,
      };
    });

    setGridData((prev) => {
      const currentRows = prev?.Body?.[0] || [];
      let itemsToAdd: ScenarioRow[] = [];

      if (groupName) {
        // Create a single parent row representing the group with items as children
        const groupRowId = `group_${Math.random().toString(36).substr(2, 9)}`;
        const groupRow: ScenarioRow = {
          id: groupRowId,
          Def: "Group",
          A: groupName,
          ACanEdit: 0,
          AHtmlPostfix: `<div style="display:flex; gap:12px; float:right; margin-right:8px; align-items:center; height:100%;">
            <span style="display:flex; align-items:center; cursor:pointer;" onclick="window.handleTreeGridEdit && window.handleTreeGridEdit('${groupRowId}')">${EDIT_ICON}</span>
            <span style="display:flex; align-items:center; cursor:pointer;" onclick="window.handleTreeGridDeleteRow && window.handleTreeGridDeleteRow('${groupRowId}')">${DELETE_ICON}</span>
          </div>`,
          Items: mappedItems, // These will be children of the groupRow
          Expanded: "1",
          is_published: 0,
          Selected: 0,
          CanSelect: 1,
        };
        itemsToAdd = [groupRow];
      } else {
        // Add items individually as flat rows at the top level
        itemsToAdd = mappedItems;
      }

      return {
        ...prev,
        Body: [[...currentRows, ...itemsToAdd]],
      };
    });
  }, []);

  return {
    gridData,
    setGridData,
    handleEditRowConfirm,
    processAddItems,
  };
};
