import { useListItems } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import ActionHeader from "./components/ActionHeader";
import { ItemMasterGridLayout } from "./tree-grid/config/layout";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import { mapItemsToGridBody } from "./tree-grid/utils/data-mapper";

const gridId = "ItemMasterGrid";
const gridContainerId = "TreeGrid_" + gridId;

const ItemMasterListingPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: itemMasterData, refetch } = useListItems({
    search: searchTerm,
    filter: {},
    page_size: 100,
  });

  const gridData = useMemo(() => {
    if (!itemMasterData) return null;
    const items = itemMasterData.pages.flatMap((page) => page.items);
    return mapItemsToGridBody(items);
  }, [itemMasterData]);

  useTreeGridInit(gridId, gridContainerId, ItemMasterGridLayout, gridData);

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
