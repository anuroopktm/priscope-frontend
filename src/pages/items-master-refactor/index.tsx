import { useListItems } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ActionHeader from "./components/ActionHeader";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import { mapItemsToGridBody } from "./tree-grid/utils/data-mapper";
import { ItemMasterGridLayout } from "./helper";
import { useListHeaders } from "@/services/queries/item-master/item-master.queries";
import { buildItemMasterTreeGridCols } from "../items-master/helpers/itemMasterTreeGridHelperFunction";
import { handleSelected } from "./tree-grid/utils/rowSelection";

const gridId = "ItemMasterGrid";
const gridContainerId = "TreeGrid_" + gridId;

const ItemMasterListingPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: itemMasterData, refetch } = useListItems({
    search: searchTerm,
    filter: {},
    page_size: 100,
  });

  const { data: listHeaderData, isLoading: isListHeadersLoading } =
    useListHeaders({ page_size: 10000, search: "", skip: 0 });

  useEffect(() => {
    window.TGSetEvent("OnSelected", gridId, onSelected);
    return () => {
      window.TGDelEvent("OnSelected", gridId);
    };
  }, []);

  const cols = useMemo(() => {
    if (!listHeaderData?.headers) return [];
    return buildItemMasterTreeGridCols(listHeaderData.headers).cols;
  }, [listHeaderData]);

  const gridLayout = useMemo(() => {
    if (!cols.length || !listHeaderData) return null;
    return ItemMasterGridLayout(cols, listHeaderData);
  }, [cols, listHeaderData]);

  const gridData = useMemo(() => {
    if (!itemMasterData) return null;
    const items = itemMasterData.pages.flatMap((page) => page.items);
    return mapItemsToGridBody(items);
  }, [itemMasterData]);

  const onSelected = (grid: TGrid) => {
    handleSelected(grid);
  };

  useTreeGridInit(gridId, gridContainerId, gridLayout, gridData);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        bgcolor: "brand.background",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <ActionHeader
        onSearch={setSearchTerm}
        onImportComplete={() => refetch()}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: 1,
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Box
            id={gridContainerId}
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ItemMasterListingPage;
