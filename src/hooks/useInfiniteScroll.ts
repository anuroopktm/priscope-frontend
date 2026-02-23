import { useRef, useCallback } from "react";

type UseInfiniteScrollOptions = {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
};

export function useInfiniteScroll({
  isLoading,
  hasMore,
  onLoadMore,
  rootMargin = "100px",
}: UseInfiniteScrollOptions) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { rootMargin }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore, rootMargin]
  );

  return lastElementRef;
}
