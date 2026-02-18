import React, { useEffect } from "react";
import "../TreeGrid.TypeScript.API.d.ts";

// Define props for the reusable component
interface TreeGridProps {
  id?: string;
  layout?: any;
  data?: any;
  debug?: any;
  // Add other configuration options as needed
  onInit?: (grid: any) => void;
  upload?: any;
  exportPdf?: any;
}

const TreeGrid: React.FC<TreeGridProps> = ({
  id = "TreeGrid",
  layout,
  data,
  debug = { Check: 1 },
  onInit,
  upload,
  exportPdf,
}) => {
  const gridContainerId = `TreeGridContainer_${id}`;

  useEffect(() => {
    // Clean up existing grid if any
    if (window.Grids && window.Grids[id]) {
      console.log(`Disposing existing grid: ${id}`);
      window.Grids[id]?.Dispose();
    }

    // Prepare the Source object for TreeGrid
    // We ensure that Layout, Data, and other configs are wrapped in { Data: ... }
    // if they are passed as direct objects/strings.
    // This is a heuristic; technically the user could pass { Url: ... } which is also valid.
    // For simplicity, we assume if it's a plain object (and not one with Url/Script keys), it might be raw data.
    // However, TreeGrid is flexible. The safest bet for raw data/layout object is wrapping it.

    // Helper to wrap content if it doesn't look like a Source definition (Url/Script/Data keys)
    const wrapSource = (content: any) => {
      if (!content) return null;
      // If content has Url, Script, or Data property, use it as is
      if (content.Url || content.Script || content.Data) return content;
      // Otherwise, treat as raw data
      return { Data: content };
    };

    const source: any = {
      Layout: wrapSource(layout),
      Data: wrapSource(data),
      Debug: debug,
    };

    if (upload) source.Upload = wrapSource(upload);
    if (exportPdf) source.ExportPDF = wrapSource(exportPdf);

    // Debug logging
    console.log(`Initializing TreeGrid ${id} with source:`, source);

    // Initialize grid
    const grid = window.TreeGrid(source, gridContainerId, {
      Component: {
        // Link this React component instance if needed
      },
    });

    // Call onInit callback if provided
    if (onInit && grid) {
      onInit(grid);
    }

    // Cleanup
    return () => {
      if (window.Grids && window.Grids[id]) {
        console.log(`Cleaning up grid: ${id}`);
        window.Grids[id]?.Dispose();
      }
    };
  }, [id, layout, data, debug, upload, exportPdf]); // Re-create grid if key props change

  return (
    <div id={gridContainerId} style={{ width: "100%", height: "100%" }}></div>
  );
};

export default TreeGrid;
