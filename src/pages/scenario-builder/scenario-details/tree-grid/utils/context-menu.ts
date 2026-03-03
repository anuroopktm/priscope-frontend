export const getHeaderContextMenu = (grid: any, col: string) => {
  const caption = (grid.Header?.[col] || "").toString().trim();
  const isGeneratedId = /^C\d+$/.test(col);

  // Consider it a 'Builder' column if the header is empty OR it matches the generated ID (C1, C2...)
  const isBuilder = !caption || (isGeneratedId && caption === col);

  const deleteItem = {
    Name: "Delete",
    Text: '<span style="color: #d32f2f; display: flex; align-items: center; gap: 8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9v4m4-4v4"></path></svg>Delete</span>',
    OnClick: () => (window as any).handleDeleteCol(grid, col),
  };

  if (!isBuilder) {
    // Existing column menu
    return [
      { Name: "Column Options", Caption: 1, Class: "MenuCaption" },
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
    ];
  }

  // Empty/New column menu (Builder)
  return [
    { Name: "Builder", Caption: 1, Class: "MenuCaption" },
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
    {
      Name: "General formula component",
      OnClick: () => (window as any).handleGeneralFormulaComponent(grid, col),
    },
    { Name: "-", Separator: 1 },
    deleteItem,
  ];
};
