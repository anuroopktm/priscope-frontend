import { useCallback, useState } from "react";

// Data types based on current structure
export interface ScenarioRow {
  id: string;
  itemId?: string;
  Def: string;
  SKU: string;
  Description?: string;
  Category?: string;
  is_published?: number;
  Selected?: number;
  CanSelect?: number;
  PanelSelect?: number;
  ACanEdit?: number;
  AHtmlPostfix?: string;
  Items?: ScenarioRow[];
  Expanded?: string;
  [key: string]: any;
}

export interface ScenarioGridType {
  Body: ScenarioRow[][];
  ColsData?: { [key: string]: any };
  [key: string]: any;
}

export const EDIT_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; color: #3B82F6;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
export const DELETE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; color: #EF4444;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';

export const transformRows = (
  rows: ScenarioRow[],
  isScenarioPublished: boolean = false,
): ScenarioRow[] => {
  return rows.map((row) => {
    const isPublished = isScenarioPublished || row.is_published === 1;
    let transformedRow: any = { ...row };

    if (isPublished) {
      transformedRow.CanEdit = 0;
      transformedRow.CanSelect = 0;
      transformedRow.PanelSelect = 0;
      transformedRow.Color = "#E8F5E9";
    }

    if (row.Def === "Group") {
      const groupRowId = row.id;
      transformedRow.SKUHtmlPostfix = isPublished
        ? ""
        : `<div style="display:flex; gap:12px; float:right; margin-right:8px; align-items:center; height:100%;">
            <span style="display:flex; align-items:center; cursor:pointer;" onclick="window.handleTreeGridEdit && window.handleTreeGridEdit('${groupRowId}')">${EDIT_ICON}</span>
            <span style="display:flex; align-items:center; cursor:pointer;" onclick="window.handleTreeGridDeleteRow && window.handleTreeGridDeleteRow('${groupRowId}')">${DELETE_ICON}</span>
          </div>`;
    }
    if (row.Items) {
      transformedRow.Items = transformRows(row.Items, isScenarioPublished);
    }
    return transformedRow;
  });
};

export const getUnpackedValue = (val: any) => {
  if (val && typeof val === "object") {
    if (!Array.isArray(val) && val.value !== undefined) return val.value;
    if (!Array.isArray(val) && val.name !== undefined) return val.name;
    if (Array.isArray(val)) {
      return val
        .map((x: any) =>
          typeof x === "object"
            ? x.name || x.value || JSON.stringify(x)
            : String(x),
        )
        .join(", ");
    }
  }
  return val;
};

