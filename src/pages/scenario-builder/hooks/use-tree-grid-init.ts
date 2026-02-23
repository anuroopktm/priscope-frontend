import { useEffect, useRef } from "react";

/**
 * useTreeGridInit - Handles strictly the mounting, unmounting,
 * and global registry management of the TreeGrid instance.
 */
export const useTreeGridInit = (
  id: string,
  layout: any,
  data: any,
  onInit?: (grid: TGrid) => void,
) => {
  const gridInstance = useRef<TGrid | null>(null);

  useEffect(() => {
    if (!window.TreeGrid) {
      console.error("TreeGrid is not loaded");
      return;
    }

    if (window.Grids && window.Grids["ScenarioGrid"]) {
      console.log(`Disposing existing grid: ${"ScenarioGrid"}`);
      window.Grids["ScenarioGrid"]?.Dispose();
    }

    const source = {
      Layout: { Data: layout },
      Data: {
        Data:data
      },
      Debug: { Check: 0 },
    };

    const grid = window.TreeGrid(source, id);
    gridInstance.current = grid;

    if (onInit && grid) {
      onInit(grid);
    }

    return () => {
      if (window.Grids && window.Grids[id]) {
        window.Grids[id].Dispose();
        gridInstance.current = null;
      }
    };
  }, [id, layout, data]);

  return gridInstance;
};
