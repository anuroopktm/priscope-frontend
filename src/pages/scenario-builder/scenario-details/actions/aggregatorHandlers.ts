import { useScenarioStore } from "../store/useScenarioStore";

interface GridReference {
  gridId: string;
}

export const handleComponentAggregatorConfirm = (
  // ... (omitted for brevity in instruction, but I'll write the full replacement below)
  { gridId }: GridReference,
  data: {
    label: string;
    systemField: string;
    setEntireColumn: boolean;
  },
) => {
  const { activeColumn, setIsComponentAggregatorOpen, setActiveColumn } =
    useScenarioStore.getState();
  const grid = (window as any).Grids?.[gridId];

  if (grid && activeColumn) {
    const colName = activeColumn;
    const headerRow = grid.Header || grid.GetRowById("Header");

    if (headerRow) {
      grid.SetValue(headerRow, colName, data.label, 1);
    } else {
      let row = grid.GetFirst();
      while (row) {
        if (row.Kind === "Header") {
          grid.SetValue(row, colName, data.label, 1);
          break;
        }
        row = grid.GetNext(row);
      }
    }

    grid.SetAttribute(null, colName, "AggregatorType", "Component", 1);
    grid.SetAttribute(null, colName, "MenuType", "Aggregator", 1);

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
  setIsComponentAggregatorOpen(false);
  setActiveColumn(null);
};

export const handleCostAggregatorConfirm = (
  { gridId }: GridReference,
  data: {
    label: string;
    systemField: string;
    setEntireColumn: boolean;
  },
) => {
  const { activeColumn, setIsCostAggregatorOpen, setActiveColumn } =
    useScenarioStore.getState();
  const grid = (window as any).Grids?.[gridId];

  if (grid && activeColumn) {
    const colName = activeColumn;
    const headerRow = grid.Header || grid.GetRowById("Header");

    if (headerRow) {
      grid.SetValue(headerRow, colName, data.label, 1);
    } else {
      let row = grid.GetFirst();
      while (row) {
        if (row.Kind === "Header") {
          grid.SetValue(row, colName, data.label, 1);
          break;
        }
        row = grid.GetNext(row);
      }
    }

    grid.SetAttribute(null, colName, "AggregatorType", "Cost", 1);
    grid.SetAttribute(null, colName, "MenuType", "Aggregator", 1);

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

export const handleMarginMarkupConfirm = (
  { gridId }: GridReference,
  data: {
    label: string;
    mapping: string;
    entireColumn: boolean;
  },
) => {
  const {
    activeColumn,
    marginMarkupType,
    setIsMarginMarkupModalOpen,
    setActiveColumn,
  } = useScenarioStore.getState();
  const grid = (window as any).Grids?.[gridId];

  if (grid && activeColumn) {
    const colName = activeColumn;
    const headerRow = grid.Header || grid.GetRowById("Header");

    if (headerRow) {
      grid.SetValue(headerRow, colName, data.label, 1);
    } else {
      let row = grid.GetFirst();
      while (row) {
        if (row.Kind === "Header") {
          grid.SetValue(row, colName, data.label, 1);
          break;
        }
        row = grid.GetNext(row);
      }
    }

    grid.SetAttribute(null, colName, "AggregatorType", marginMarkupType, 1);
    grid.SetAttribute(null, colName, "MenuType", "Aggregator", 1);

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
  setIsMarginMarkupModalOpen(false);
  setActiveColumn(null);
};

export const handleAggregatorUpdate = (
  { gridId }: GridReference,
  items: any[],
) => {
  const { activeCell, setIsAggregatorDrawerOpen, setActiveCell } =
    useScenarioStore.getState();
  const grid = (window as any).Grids?.[gridId];

  if (grid && activeCell) {
    const row = grid.GetRowById(activeCell.rowId);
    if (row) {
      const colsData = { ...(grid.ColsData || {}) };

      const totalAmount = (Array.isArray(items) ? items : []).reduce(
        (acc, item) => {
          const cost =
            typeof item?.cost === "object" ? 0 : Number(item?.cost) || 0;
          return acc + cost;
        },
        0,
      );
      const targetCol = activeCell.col;
      const targetObj = grid.Cols[targetCol];
      const targetSec = targetObj?.Sec ?? 1;
      const targetPos = targetObj?.Pos ?? 100;

      Object.keys(grid.Cols).forEach((c) => {
        if (c.startsWith(`Comp_${targetCol}_`)) {
          grid.SetValue(row, c, null, 1);
        }
      });

      grid.Update();

      (Array.isArray(items) ? items : []).forEach((item, index) => {
        if (!item || !item.name) return;
        if (item.type === "Margin" || item.type === "Markup") return;

        let itemName = String(item.name || "");
        if (item.type === "Custom" && itemName === "Custom") {
          itemName = "Custom Calculation";
        }
        const cleanName = itemName.trim();
        const safeName = cleanName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const colId = `Comp_${targetCol}_${safeName || "Item"}`;
        const insertPos = targetPos + index;

        if (!grid.Cols[colId]) {
          grid.AddCol(colId, targetSec, insertPos, 130, 1, "Float", cleanName);
          grid.MoveCol(colId, targetCol, 0, 1);
        } else {
          grid.ShowCol(colId);
        }

        grid.SetAttribute(null, colId, "Caption", cleanName, 1);
        grid.SetAttribute(null, colId, "Visible", 1, 1);
        grid.SetAttribute(null, colId, "CanShow", 1, 1);
        grid.SetAttribute(null, colId, "CanMove", 1, 1);
        grid.SetAttribute(null, colId, "Type", "Float", 1);
        grid.SetAttribute(null, colId, "Format", "$0.00", 1);
        grid.SetAttribute(null, colId, "Width", 130, 1);
        grid.SetAttribute(null, colId, "RelWidth", 0, 1); // Set to 0 to prevent shrinking and enable overflow
        grid.SetAttribute(null, colId, "MinWidth", 100, 1);
        grid.SetAttribute(null, colId, "CanResize", 1, 1);
        grid.SetAttribute(null, colId, "CanEdit", 1, 1);
        grid.SetAttribute(null, colId, "CanEmpty", 1, 1);
        grid.SetAttribute(null, colId, "IsExtraCol", 1, 1);
        grid.SetAttribute(null, colId, "MenuType", "Data", 1);

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
        const val = parseFloat(rawVal as any);
        const roundedVal = isNaN(val) ? null : Math.round(val * 100) / 100;
        grid.SetValue(row, colId, roundedVal, 1);

        // Store column metadata for persistence
        colsData[colId] = {
          Caption: cleanName,
          MenuType: "Data",
          IsExtraCol: 1,
        };
      });

      const total = parseFloat(totalAmount as any);
      const roundedTotal = isNaN(total) ? 0 : Math.round(total * 100) / 100;

      grid.SetAttribute(null, targetCol, "Type", "Float", 1);
      grid.SetAttribute(null, targetCol, "Format", "$0.00", 1);

      grid.SetValue(row, targetCol, roundedTotal, 1);

      grid.SetAttribute(row, targetCol, "ItemsData", JSON.stringify(items), 1);

      // Save the updated column metadata to the grid
      grid.ColsData = colsData;

      grid.Update();
      grid.Render();
    }
  }
  setIsAggregatorDrawerOpen(false);
  setActiveCell(null);
};