export const useScenarioGridData = () => {
  const [gridData, setGridData] = useState<ScenarioGridType>({
    Body: [[]],
  });

  const handleEditRowConfirm = useCallback(
    (
      newName: string,
      editingGroupId: string | null,
      onUpdated?: (newData: any) => void,
    ) => {
      if (editingGroupId) {
        setGridData((prev) => {
          const currentRows = prev?.Body?.[0] || [];

          // Recursive function to update row text by ID
          const updateRecursive = (rows: ScenarioRow[]): ScenarioRow[] => {
            return rows.map((row) => {
              if (row.id === editingGroupId) {
                return { ...row, SKU: newName };
              }
              if (row.Items) {
                return { ...row, Items: updateRecursive(row.Items) };
              }
              return row;
            });
          };

          const newRows = updateRecursive(currentRows);
          const newState = {
            ...prev,
            Body: [[...newRows]],
          };

          if (onUpdated) {
            setTimeout(() => onUpdated(newState), 0);
          }

          return newState;
        });
      }
    },
    [],
  );

  const handleDeleteRow = useCallback(
    (rowId: string, onDeleted?: (newData: any) => void) => {
      setGridData((prev) => {
        const currentRows = prev?.Body?.[0] || [];

        const deleteRecursive = (rows: ScenarioRow[]): ScenarioRow[] => {
          return rows
            .filter((row) => row.id !== rowId)
            .map((row) => {
              if (row.Items) {
                return { ...row, Items: deleteRecursive(row.Items) };
              }
              return row;
            });
        };

        const newRows = deleteRecursive(currentRows);
        const newState = {
          ...prev,
          Body: [[...newRows]],
        };

        if (onDeleted) {
          setTimeout(() => onDeleted(newState), 0);
        }

        return newState;
      });
    },
    [],
  );

  const cleanTreeGridRow = (row: any) => {
    const removeKeys = [
      "tagName",
      "nodeName",
      "_DefaultSort",
      "Expanded",
      "Kind",
      "Visible",
      "Calculated",
      "Level",
      "yF",
      "wA",
      "State",
      "Selected",
      "iTB",
      "tenant_id",
      "updated_at",
      "upload_id",
      "channel",
      "created_at",
    ];

    return Object.fromEntries(
      Object.entries(row).filter(([key]) => !removeKeys.includes(key)),
    );
  };

  const prepareAddItems = useCallback(
    (
      prevData: { Body: ScenarioRow[][] },
      items: any[],
      groupName?: string,
      selectedHeaders?: string[],
    ) => {
      console.log("selectedHeaders:", selectedHeaders);

      // getUnpackedValue is now helper on top of file

      const mappedItems: ScenarioRow[] = items.map((item) => {
        let cleanItem: any;

        cleanItem = cleanTreeGridRow(item);

        const scenarioRow: any = {
          id: `row_${Math.random().toString(36).substr(2, 9)}`,
          itemId: cleanItem.id || "",
          Def: "R",
          SKU: getUnpackedValue(cleanItem.SKU || ""),
          Description: getUnpackedValue(cleanItem.Description || ""),
          Category: getUnpackedValue(cleanItem.Category || ""),
          "Shipment quantity": getUnpackedValue(
            cleanItem["Shipment quantity"] || "",
          ),
          is_published: 0,
          Selected: 0,
          CanSelect: 1,
          PanelSelect: 1,
        };

        // Copy ALL columns from cleanItem
        Object.keys(cleanItem).forEach((key) => {
          if (
            [
              "id",
              "SKU",
              "Description",
              "Category",
              "Shipment quantity",
            ].includes(key)
          )
            return;

          let val = cleanItem[key];
          if (val && typeof val === "object") {
            if (!Array.isArray(val) && val.value !== undefined) {
              val = val.value;
            } else if (!Array.isArray(val) && val.name !== undefined) {
              val = val.name;
            } else if (Array.isArray(val)) {
              val = val
                .map((x: any) =>
                  typeof x === "object"
                    ? x.name || x.value || JSON.stringify(x)
                    : String(x),
                )
                .join(", ");
            }
          }
          scenarioRow[key] = val;
        });

        // If specific headers were selected, we ensure they are present,
        // though spreading ...item already covers most cases.
        // if (selectedHeaders && selectedHeaders.length > 0) {
        //   selectedHeaders.forEach((headerName) => {
        //     if (
        //       cleanItem[headerName] !== undefined &&
        //       !["SKU", "Description", "Category", "A", "B", "C"].includes(
        //         headerName,
        //       )
        //     ) {
        //       scenarioRow[headerName] = cleanItem[headerName];
        //     }
        //   });
        // }
        console.log("SCENARIO ROW", scenarioRow);
        return scenarioRow as ScenarioRow;
      });

      const currentRows = prevData?.Body?.[0] || [];
      const colsData = { ...((prevData as any).ColsData || {}) };

      if (selectedHeaders && selectedHeaders.length > 0) {
        selectedHeaders.forEach((headerName) => {
          if (
            !["SKU", "Description", "Category", "Shipment quantity"].includes(
              headerName,
            )
          ) {
            if (!colsData[headerName]) {
              colsData[headerName] = {
                Caption: headerName,
                MenuType: "Data",
                IsExtraCol: 1,
              };
            } else {
              colsData[headerName].MenuType = "Data";
            }
          }
        });
      }

      let itemsToAdd: ScenarioRow[] = [];

      if (groupName) {
        const groupRowId = `group_${Math.random().toString(36).substr(2, 9)}`;
        const groupRow: ScenarioRow = {
          id: groupRowId,
          Def: "Group",
          SKU: groupName,
          SKUCanEdit: 0,
          SKUHtmlPostfix: `<div style="display:flex; gap:12px; float:right; margin-right:8px; align-items:center; height:100%;">
            <span style="display:flex; align-items:center; cursor:pointer;" onclick="window.handleTreeGridEdit && window.handleTreeGridEdit('${groupRowId}')">${EDIT_ICON}</span>
            <span style="display:flex; align-items:center; cursor:pointer;" onclick="window.handleTreeGridDeleteRow && window.handleTreeGridDeleteRow('${groupRowId}')">${DELETE_ICON}</span>
          </div>`,
          Items: mappedItems,
          Expanded: "1",
          is_published: 0,
          Selected: 0,
          CanSelect: 1,
          PanelSelect: 1,
        };
        itemsToAdd = [groupRow];
      } else {
        itemsToAdd = mappedItems;
      }

      return {
        ...prevData,
        Body: [[...currentRows, ...itemsToAdd]],
        ColsData: colsData,
      };
    },
    [],
  );

  const processAddItems = useCallback(
    (
      items: any[],
      groupName?: string,
      selectedHeaders?: string[],
      onAdded?: (newData: any) => void,
    ) => {
      setGridData((prev) => {
        const newState = prepareAddItems(
          prev,
          items,
          groupName,
          selectedHeaders,
        );

        if (onAdded) {
          setTimeout(() => onAdded(newState), 0);
        }

        return newState;
      });
    },
    [prepareAddItems],
  );

  return {
    gridData,
    setGridData,
    handleEditRowConfirm,
    handleDeleteRow,
    processAddItems,
    prepareAddItems,
  };
};
