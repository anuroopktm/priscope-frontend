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

  // Initialize/Dispose Logic
  useEffect(() => {
    if (!layout || !data || !window.TreeGrid || created.current) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    const initGrid = () => {
      try {
        const source = {
          id: gridId,
          Layout: { Data: layout },
          Data: { Data: data },
          Debug: { Check: 1 },
        };
        const grid = window.TreeGrid(source, containerId);
        gridRef.current = grid;
        created.current = true;
        onInit?.(grid);
      } catch (error) {
        console.error("useTreeGridInit: Error creating TreeGrid:", error);
      }
    };

    const timer = setTimeout(initGrid, 100);

    return () => {
      clearTimeout(timer);
      if (gridRef.current) {
        try {
          gridRef.current.Dispose();
        } catch (e) {
          console.error("useTreeGridInit: Error disposing grid", e);
        }
        gridRef.current = null;
        created.current = false;
      }
    };
  }, [layout, gridId, containerId, !!data]);

  // Data Update Logic
  useEffect(() => {
    const grid = gridRef.current;
    if (grid && data) {
      grid.Source.Data.Data = data;
      grid.ReloadBody();
    }
  }, [data]);

  return gridRef;
};
