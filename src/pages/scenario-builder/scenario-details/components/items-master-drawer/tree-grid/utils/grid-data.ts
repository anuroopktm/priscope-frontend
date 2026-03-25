import { buildItemMasterTreeGridBody } from "@/pages/items-master-refactor/helper";

export const syncGridData = (grid: any, pages: any[], body: any) => {
  if (!grid) return;

  if (pages.length === 1) {
    // Reload first page
    grid.Source.Data.Data = {
      Body: [body.Body[0] || []],
    };
    if (grid.Source.Data.Url) delete grid.Source.Data.Url;
    grid.ReloadBody();
  } else {
    // Append subsequent pages
    const lastPage = pages[pages.length - 1];
    const newItems = lastPage?.items ?? [];
    const dataToAdd = buildItemMasterTreeGridBody(newItems);

    dataToAdd?.Body[0].forEach((rowData: any) => {
      const newRow = grid.AddRow(undefined, undefined, 1, rowData.id);
      if (!newRow) return;
      Object.entries(rowData).forEach(([key, value]) => {
        if (key === "id" || value === undefined) return;
        grid.SetValue(newRow, key, value, 1);
      });
      grid.RefreshRow(newRow);
    });
    grid.Update();
  }
};
