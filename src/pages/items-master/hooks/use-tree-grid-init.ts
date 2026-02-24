import { useEffect, useRef } from "react";

/**
 * useTreeGridInit - Handles strictly the mounting, unmounting,
 * and global registry management of the TreeGrid instance.
 */
// export const useTreeGridInit = (
//   gridId: string,
//   layout: any,
//   data: any,
//   onInit?: (grid: TGrid) => void,
// ) => {
//   const gridInstance = useRef<TGrid | null>(null);

//   useEffect(() => {
//     if (!window.TreeGrid) {
//       console.error("TreeGrid is not loaded");
//       return;
//     }

//     if (window.Grids && window.Grids[gridId]) {
//       console.log(`Disposing existing grid: ${gridId}`);
//       window.Grids[gridId]?.Dispose();
//     }

//     const source = {
//       Layout: { Data: layout },
//       Data: {
//         Data: data,
//       },
//       Debug: { Check: 1 },
//     };

//     const grid = window.TreeGrid(source, gridId);
//     gridInstance.current = grid;

//     if (onInit && grid) {
//       onInit(grid);
//     }

//     return () => {
//       if (window.Grids && window.Grids[gridId]) {
//         window.Grids[gridId].Dispose();
//         gridInstance.current = null;
//       }
//     };
//   }, [gridId, layout, data]);

//   return gridInstance.current;
// };

export const useTreeGridInit = (
  gridId: string,
  containerId: any,
  layout: any,
  data: any,
  onInit?: (grid: TGrid) => void,
) => {
  const gridRef = useRef<TGrid | null>(null);
  const created = useRef(false);

  // Create grid once
  useEffect(() => {
    if (!layout || !data) return;
    if (created.current) return;
    if (!window.TreeGrid) return;

    const source = {
      id: gridId,
      Layout: { Data: layout },
      Data: { Data: data },
      Debug: { Check: 1 },
    };

    // Register events BEFORE init
    // window.TGSetEvent("OnSelected", gridId, (grid, row) => {
    //   console.log("Selected", row);
    // });

    //   window.TGSetEvent("OnPageAdded", gridId, (grid, row) => {
    //   console.log("hiiiiiii");
    // });

    const grid = window.TreeGrid(source, containerId);
    gridRef.current = grid;
    created.current = true;

    onInit?.(grid);

    return () => {
      grid?.Dispose();
      gridRef.current = null;
      created.current = false;
    };
  }, [layout]);

  // Update data WITHOUT recreating grid
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !data) return;

    grid.Source.Data.Data = data;
    grid.ReloadBody();
  }, [data]);

  return gridRef;
};
