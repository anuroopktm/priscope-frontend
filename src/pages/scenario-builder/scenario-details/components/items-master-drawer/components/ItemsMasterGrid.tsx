import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  getItemMasterLayout,
} from "@/pages/items-master/helpers/itemMasterTreeGridHelperFunction";
import type {
  TreeGridBody,
  TreeGridLayout,
} from "@/pages/items-master/helpers/types";
import {
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master/item-master.queries";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTreeGridInit } from "../../../tree-grid/hooks/useTreeGridInit";

const gridId = "ItemsMasterGrid";
const gridContainerId = "TreeGrid_" + gridId;

interface ItemsMasterGridProps {
  searchTerm: string;
}

const ItemsMasterGrid = ({ searchTerm }: ItemsMasterGridProps) => {
  const [layout, setLayout] = useState<TreeGridLayout | null>(null);
  const [data, setData] = useState<TreeGridBody | null>(null);
  const isInitialLoadRef = useRef(true);

  const { data: listHeaderData } = useListHeaders({
    page_size: 1000,
    search: "",
    skip: 0,
  });

  const {
    data: itemMasterDataList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListItems({
    search: searchTerm,
    page_size: 100,
  });

  useEffect(() => {
    if (!itemMasterDataList || !listHeaderData?.headers.length) return;

    const pages = itemMasterDataList.pages;
    const firstPageItems = pages[0]?.items ?? [];
    const body = buildItemMasterTreeGridBody(firstPageItems);

    if (isInitialLoadRef.current) {
      if (!firstPageItems.length) return;
      const { cols } = buildItemMasterTreeGridCols(listHeaderData.headers);

      getItemMasterLayout(cols, listHeaderData).then(setLayout);
      setData(body);

      isInitialLoadRef.current = false;
      return;
    }

    const grid = gridInstance?.current;
    if (!grid) return;

    // Handle data updates/appends
    const lastPage = pages[pages.length - 1];
    const newItems = lastPage?.items ?? [];
    const dataToAdd = buildItemMasterTreeGridBody(newItems);

    if (pages.length === 1) {
      grid.Source.Data.Data = {
        Body: [body.Body[0] || []],
      };
      if (grid.Source.Data.Url) delete grid.Source.Data.Url;
      grid.ReloadBody();
    } else {
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
  }, [itemMasterDataList, listHeaderData]);

  const handleGridReady = useCallback(() => {
    window.TGSetEvent("OnScroll", gridId, (grid: TGrid) => {
      if (!grid) return;
      if (
        (grid.GetBodyScrollHeight?.() ?? 0) -
          (grid.GetScrollTop?.() ?? 0) -
          (grid.GetBodyHeight?.() ?? 0) <
        100
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const gridInstance = useTreeGridInit(
    gridId,
    gridContainerId,
    layout,
    data,
    handleGridReady,
  );

  return (
    <Box
      id={gridContainerId}
      sx={{
        width: "100%",
        flex: 1,
        borderRadius: 1,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    />
  );
};

export default ItemsMasterGrid;
