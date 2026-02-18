import React from "react";
import "../TreeGrid.TypeScript.API.d.ts";
import TreeGrid from "./TreeGrid";
import "./TreeGridComponent.css"; // Import the custom CSS

import { Box } from "@mui/material";
import sampleData from "../tree-grid-sample-data.json";

// Define the data interface
interface ProductRow {
  id: string;
  SKU: string;
  UPC: string;
  Category: string;
  Description: string;
  Supplier: string;
  Customer: string;
  IsSelected?: number;
  Def?: string;
  Kind?: string;
}

const TreeGridComponent: React.FC = () => {
  // Enum definition for Category
  const categoryEnum =
    "|Education|Vehicles|Business Industry|Home & Living|Essentials|Mobiles|Property|Electronics";
  const categoryOptions = categoryEnum.split("|").filter(Boolean);

  const generateData = (): ProductRow[] => {
    // The sample data has Body which is an array of arrays or just array depending on pagination.
    // Based on the file view, it is Body: [ [ { ... } ] ]
    // We flat map it to get all rows.
    const rawRows = (sampleData.Body as any[]).flat();

    return rawRows.map((r: any) => ({
      id: r.id.toString(),
      SKU: r.Name,
      UPC: r.Phone,
      // Map random category for demo purposes to show off the select
      Category:
        categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
      Description: r.Address,
      Supplier: r.Owner,
      Customer: r.Town,
      IsSelected: r.Type,
    }));
  };

  const gridData = {
    Body: [generateData()],
  };

  // Use LayoutEffect to ensure events are registered BEFORE the child TreeGrid component initializes the grid
  // React.useLayoutEffect(() => {
  //     // Ensure standard global Grids object exists
  //     if (!window.Grids) (window as any).Grids = {};
  //     const G: any = window.Grids;

  //     // Custom HTML Rendering
  //     // defined globally and safely checks for our specific grid ID
  //     const originalGetHtmlValue = G.OnGetHtmlValue;

  //     G.OnGetHtmlValue = (grid: any, row: any, col: string, val: any) => {
  //         // Only apply to our specific grid and Data rows
  //         if (grid.id !== "TreeGrid1" || row.Kind !== "Data") {
  //             return originalGetHtmlValue
  //                 ? originalGetHtmlValue(grid, row, col, val)
  //                 : val;
  //         }

  //         // Custom Select
  //         if (col === "Category") {
  //             const options = categoryOptions
  //                 .map(
  //                     (opt) =>
  //                         `<option value="${opt}" ${opt === val ? "selected" : ""}>${opt}</option>`,
  //                 )
  //                 .join("");

  //             return `
  //                 <div class="select-wrapper">
  //                     <select class="custom-select" onchange="window.Grids['TreeGrid1'].SetValue(window.Grids['TreeGrid1'].GetRowById('${row.id}'), 'Category', this.value, 1);">
  //                         ${options}
  //                     </select>
  //                 </div>
  //             `;
  //         }

  //         // Custom Chips
  //         if (col === "Supplier" || col === "Customer") {
  //             return `
  //                 <div class="chip-container">
  //                     <span class="chip-label">${val}</span>
  //                     <span class="chip-count">+3</span>
  //                 </div>
  //              `;
  //         }
  //         return val;
  //     };

  //     // Custom Class Names
  //     const originalGetClass = G.OnGetClass;
  //     G.OnGetClass = (grid: any, row: any, col: string, cls: string) => {
  //         if (grid.id !== "TreeGrid1")
  //             return originalGetClass ? originalGetClass(grid, row, col, cls) : cls;

  //         if (col === "Category") return (cls || "") + " category-cell";
  //         return cls;
  //     };

  //     // Cleanup function to restore original handlers if component unmounts
  //     // Note: In a SPA, this is important to avoid memory leaks or conflicting handlers
  //     return () => {
  //         G.OnGetHtmlValue = originalGetHtmlValue;
  //         G.OnGetClass = originalGetClass;
  //     };
  // }, []);

  const layout = {
    Cfg: {
      id: "TreeGrid1",
      MainCol: "SKU",
      Sorting: "1",
      RowHeight: 50,
      HeaderHeight: 50,
      HideRootTree: 1,
      StandardFilter: 2,
      // Ensure we use a style that respects standard CSS
      Style: "standard",
    },
    Cols: [
      {
        Name: "IsSelected",
        Type: "Bool",
        // Width: 60,
      },
      { Name: "SKU", Type: "Text" },
      { Name: "UPC", Type: "Text" },
      {
        Name: "Category",
        Type: "Html",
        // Width: 160,
        // Ensure CanEdit is 0 to avoid editing the HTML
      },
      { Name: "Description", Type: "Text" },
      {
        Name: "Supplier",
        Type: "Html",
      },
      {
        Name: "Customer",
        Type: "Html",
      },
    ],
    Header: {
      IsSelected: "Selected",
      SKU: "SKU",
      UPC: "UPC",
      Category: "Category",
      Description: "Description",
      Supplier: "Supplier",
      Customer: "Customer",
      Align: "Left",
    },
    // Toolbar: { Visible: 0 },
    Panel: { Visible: 0 },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#717171ff",
        p: 2.5,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: 1,
        }}
      >
        <TreeGrid
          id="TreeGrid1"
          layout={layout}
          data={gridData}
          debug={{ Check: 0 }}
        />
      </Box>
    </Box>
  );
};

export default TreeGridComponent;
