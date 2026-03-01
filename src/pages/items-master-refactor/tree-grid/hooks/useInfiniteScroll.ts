import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  rootMargin = "200px",
}: UseInfiniteScrollProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin]);

  return loadMoreRef;
};
