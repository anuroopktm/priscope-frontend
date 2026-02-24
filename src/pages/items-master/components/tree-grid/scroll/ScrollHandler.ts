export const onScroll = (
  grid: TGrid,
  hpos: number,
  vpos: number,
  gridId: string,
  scrollThreshold = 200,
  onLoadMore: () => void,
): void => {
  if (!onLoadMore) return;
  let gridLoadingMap: Record<string, boolean> = {};
  if (gridLoadingMap[gridId]) return;
  const lastRow = grid?.GetLast();
  if (!lastRow) return;

  const scrollTop = grid?.GetScrollTop ? grid.GetScrollTop() : vpos;
  const bodyHeight = grid?.GetBodyHeight ? grid.GetBodyHeight() : 530;
  const lastRowTop = grid?.GetRowTop ? grid.GetRowTop(lastRow) : 0;

  if (scrollTop + bodyHeight >= lastRowTop - scrollThreshold) {
    gridLoadingMap[gridId] = true;
    onLoadMore();
  }
};
