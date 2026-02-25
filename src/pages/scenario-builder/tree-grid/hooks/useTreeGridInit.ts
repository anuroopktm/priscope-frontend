import { useEffect, useRef } from "react";

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

  // Create grid once
  useEffect(() => {
    console.log(
      "useTreeGridInit: useEffect [layout, data, gridId, containerId]",
      { layout, data, gridId, containerId },
    );

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
      console.log("useTreeGridInit: window.TreeGrid returned:", grid);
      gridRef.current = grid;
      created.current = true;

      onInit?.(grid);
    } catch (error) {
      console.error("useTreeGridInit: Error creating TreeGrid:", error);
    }

    return () => {
      if (gridRef.current) {
        console.log("useTreeGridInit: Disposing grid", gridId);
        gridRef.current.Dispose();
        gridRef.current = null;
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
