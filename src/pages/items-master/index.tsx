import { Box, useTheme } from "@mui/material";
import { ActionHeader } from "../scenario-builder/components/ActionHeader";
import { useTreeGridInit } from "../scenario-builder/hooks/use-tree-grid-init";
import { useCallback, useEffect, useRef, useState } from "react";
// import { TreeGridLayout } from "../scenario-builder/constant/tree-grid-layout";
import JsonData from "../scenario-builder/constant/tree-grid-sample-data.json";
import {
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master/item-master.queries";
import { useDebounce } from "../../hooks/useDebounce";
import { page_size_item_master } from "./constants/itemmaster.constants";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  getItemMasterLayout,
} from "./helpers/itemMasterTreeGridHelperFunction";
import type {
  TreeGridBody,
  TreeGridHeader,
  TreeGridLayout,
} from "./helpers/types";
import RequestsModal from "@/components/common/requests-modal";
import type { SnackbarState } from "./components/columns-dropdown";
import AppSnackbar from "@/components/common/action-bar/AppSnackbar";
import LoaderOverlay from "@/components/common/loader";

const ItemsMasterPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Record<string, string[]>>({});
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [layout, setLayout] = useState<TreeGridLayout | null>(null);
  const [data, setData] = useState<TreeGridBody | null>(null);
  const isInitialLoadRef = useRef(true);
  const isSearchReplaceRef = useRef(false);
  const prevSearchQueryRef = useRef<string>("");
  const treeGridHeadersRef = useRef<TreeGridHeader[]>([]);
  const [openReqestModal, setOpenRequestModal] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: null,
    severity: "info",
  });

  const {
    data: itemMasterDataList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isItemsLoading,
    isError: isListItemsError,
  } = useListItems({
    search: debouncedSearchQuery,
    page_size: page_size_item_master,
    filter: filter,
  });

  console.log(data, "dattaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  const { data: listHeaderData, isLoading: isListHeadersLoading } =
    useListHeaders({ page_size: 10000, search: "", skip: 0, filter: filter });

  useEffect(() => {
    setShowLoader(
      isItemsLoading ||
        isFetchingNextPage ||
        // createCommentPending ||
        isListHeadersLoading,
      // isBulkInsertPending ||
      // deleteItemMasterRowPending ||
      // itemMasterExportRowPending ||
      // isitemMasterBulkInsertAdminApprovalPending,
    );
  }, [
    isItemsLoading,
    isFetchingNextPage,
    // createCommentPending,
    isListHeadersLoading,
    // isBulkInsertPending,
    // deleteItemMasterRowPending,
    // itemMasterExportRowPending,
    // isitemMasterBulkInsertAdminApprovalPending,
  ]);
  useEffect(() => {
    if (prevSearchQueryRef.current !== debouncedSearchQuery) {
      prevSearchQueryRef.current = debouncedSearchQuery;

      if (!isInitialLoadRef.current) {
        isSearchReplaceRef.current = true;
      }
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (!itemMasterDataList || !listHeaderData?.headers.length) return;

    const pages = itemMasterDataList.pages;
    const firstPageItems = pages[0]?.items ?? [];
    const body = buildItemMasterTreeGridBody(firstPageItems);
    setData(body);

    /** 🔹 1. VERY FIRST LOAD (React-driven) */
    if (isInitialLoadRef.current) {
      if (!firstPageItems.length) return;
      const { cols } = buildItemMasterTreeGridCols(listHeaderData.headers);
      treeGridHeadersRef.current = cols;

      getItemMasterLayout(cols, listHeaderData).then(setLayout);
      // IMPORTANT: first mount must go through React
      setData(body);

      isInitialLoadRef.current = false;
      isSearchReplaceRef.current = false;
      return;
    }

    const Grid = gridRef.current?.getGridInstance();
    if (!Grid) return;
    /**  2. SEARCH REPLACE (Grid API) */
    if (isSearchReplaceRef.current) {
      // setData((prev) => [...prev, ...body.Body[0]]);
      setData((prev) => ({
        Body: [[...(prev?.Body?.[0] ?? []), ...(body?.Body?.[0] ?? [])]],
      }));

      Grid.Source.Data.Data = {
        Body: [body.Body[0] || []],
      };

      delete Grid.Source.Data.Url;

      Grid.ReloadBody();

      gridRef.current?.setLoading(false);

      isSearchReplaceRef.current = false;
      return;
    }

    /**  3. INFINITE SCROLL (append rows) */
    const lastPage = pages[pages.length - 1];
    const newItems = lastPage?.items ?? [];

    const dataToAdd = buildItemMasterTreeGridBody(newItems);
    addRowsToGrid(dataToAdd?.Body[0]);
  }, [itemMasterDataList, listHeaderData]);
  // Optional: Function to attach event handlers after initialization
  const handleGridReady = useCallback((grid: TGrid) => {
    const G = grid as any;
    G.OnValueChanged = (grid: TGrid, row: TRow, col: string, val: any) => {
      console.log(`Cell ${col} updated to:`, val);
    };
  }, []);

  // Initialize the grid using the dedicated hook
  const gridInstance = useTreeGridInit(
    "ScenarioGrid",
    layout,
    data,
    handleGridReady,
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: theme.palette.brand.background,
      }}
    >
      <ActionHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setOpenRequestModal={setOpenRequestModal}
        setShowFilesModal={setShowFilesModal}
      />

      <Box sx={{ display: "flex", position: "relative" }}>
        {/* <MainContentContainer hasFilter={true}> */}
        {openReqestModal && (
          <RequestsModal
            onClose={setOpenRequestModal}
            targetModule={"item_master"}
          />
        )}
        {/* </MainContentContainer> */}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          p: 2,
        }}
      >
        <Box
          id="ScenarioGrid"
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <AppSnackbar
        snackbar={snackbar}
        onClose={() => setSnackbar({ message: null, severity: "info" })}
      />
      {showLoader && <LoaderOverlay />}
    </Box>
  );
};

export default ItemsMasterPage;
