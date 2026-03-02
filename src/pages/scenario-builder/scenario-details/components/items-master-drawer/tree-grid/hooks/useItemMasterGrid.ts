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
} from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { useEffect, useRef, useState } from "react";
import { syncGridData } from "../utils/grid-data";
import { enrichItemMasterLayout } from "../utils/layout-helper";
import { useItemMasterEvents } from "./useItemMasterEvents";

interface UseItemMasterGridProps {
  searchTerm: string;
}

export const useItemMasterGrid = ({ searchTerm }: UseItemMasterGridProps) => {
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

  return {
    layout,
    data,
    handleGridReady,
    gridInstanceRef,
  };
};
