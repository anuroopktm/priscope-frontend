import { useCallback } from "react";
import {
  onGridScroll,
  onGridSelect,
  registerGridEvents,
} from "../utils/event-handlers";

interface UseItemMasterEventsProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useItemMasterEvents = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseItemMasterEventsProps) => {
  // 1. Decoupled Scroll Handler
  const handleScroll = useCallback(
    (grid: TGrid) => {
      onGridScroll(grid, hasNextPage, isFetchingNextPage, fetchNextPage);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // 2. Decoupled Select Handler
  const handleSelect = useCallback((grid: TGrid) => {
    onGridSelect(grid);
  }, []);

  // 3. Decoupled Ready/Registration Handler
  const handleGridReady = useCallback(
    (grid: TGrid) => {
      registerGridEvents(grid, { handleScroll, handleSelect });
    },
    [handleScroll, handleSelect],
  );

  return { handleGridReady };
};
