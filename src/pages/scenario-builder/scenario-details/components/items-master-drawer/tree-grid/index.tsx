import { Box } from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";
import { useTreeGridInit } from "../../../tree-grid/hooks/useTreeGridInit";
import {
  ITEM_MASTER_GRID_CONTAINER_ID,
  ITEM_MASTER_GRID_ID,
} from "./constants/grid.constants";
import { useItemMasterGrid } from "./hooks/useItemMasterGrid";

interface ItemsMasterGridProps {
  searchTerm: string;
}

const ItemsMasterGrid = forwardRef(
  ({ searchTerm }: ItemsMasterGridProps, ref) => {
    const { layout, data, handleGridReady, gridInstanceRef } =
      useItemMasterGrid({
        searchTerm,
      });

    const gridInstance = useTreeGridInit(
      ITEM_MASTER_GRID_ID,
      ITEM_MASTER_GRID_CONTAINER_ID,
      layout,
      data,
      handleGridReady,
    );

    // Sync the ref from the hook with the ref from useTreeGridInit
    gridInstanceRef.current = gridInstance?.current;

    useImperativeHandle(ref, () => ({
      getSelectedIds: () => {
        const grid = gridInstance?.current;
        if (!grid) return [];
        const selRows = grid.GetSelRows();
        return selRows.map((row: any) => row.id);
      },
    }));

    return (
      <Box
        id={ITEM_MASTER_GRID_CONTAINER_ID}
        sx={{
          width: "100%",
          flex: 1,
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      />
    );
  },
);

export default ItemsMasterGrid;
