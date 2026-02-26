import { useEffect, useRef } from "react";
import { handleValueChanged } from "../components/tree-grid/CellValue/handleValueChanged";
import { handleFilterChange } from "../components/tree-grid/Filter/FilterChange";
import { handleSelected } from "../components/tree-grid/RowSelection/RowSelection";
import { onScroll } from "../components/tree-grid/scroll/ScrollHandler";

export const useItemsMasterGridEvents = ({
  gridId,
  setFilter,
  setSelectedRows,
  setState,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: any) => {
  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
  }, [hasNextPage]);

  useEffect(() => {
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  const handleLoadMore = () => {
    if (hasNextPageRef.current && !isFetchingNextPageRef.current) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const onHandleScroll = (grid: TGrid, hpos: number, vpos: number) => {
      onScroll(grid, hpos, vpos, gridId, 200, handleLoadMore);
    };

    const onSelected = (grid: TGrid) => {
      handleSelected(grid, setSelectedRows);
    };

    const onHandleFilterChange = (grid: TGrid) => {
      handleFilterChange(grid, setFilter);
    };

    const onHandleValueChanged = (
      grid: TGrid,
      row: TRow,
      col: string,
      val: string,
      oldval: string,
    ) => {
      handleValueChanged(grid, row, col, val, oldval, gridId, setState);
    };

    window.TGSetEvent("OnScroll", gridId, onHandleScroll);
    window.TGSetEvent("OnSelected", gridId, onSelected);
    window.TGSetEvent("OnFilter", gridId, onHandleFilterChange);
    window.TGSetEvent("OnValueChanged", gridId, onHandleValueChanged);

    return () => {
      window.TGDelEvent("OnSelected", gridId);
      window.TGDelEvent("OnScroll", gridId);
      window.TGDelEvent("OnFilter", gridId);
      window.TGDelEvent("OnValueChanged", gridId);
    };
  }, [gridId, setFilter, setSelectedRows, setState]);
};
