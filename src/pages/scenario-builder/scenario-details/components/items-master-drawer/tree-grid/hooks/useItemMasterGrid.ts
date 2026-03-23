import {
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { useEffect, useRef, useState } from "react";
import { syncGridData } from "../utils/grid-data";
import { enrichItemMasterLayout } from "../utils/layout-helper";
import { useItemMasterEvents } from "./useItemMasterEvents";
import type {
  TreeGridBody,
  TreeGridLayout,
} from "@/pages/items-master-refactor/helper/types";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  getItemMasterLayout,
} from "@/pages/items-master-refactor/helper";

interface UseItemMasterGridProps {
  searchTerm: string;
  selectedColumns?: string[];
}

export const useItemMasterGrid = ({
  searchTerm,
  selectedColumns,
}: UseItemMasterGridProps) => {
  const [layout, setLayout] = useState<TreeGridLayout | null>(null);
  const [data, setData] = useState<TreeGridBody | null>(null);
  const isInitialLoadRef = useRef(true);
  const gridInstanceRef = useRef<any>(null);

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

  const { handleGridReady } = useItemMasterEvents({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  useEffect(() => {
    if (!itemMasterDataList || !listHeaderData?.headers.length) return;

    const pages = itemMasterDataList.pages;
    const body = buildItemMasterTreeGridBody(pages[0]?.items ?? []);

    if (isInitialLoadRef.current) {
      if (!pages[0]?.items?.length) return;
      const { cols } = buildItemMasterTreeGridCols(listHeaderData.headers);

      getItemMasterLayout(cols, listHeaderData).then((layoutData) => {
        setLayout(enrichItemMasterLayout(layoutData));
      });
      setData(body);

      isInitialLoadRef.current = false;
      return;
    }

    syncGridData(gridInstanceRef.current, pages, body);
  }, [itemMasterDataList, listHeaderData]);

  useEffect(() => {
    const grid = gridInstanceRef.current;
    if (!grid) return;

    // Default visible columns in drawer baseline
    const defaultCols = ["SKU", "Description", "Category", "Shipment quantity"];

    if (grid.Cols) {
      Object.keys(grid.Cols).forEach((col) => {
        // Skip index or action columns
        if (["id", "Panel", "Selected", "Def"].includes(col)) return;
        if (defaultCols.includes(col)) return;

        const shouldBeVisible = selectedColumns?.includes(col);
        const isVisible = grid.GetAttribute(null, col, "Visible") !== 0;

        if (shouldBeVisible && !isVisible) {
          grid.ShowCol(col);
        } else if (!shouldBeVisible && isVisible) {
          grid.HideCol(col);
        }
      });
    }
  }, [selectedColumns]);

  return {
    layout,
    data,
    handleGridReady,
    gridInstanceRef,
  };
};
