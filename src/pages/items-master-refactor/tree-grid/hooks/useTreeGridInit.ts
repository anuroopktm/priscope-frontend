import { useEffect, useRef } from "react";
import { useItemMasterStore } from "../../store/useItemMasterStore";

/**
 * useTreeGridInit - Handles strictly the mounting, unmounting,
 * and global registry management of the TreeGrid instance.
 */
// export const useTreeGridInit = (
//   gridId: string,
//   containerId: string,
//   layout: any,
//   data: any,
//   onInit?: (grid: TGrid) => void,
// ) => {
//   const gridRef = useRef<TGrid | null>(null);
//   const created = useRef(false);

//   // get setter from store
//   const setGridRefInStore = useItemMasterStore((state) => state.setGridRef);

//   // Create grid once
//   useEffect(() => {
//     const initGrid = () => {
//       if (!layout || !data) {
//         console.log("useTreeGridInit: Missing layout or data, skipping init");
//         return;
//       }
//       if (created.current) {
//         console.log("useTreeGridInit: Grid already created, skipping init");
//         return;
//       }
//       if (!window.TreeGrid) {
//         console.error("useTreeGridInit: window.TreeGrid is NOT available!");
//         return;
//       }

//       const container = document.getElementById(containerId);
//       if (!container) {
//         console.warn(
//           `useTreeGridInit: Container #${containerId} not found in DOM yet. Delaying...`,
//         );
//         return;
//       }

//       const source = {
//         id: gridId,
//         Layout: { Data: layout },
//         Data: { Data: data },
//         Debug: { Check: 1 },
//       };

//       console.log(
//         "useTreeGridInit: Calling window.TreeGrid with source:",
//         source,
//       );
//       try {
//         const grid = window.TreeGrid(source, containerId);
//         gridRef.current = grid;
//         setGridRefInStore(grid); // store in Zustand
//         created.current = true;

//         onInit?.(grid);
//       } catch (error) {
//         console.error("useTreeGridInit: Error creating TreeGrid:", error);
//       }
//     };

//     // Use a small timeout to ensure DOM is ready and previous grids are disposed
//     const timer = setTimeout(initGrid, 100);

//     return () => {
//       clearTimeout(timer);
//       if (gridRef.current) {
//         console.log("useTreeGridInit: Disposing grid", gridId);
//         try {
//           gridRef.current.Dispose();
//         } catch (e) {
//           console.error("useTreeGridInit: Error disposing grid", e);
//         }
//         gridRef.current = null;
//         setGridRefInStore(null); // clear store on unmount
//         created.current = false;
//       }
//     };
//   }, [layout, gridId, containerId, !!data]); // depend on data existence, not content

//   // Update data WITHOUT recreating grid
//   useEffect(() => {
//     const grid = gridRef.current;
//     if (!grid || !data) return;

//     console.log("useTreeGridInit: Updating data for grid", gridId);
//     grid.Source.Data.Data = data;
//     grid.ReloadBody();
//   }, [data]);

//   return gridRef;
// };

export interface TreeGridHookRef {
  getGridInstance: () => TGrid | null;
  getDataFromTable: () => any[];
}

export const useTreeGridInit = (
  gridId: string,
  containerId: string,
  layout: any,
  data: any,
  onInit?: (grid: TGrid) => void,
) => {
  const internalGridRef = useRef<TGrid | null>(null);
  const created = useRef(false);

  const setGridRefInStore = useItemMasterStore((state) => state.setGridRef);

  useEffect(() => {
    const initGrid = () => {
      if (!layout || !data) return;
      if (created.current) return;
      if (!window.TreeGrid) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      const source = {
        id: gridId,
        Layout: { Data: layout },
        Data: { Data: data },
        Debug: { Check: 1 },
      };

      try {
        const grid = window.TreeGrid(source, containerId);
        internalGridRef.current = grid;
        setGridRefInStore(grid);
        created.current = true;

        onInit?.(grid);
      } catch (error) {
        console.error("Error creating TreeGrid:", error);
      }
    };

    const timer = setTimeout(initGrid, 100);

    return () => {
      clearTimeout(timer);
      if (internalGridRef.current) {
        try {
          internalGridRef.current.Dispose();
        } catch (e) {
          console.error("Dispose error", e);
        }
        internalGridRef.current = null;
        setGridRefInStore(null);
        created.current = false;
      }
    };
  }, [layout, gridId, containerId, !!data]);

  useEffect(() => {
    const grid = internalGridRef.current;
    if (!grid || !data) return;

    grid.Source.Data.Data = data;
    grid.ReloadBody();
  }, [data]);

  // 🔥 NEW: Wrapper API
  const apiRef = useRef<TreeGridHookRef | null>(null);

  if (!apiRef.current) {
    apiRef.current = {
      getGridInstance: () => internalGridRef.current,

      getDataFromTable: () => {
        const grid = internalGridRef.current;
        if (!grid) return [];

        const rows: any[] = [];
        let row = grid.GetFirst();

        while (row) {
          if (row.Kind === "Data") {
            const rowData: any = {};
            const cols = grid.GetCols();

            cols.forEach((col: string) => {
              rowData[col] = grid.GetValue(row, col);
            });

            rows.push(rowData);
          }
          row = grid.GetNext(row);
        }

        return rows;
      },
    };
  }

  return apiRef;
};
