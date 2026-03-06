import { useScenarioStore } from "../store/useScenarioStore";

interface GridReference {
  gridId: string;
}

export const clearHighlights = (grid: any) => {
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

export const registerClearHighlightsGlobal = ({ gridId }: GridReference) => {
  (window as any).clearScenarioColumnHighlights = () => {
    const mainGridInstance = (window as any).Grids?.[gridId];
    if (mainGridInstance) {
      clearHighlights(mainGridInstance);
    }
  };
};

export const registerStartScenarioColumnSelection = ({
  gridId,
}: GridReference) => {
  (window as any).startScenarioColumnSelection = (
    aggRowId: string,
    aggGridId: string,
  ) => {
    const { activeCell } = useScenarioStore.getState();
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
        mainGridInstance.SetAttribute(null, col, "Background", "#FFF9C4", 1);
        mainGridInstance.SetAttribute(null, col, "Cursor", "pointer", 1);
      }
    });
    mainGridInstance.Render();

    const handleClick = (grid: any, row: any, col: string) => {
      if (row && row.Kind === "Data" && col) {
        const header = grid.GetValue(grid.Header, col);
        if (
          typeof header === "string" &&
          (header.toLowerCase().includes("price") ||
            header.toLowerCase().includes("cost"))
        ) {
          let value = grid.GetValue(row, col);

          if (typeof value === "string") {
            const cleanVal = value.replace(/[^0-9.]/g, "");
            if (cleanVal && !isNaN(parseFloat(cleanVal))) {
              value = parseFloat(cleanVal);
            }
          }

          if (value != null) {
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
            }
          }
        }
      }
      return false;
    };

    if (window.TGSetEvent) {
      window.TGSetEvent("OnClick", mainGridInstance.id, handleClick);
    }
  };
};

export const unregisterGridHighlightsGlobals = () => {
  delete (window as any).startScenarioColumnSelection;
  delete (window as any).clearScenarioColumnHighlights;
};
