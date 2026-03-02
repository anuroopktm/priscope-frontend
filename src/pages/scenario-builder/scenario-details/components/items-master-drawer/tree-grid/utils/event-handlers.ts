import { ITEM_MASTER_GRID_ID } from "../constants/grid.constants";

/**
 * Handle grid scrolling for infinite loading.
 */
export const onGridScroll = (
  grid: TGrid,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void,
) => {
  if (!grid) return;

  const scrollPos =
    (grid.GetBodyScrollHeight?.() ?? 0) -
    (grid.GetScrollTop?.() ?? 0) -
    (grid.GetBodyHeight?.() ?? 0);

  if (scrollPos < 100 && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

/**
 * Handle row selection events.
 */
export const onGridSelect = (grid: TGrid) => {
  if (!grid) return;
  const selRows = grid.GetSelRows();
  console.log(
    "Selection changed. Selected IDs:",
    selRows.map((r: any) => r.id),
  );
};

/**
 * Register all events when the grid is ready.
 */
export const registerGridEvents = (
  grid: TGrid,
  handlers: {
    handleScroll: (grid: TGrid) => void;
    handleSelect: (grid: TGrid) => void;
  },
) => {
  if (!grid) return;
  window.TGSetEvent("OnScroll", ITEM_MASTER_GRID_ID, handlers.handleScroll);
  window.TGSetEvent("OnSelect", ITEM_MASTER_GRID_ID, handlers.handleSelect);
};
