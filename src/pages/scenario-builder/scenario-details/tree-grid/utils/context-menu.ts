// Text style for menu section headers (e.g., "Builder", "Calculators")
const HEADER_STYLE =
  "display: block; color: #888; font-size: 11px; text-align: left; margin: -6px 8px; font-weight: 600; pointer-events: none;";

// Trash icon SVG used in Delete menu item
const DELETE_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9v4m4-4v4"></path></svg>';

export const getHeaderContextMenu = (grid: any, col: string) => {
  const menuType = grid.GetAttribute(null, col, "MenuType");
  const isAggregator =
    menuType === "Aggregator" ||
    !!grid.GetAttribute(null, col, "AggregatorType");

  const deleteItem = {
    Name: "Remove",
    Text: `<span style="color: #d32f2f; display: flex; align-items: center;">${DELETE_ICON} Remove</span>`,
    OnClick: () => (window as any).handleDeleteCol(grid, col),
  };

  // If it's a Data column, show only column options
  if (menuType === "Data") {
    return [
      {
        Text: `<span style="${HEADER_STYLE}">Column Options</span>`,
        Caption: 1,
      },
      {
        Name: "Add Column in Right",
        OnClick: () => (window as any).handleAddColRight(grid, col),
      },
      {
        Name: "Add Column in Left",
        OnClick: () => (window as any).handleAddColLeft(grid, col),
      },
      { Name: "-", Separator: 1 },
      deleteItem,
    ] as any[];
  }

  // If it's an Aggregator, show options and delete
  if (isAggregator) {
    return [
      {
        Text: `<span style="${HEADER_STYLE}">Column Options</span>`,
        Caption: 1,
      },
      {
        Name: "Add Column in Right",
        OnClick: () => (window as any).handleAddColRight(grid, col),
      },
      {
        Name: "Add Column in Left",
        OnClick: () => (window as any).handleAddColLeft(grid, col),
      },
      { Name: "-", Separator: 1 },
      deleteItem,
    ] as any[];
  }

  // Otherwise, fallback to Builder menu for generic columns
  return [
    { Text: `<span style="${HEADER_STYLE}">Builder</span>`, Caption: 1 },
    {
      Name: "Component aggregator",
      OnClick: () => (window as any).handleComponentAggregator(grid, col),
    },
    {
      Name: "Cost aggregator",
      OnClick: () => (window as any).handleCostAggregator(grid, col),
    },
    {
      Name: "Markup component",
      OnClick: () => (window as any).handleMarkupComponent(grid, col),
    },
    {
      Name: "Margin component",
      OnClick: () => (window as any).handleMarginComponent(grid, col),
    },
    // {
    //   Name: "General formula component",
    //   OnClick: () => (window as any).handleGeneralFormulaComponent(grid, col),
    // },
    { Name: "-", Separator: 1 },
    deleteItem,
  ] as any[];
};

export const getCellContextMenu = (grid: any, row: any, col: string) => {
  const menuType = grid.GetAttribute(null, col, "MenuType");
  const aggregatorType = grid.GetAttribute(null, col, "AggregatorType");

  // 1. Aggregator -> "Calculate" and "Comment"
  if (menuType === "Aggregator" || aggregatorType) {
    return [
      {
        Name: "Calculate",
        OnClick: () => {
          (window as any).handleCalculate(row.id, col);
        },
      },
      { Name: "-", Separator: 1 },
      {
        Name: "Comment",
        OnClick: () => (window as any).handleCommentFromMenu(grid, row, col),
      },
    ] as any[];
  }

  // 3. Builder/Generic Column / Data Column -> "Calculators" menu
  return [
    { Text: `<span style="${HEADER_STYLE}">Calculators</span>`, Caption: 1 },
    {
      Name: "Component aggregator",
      OnClick: () => (window as any).handleCalculate(row.id, col, "Component"),
    },
    {
      Name: "Cost aggregator",
      OnClick: () => (window as any).handleCalculate(row.id, col, "Cost"),
    },
    {
      Name: "Markup component",
      OnClick: () => (window as any).handleCalculate(row.id, col, "Markup"),
    },
    {
      Name: "Margin component",
      OnClick: () => (window as any).handleCalculate(row.id, col, "Margin"),
    },
    { Name: "-", Separator: 1 },
    {
      Name: "Comment",
      OnClick: () => (window as any).handleCommentFromMenu(grid, row, col),
    },
  ] as any[];
};
