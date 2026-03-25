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
  onInit?: (grid: any) => void,
) => {
  const gridRef = useRef<any>(null);
  const created = useRef(false);
  const dataRef = useRef(data);
  const layoutRef = useRef(layout);
  const onInitRef = useRef(onInit);

  // Sync refs so initGrid always sees the latest values even if captured in closure
  useEffect(() => {
    dataRef.current = data;
    layoutRef.current = layout;
    onInitRef.current = onInit;
  }, [data, layout, onInit]);

  // Ensure onInit is called if it's provided late
  useEffect(() => {
    const grid = gridRef.current || (window as any).Grids?.[gridId];
    if (grid && onInit) {
      onInit(grid);
    }
  }, [gridId, onInit]);

  // Create grid once
  useEffect(() => {
    const initGrid = () => {
      if (!layoutRef.current || !dataRef.current) return;
      if (created.current) return;
      if (!window.TreeGrid) return;

      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`useTreeGridInit: Container #${containerId} not found.`);
        return;
      }

      // 🚨 CRITICAL: Dispose any existing grid with the same ID before creating a new one.
      const existingGrid = (window as any).Grids?.[gridId];
      if (existingGrid) {
        try {
          console.log(`Disposing existing grid before init: ${gridId}`);
          existingGrid.Dispose();
        } catch (e) {
          console.error("Error disposing existing grid:", e);
        }
      }

      const source = {
        id: gridId,
        Layout: { Data: layoutRef.current },
        Data: { Data: dataRef.current },
        Debug: { Check: 1 },
      };

      try {
        console.log(`Creating TreeGrid: ${gridId}`);
        const grid = window.TreeGrid(source, containerId);
        gridRef.current = grid;
        created.current = true;
        onInitRef.current?.(grid);
      } catch (error) {
        console.error("useTreeGridInit: Error creating TreeGrid:", error);
      }
    };

    const timer = setTimeout(initGrid, 150);

    return () => {
      clearTimeout(timer);
      const grid = gridRef.current || (window as any).Grids?.[gridId];
      if (grid) {
        try {
          console.log(`Cleaning up grid: ${gridId}`);
          grid.Dispose();
        } catch (e) {
          console.error("useTreeGridInit: Error disposing grid", e);
        }
        gridRef.current = null;
        created.current = false;
        if ((window as any).Grids) {
          delete (window as any).Grids[gridId];
        }
      }
    };
  }, [gridId, containerId, layout]);

  // Update data WITHOUT recreating grid
  useEffect(() => {
    const grid = gridRef.current || (window as any).Grids?.[gridId];
    if (!grid) return;

    const hasData = data?.Body && data.Body[0]?.length > 0;
    const isCurrentlyEmpty = !grid.GetFirst();

    if (hasData || !isCurrentlyEmpty) {
      console.log(`Syncing data update for ${gridId}:`, data);
      grid.Source.Data.Data = data;

      if (data?.ColsData) {
        grid.ColsData = data.ColsData;
      }

      grid.ReloadBody();
    }
  }, [data, gridId]);

  return gridRef;
};
