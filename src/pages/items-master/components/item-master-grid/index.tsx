import TreeGrid from "@/shared/components/treegrid";
import { TreeGridProps } from "@/shared/types/treegrid.types";
import { useEffect } from "react";

interface CustomTreeGridProps extends TreeGridProps {
  onSkuUpcClick?: (rowId: string, col: string, value: any) => void;
}

const ItemMasterGrid: React.FC<CustomTreeGridProps> = (props) => {
  const { onSkuUpcClick, ...treeGridProps } = props;

  const { gridId } = treeGridProps;
  useEffect(() => {
    (window as any).onSkuUpcClick = (
      rowId: string,
      col: string,
      value: any,
    ) => {
      onSkuUpcClick?.(rowId, col, value);
    };

    return () => {
      delete (window as any).onSkuUpcClick;
    };
  }, []);

  useEffect(() => {
    window.Grids ??= {};
    const prev = window.Grids.OnGetHtmlValue;
    window.Grids.OnGetHtmlValue = (grid: any, row: any, col: any, val: any) => {
      if (grid.id !== gridId) {
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
      if (col === "Supplier" || col === "Customer") {
        if (!val) return "";
        const valArray = val.split(",").map((v: string) => v.trim());
        const firstName = valArray?.[0] ?? "";
        const badgeLength = valArray.length > 0 ? valArray.length - 1 : 0;
        return `
        <div>
         <span style="
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    background-color: #3B9EDC1A;
    color: #1A2B44;
    // font-weight: 600;
    font-size: 12px;
    line-height: 1;">
          ${firstName}
    </span>
     <span style="
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    background-color:#3B9EDC1A;
    color: #1A2B44;
    // font-weight: 600;
    font-size: 12px;
    line-height: 1;">
          +${badgeLength}
    </span>
        </div>
                  `;
      }
      return prev ? prev(grid, row, col, val) : val;
    };
    return () => {
      if (prev) {
        window.Grids.OnGetHtmlValue = prev;
      } else {
        delete window.Grids.OnGetHtmlValue;
      }
    };
  }, [gridId]);

  return <TreeGrid {...treeGridProps} />;
};

export default ItemMasterGrid;
