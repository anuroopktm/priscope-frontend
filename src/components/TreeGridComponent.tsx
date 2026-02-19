import { Box } from "@mui/material";
import React, { useRef } from "react";
import sampleData from "../tree-grid-sample-data.json";
import "../TreeGrid.TypeScript.API.d.ts";
import TreeGrid, { type TreeGridRef } from "./TreeGrid";
import "./TreeGridComponent.css";

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
  const gridRef = useRef<TreeGridRef>(null);

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

  // Callback when grid is initialized
  const handleGridInit = (grid: TGrid) => {
    // Cast to any to attach dynamic event handlers not explicitly in TGrid interface
    const G = grid as any;

    // Attach Custom HTML Rendering directly to this grid instance
    G.OnGetHtmlValue = (grid: TGrid, row: any, col: string, val: any) => {
      // Only apply to Data rows
      if (row.Kind !== "Data") {
        return val;
      }

      // Custom Select
      if (col === "Category") {
        const options = categoryOptions
          .map(
            (opt) =>
              `<option value="${opt}" ${
                opt === val ? "selected" : ""
              }>${opt}</option>`,
          )
          .join("");

        return `
            <div class="select-wrapper">
                <select class="custom-select" onchange="window.Grids['${grid.id}'].SetValue(window.Grids['${grid.id}'].GetRowById('${row.id}'), 'Category', this.value, 1);">
                    ${options}
                </select>
            </div>
        `;
      }

      // Custom Chips
      if (col === "Supplier" || col === "Customer") {
        return `
            <div class="chip-container">
                <span class="chip-label">${val}</span>
                <span class="chip-count">+3</span>
            </div>
          `;
      }
      return val;
    };

    // Attach Custom Class Names
    G.OnGetClass = (grid: TGrid, row: any, col: string, cls: string) => {
      if (col === "Category") return (cls || "") + " category-cell";
      return cls;
    };
  };

  window.TreeGrid.prototype.GetValue = (
    grid: TGrid,
    row: any,
    col: string,
    val: any,
  ) => {
    console.log(")(*&^%^&*", val);

    return val;
  };

  const layout = {
    Cfg: {
      id: "TreeGrid1",
      // MainCol: "SKU",
      // Sorting: "1",
      // RowHeight: 50,
      // HeaderHeight: 50,
      // HideRootTree: 1,
      // StandardFilter: 2,
      Style: "standard",
      // StretchWidth: 1,
      // StrectchHeight: 1,
      // ResizeWidth: 1,
      // ResizeHeight: 1,
      CfgId: "MockGrid",
      MainCol: "SKU",
      Tree: 0,
      // Alternate: 2,
      Delete: 0,
      NumberId: 1,
      SaveSession: "0",
      Paging: "0",
      MaxHeight: "1",
      MinTagHeight: "350",
      ColMoving: "1",
      MainColRelative: "0",
      NoTreeLines: 1,
      Deleting: "0",
      Toolbar: "0",
      RelHeight: 1,
      StretchWidth: 1,
      StretchHeight: 1,
      ResizeWidth: 1,
      // Style: "White",
      DynamicBorder: 1,
      Filtering: 1,
      Filtered: 1,
      ShowDeleted: 0,
      AutoUpdate: 1,
      CanMove: "2",
      FilterLap: "1",
      // Filter: "1",
      // Filter: "1",
    },
    Cols: [
      {
        Name: "IsSelected",
        Type: "Bool",
        // RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
        Width: 60,
      },
      {
        Name: "SKU",
        Type: "Text",
        RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
      },
      {
        Name: "UPC",
        Type: "Text",
        RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
      },
      {
        Name: "Category",
        Type: "Html",
        RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
        // Width: 160,
        // Ensure CanEdit is 0 to avoid editing the HTML
      },
      {
        Name: "Description",
        Type: "Text",
        RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
      },
      {
        Name: "Supplier",
        Type: "Html",
        RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
      },
      {
        Name: "Customer",
        Type: "Html",
        RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
      },
    ],
    Def: {
      R: {
        CanEdit: "1",
      },
      Filter: {
        CanEdit: "1",
      },
    },
    Header: {
      IsSelected: "Selected",
      SKU: "SKU",
      UPC: "UPC",
      Category: "Category",
      Description: "Description",
      Supplier: "Supplier",
      Customer: "Customer",
      Align: "Left",
      FilterBtn: "Filter",
      FilterBtnButton: "Filter",
    },
    Actions: {
      OnClickSide:
        "try { var fRow = Grid.GetRowById ? Grid.GetRowById('Filter') : Grid.GetRow('Filter'); if(fRow) { if(fRow.Visible) Grid.HideRow(fRow); else Grid.ShowRow(fRow); return -1; } } catch(e) { return -1; }",
    },
    Toolbar: { Visible: 1 },
    Panel: { Visible: 0, Select: 1 },
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
          ref={gridRef}
          id="TreeGrid1"
          layout={layout}
          data={gridData}
          debug={{ Check: 0 }}
          onInit={handleGridInit}
        />
      </Box>
    </Box>
  );
};

export default TreeGridComponent;
