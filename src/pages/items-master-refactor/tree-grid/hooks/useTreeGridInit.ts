// import { useEffect, useRef } from "react";

// /**
//  * useTreeGridInit - Handles strictly the mounting, unmounting,
//  * and global registry management of the TreeGrid instance.
//  */

// export const useTreeGridInit = (
//   gridId: string,
//   containerId: string,
//   layout: any,
//   data: any,
//   onInit?: (grid: TGrid) => void,
// ) => {
//   const gridRef = useRef<TGrid | null>(null);
//   const created = useRef(false);

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
//         console.log("useTreeGridInit: window.TreeGrid returned:", grid);
//         gridRef.current = grid;
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
//           // Force immediate disposal to clear global memory
//           gridRef.current.Dispose();
//         } catch (e) {
//           console.error("useTreeGridInit: Error disposing grid", e);
//         }
//         gridRef.current = null;
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

import { useEffect, useRef } from "react";
import { useItemMasterStore } from "../../store/useItemMasterStore";

/**
 * useTreeGridInit - Handles strictly the mounting, unmounting,
 * and global registry management of the TreeGrid instance.
 */
export const useTreeGridInit = (
  gridId: string,
  containerId: string,
  layout: any,
  data: any,
  onInit?: (grid: TGrid) => void,
) => {
  const gridRef = useRef<TGrid | null>(null);
  const created = useRef(false);

  // get setter from store
  const setGridRefInStore = useItemMasterStore((state) => state.setGridRef);

  // Create grid once
  useEffect(() => {
    const initGrid = () => {
      if (!layout || !data) {
        console.log("useTreeGridInit: Missing layout or data, skipping init");
        return;
      }
      if (created.current) {
        console.log("useTreeGridInit: Grid already created, skipping init");
        return;
      }
      if (!window.TreeGrid) {
        console.error("useTreeGridInit: window.TreeGrid is NOT available!");
        return;
      }

      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(
          `useTreeGridInit: Container #${containerId} not found in DOM yet. Delaying...`,
        );
        return;
      }

      const source = {
        id: gridId,
        Layout: { Data: layout },
        Data: { Data: data },
        Debug: { Check: 1 },
      };

      console.log(
        "useTreeGridInit: Calling window.TreeGrid with source:",
        source,
      );
      try {
        const grid = window.TreeGrid(source, containerId);
        gridRef.current = grid;
        setGridRefInStore(grid); // store in Zustand
        created.current = true;

        onInit?.(grid);
      } catch (error) {
        console.error("useTreeGridInit: Error creating TreeGrid:", error);
      }
    };

    // Use a small timeout to ensure DOM is ready and previous grids are disposed
    const timer = setTimeout(initGrid, 100);

    return () => {
      clearTimeout(timer);
      if (gridRef.current) {
        console.log("useTreeGridInit: Disposing grid", gridId);
        try {
          gridRef.current.Dispose();
        } catch (e) {
          console.error("useTreeGridInit: Error disposing grid", e);
        }
        gridRef.current = null;
        setGridRefInStore(null); // clear store on unmount
        created.current = false;
      }
    };
  }, [layout, gridId, containerId, !!data]); // depend on data existence, not content

  // Update data WITHOUT recreating grid
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !data) return;

    console.log("useTreeGridInit: Updating data for grid", gridId);
    grid.Source.Data.Data = data;
    grid.ReloadBody();
  }, [data]);

  return gridRef;
};
