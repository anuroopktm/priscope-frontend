import { useEffect, useRef } from "react";

type UseSkuUpcClickableProps = {
  gridId: string;
  onSkuClick: (rowId: string, col: string, value: any) => void;
  onUpcClick: (rowId: string, col: string, value: any) => void;
};

export const useSkuUpcClickable = ({
  gridId,
  onSkuClick,
  onUpcClick,
}: UseSkuUpcClickableProps) => {
  const handlerRef = useRef<
    ((rowId: string, col: string, value: any) => void) | null
  >(null);

  useEffect(() => {
    handlerRef.current = (rowId, col, value) => {
      if (col === "SKU") {
        onSkuClick(rowId, col, value);
      } else if (col === "UPC") {
        onUpcClick(rowId, col, value);
      }
    };
  }, [onSkuClick, onUpcClick]);

  useEffect(() => {
    // window.Grids ??= {};
    const Grids = (window as any).Grids;
    if (!Grids) return;
    const prev = window.Grids.OnGetHtmlValue;

    (window as any).onSkuUpcClick = (
      rowId: string,
      col: string,
      value: any,
    ) => {
      handlerRef.current?.(rowId, col, value);
    };

    window.Grids.OnGetHtmlValue = (
      grid: any,
      row: any,
      col: string,
      val: any,
    ) => {
      if (grid?.id !== gridId) {
        return prev ? prev(grid, row, col, val) : val;
      }

      if (row?.Kind === "Header") {
        return prev ? prev(grid, row, col, val) : val;
      }

      if ((col === "SKU" || col === "UPC") && val) {
        const safeVal = String(val).replace(/"/g, "&quot;");

        return `
      <span
        style="
          cursor: pointer;
          color: inherit;
          transition: color 0.15s ease;
        "
        onmouseenter="this.style.color='#1a73e8'"
        onmouseleave="this.style.color=''"
        onclick="
          window.onSkuUpcClick &&
          window.onSkuUpcClick('${row.id}', '${col}', '${safeVal}')
        "
      >
        ${safeVal}
      </span>
    `;
      }

      return prev ? prev(grid, row, col, val) : val;
    };

    return () => {
      if (prev) {
        Grids.OnGetHtmlValue = prev;
      }
    };
  }, [gridId]);
};
