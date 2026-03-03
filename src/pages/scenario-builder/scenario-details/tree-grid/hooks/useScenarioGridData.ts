import { useCallback, useState } from "react";

// Data types based on current structure
export interface ScenarioRow {
  id: string;
  Def: string;
  A: string;
  B?: string;
  C?: string;
  D?: string;
  E?: string;
  Selected?: number;
  ACanEdit?: number;
  AHtmlPostfix?: string;
  Items?: ScenarioRow[];
  Expanded?: string;
}

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
    const mappedItems: ScenarioRow[] = items.map((item) => {
      return {
        id: `row_${Math.random().toString(36).substr(2, 9)}`,
        Def: "R",
        A: item.Category || item.A || "",
        B: item.SKU || item.B || "",
        C: item.Description || item.C || "",
        D: item.UPC || item.D || "",
        E: item.Price || item.E || "0",
        Selected: 0,
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
          Items: mappedItems, // These will be children of the groupRow
          Expanded: "1",
          Selected: 0,
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
    handleEditRowConfirm,
    processAddItems,
  };
};
