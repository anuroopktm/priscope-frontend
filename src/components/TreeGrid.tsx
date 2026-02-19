import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "../TreeGrid.TypeScript.API.d.ts";

interface TreeGridProps {
  id?: string;
  layout?: any;
  data?: any;
  debug?: any;
  onInit?: (grid: TGrid) => void;
  upload?: any;
  exportPdf?: any;
}

export interface TreeGridRef {
  grid: TGrid | null;
}

const TreeGrid = forwardRef<TreeGridRef, TreeGridProps>(
  (
    {
      id = "TreeGrid",
      layout,
      data,
      debug = { Check: 1 },
      onInit,
      upload,
      exportPdf,
    },
    ref,
  ) => {
    const gridContainerId = `TreeGridContainer_${id}`;
    const gridInstance = useRef<TGrid | null>(null);

    useImperativeHandle(ref, () => ({
      get grid() {
        return gridInstance.current;
      },
    }));

    useEffect(() => {
      if (window.Grids && window.Grids[id]) {
        console.log(`Disposing existing grid: ${id}`);
        window.Grids[id]?.Dispose();
      }

      const wrapSource = (content: any) => {
        if (!content) return null;
        if (content.Url || content.Script || content.Data) return content;
        return { Data: content };
      };

      const source: any = {
        Layout: wrapSource(layout),
        Data: wrapSource(data),
        Debug: debug,
      };

      if (upload) source.Upload = wrapSource(upload);
      if (exportPdf) source.ExportPDF = wrapSource(exportPdf);

      console.log(`Initializing TreeGrid ${id} with source:`, source);

      const grid = window.TreeGrid(source, gridContainerId, {
        Component: {},
      });

      gridInstance.current = grid;

      if (onInit && grid) {
        onInit(grid);
      }
      return () => {
        if (window.Grids && window.Grids[id]) {
          console.log(`Cleaning up grid: ${id}`);
          window.Grids[id]?.Dispose();
        }
        gridInstance.current = null;
      };
    }, [id, layout, data, debug, upload, exportPdf]);

    return (
      <div id={gridContainerId} style={{ width: "100%", height: "100%" }}></div>
    );
  },
);

export default TreeGrid;
