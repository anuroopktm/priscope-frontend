import { useEffect, useRef } from "react";

export const useTreeGridInit = (
  gridId: string,
  containerId: any,
  layout: any,
  data: any,
  onInit?: (grid: TGrid) => void,
) => {
  const gridRef = useRef<TGrid | null>(null);
  const created = useRef(false);
  
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

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !data) return;

    grid.Source.Data.Data = data;
    grid.ReloadBody();
  }, [data]);

  return gridRef;
};
