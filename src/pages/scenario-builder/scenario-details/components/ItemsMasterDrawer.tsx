import {
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master/item-master.queries";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  getItemMasterLayout,
} from "../../../items-master/helpers/itemMasterTreeGridHelperFunction";
import type {
  TreeGridBody,
  TreeGridLayout,
} from "../../../items-master/helpers/types";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";

interface ItemsMasterDrawerProps {
  open: boolean;
  onClose: () => void;
}

const gridId = "ItemsMasterGrid";
const gridContainerId = "TreeGrid_" + gridId;

const ItemsMasterDrawer = ({ open, onClose }: ItemsMasterDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "90vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">Items Master</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, p: 2, minHeight: 0 }}>
        {open && <ItemsMasterGridContent />}
      </Box>
    </Drawer>
  );
};

const ItemsMasterGridContent = () => {
  const [layout, setLayout] = useState<TreeGridLayout | null>(null);
  const [data, setData] = useState<TreeGridBody | null>(null);
  const isInitialLoadRef = useRef(true);

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
    search: "",
    page_size: 100,
  });

  useEffect(() => {
    if (!itemMasterDataList || !listHeaderData?.headers.length) return;

    const pages = itemMasterDataList.pages;
    const firstPageItems = pages[0]?.items ?? [];
    const body = buildItemMasterTreeGridBody(firstPageItems);

    if (isInitialLoadRef.current) {
      if (!firstPageItems.length) return;
      const { cols } = buildItemMasterTreeGridCols(listHeaderData.headers);

      getItemMasterLayout(cols, listHeaderData).then(setLayout);
      setData(body);

      isInitialLoadRef.current = false;
      return;
    }

    const grid = gridInstance?.current;
    if (!grid) return;

    // Handle data updates/appends
    const lastPage = pages[pages.length - 1];
    const newItems = lastPage?.items ?? [];
    const dataToAdd = buildItemMasterTreeGridBody(newItems);

    // If it's the first page but grid already exists, reload body
    if (pages.length === 1) {
      grid.Source.Data.Data = {
        Body: [body.Body[0] || []],
      };
      if (grid.Source.Data.Url) delete grid.Source.Data.Url;
      grid.ReloadBody();
    } else {
      // Append rows for infinite scroll
      dataToAdd?.Body[0].forEach((rowData: any) => {
        const newRow = grid.AddRow(undefined, undefined, 1, rowData.id);
        if (!newRow) return;
        Object.entries(rowData).forEach(([key, value]) => {
          if (key === "id" || value === undefined) return;
          grid.SetValue(newRow, key, value, 1);
        });
        grid.RefreshRow(newRow);
      });
      grid.Update();
    }
  }, [itemMasterDataList, listHeaderData]);

  const handleGridReady = useCallback(() => {
    // Add scroll handler for infinite loading
    window.TGSetEvent("OnScroll", gridId, (grid: TGrid) => {
      if (!grid) return;
      if (
        (grid.GetBodyScrollHeight?.() ?? 0) -
          (grid.GetScrollTop?.() ?? 0) -
          (grid.GetBodyHeight?.() ?? 0) <
        100
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const gridInstance = useTreeGridInit(
    gridId,
    gridContainerId,
    layout,
    data,
    handleGridReady,
  );

  return (
    <Box
      id={gridContainerId}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 1,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    />
  );
};

export default ItemsMasterDrawer;
