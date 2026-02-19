import "./TreeGrid.TypeScript.API.d.ts";

// This allows you to use window.Grids and window.TreeGrid with full intellisense
declare global {
  interface Window {
    Grids: TGrids;
    TreeGrid: (Source: any, tag: any, id?: any) => TGrid;
  }
}
