import { Box } from "@mui/material";
import { ActionHeader } from "../scenario-builder/components/ActionHeader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoaderOverlay from "@/components/common/loader";
import RequestsModal from "@/components/common/requests-modal";
import {
  useAddBulkInsertAdminRequest,
  useDeleteItemMasterRow,
  useEditItemMasterItem,
  useExportItemMasterRow,
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master/item-master.queries";
import { useDebounce } from "../../hooks/useDebounce";
import type { SnackbarState } from "./components/columns-dropdown";
import { onScroll } from "./components/tree-grid/scroll/ScrollHandler";
import CompleteUploadFlow from "./components/upload-csv";
import { page_size_item_master } from "./constants/itemmaster.constants";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  convertSavedFilter,
  getEditCellValueAdminApproval,
  getItemMasterLayout,
} from "./helpers/itemMasterTreeGridHelperFunction";
import type {
  ExportItemMasterRowPayload,
  itemMasterBodyResponseItems,
  itemMasterBodyResponseItemsField,
  TreeGridBody,
  TreeGridHeader,
  TreeGridLayout,
} from "./helpers/types";
import { useTreeGridInit } from "./hooks/use-tree-grid-init";
import { handleFilterChange } from "./components/tree-grid/Filter/FilterChange";
import { handleSelected } from "./components/tree-grid/RowSelection/RowSelection";
import { useGetExportedFile } from "@/services/queries/common/common.queries";
import type { DeleteSelectedRowPayload, HeaderList } from "./types/types";
import { deleteSeletectedRows } from "./components/tree-grid/RowSelection/DeleteRowSelection";
import { handleValueChanged } from "./components/tree-grid/CellValue/handleValueChanged";
import TableSavePopover from "./components/table-save-popover";
import { hasItemMasterPrivileges } from "./helpers/itemMasterHelpers";
import { openConfirmationModal } from "@/utils/getRequestConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";
import RequestSuccessDialog from "@/components/common/request-notification";
import FileDetailsModal from "@/components/file-detail-modal";
import { FILE_FILTER_OPTIONS } from "@/constants/file-modal.constants";
import { INITIAL_HEADERS } from "./constants/tableHeaders.constants";
import {
  showColumn,
  hideColumn,
  addColumn,
} from "./components/tree-grid/Columns/Columns";
import { handleItemMasterExport } from "./actions/handleItemMasterExport";
import { useToastStore } from "@/store/useToastStore";
import { handleEditCellAdminRequest } from "./actions/editItemMasterAdmin";
import { handleDeleteSelection } from "./actions/handleDeleteSelection";

export interface TreeGridState {
  showSavePopover: boolean;
  popoverPosition: { top: number; left: number };
  changedCell: {
    row: TRow;
    col: string;
    value: any;
    oldValue: any;
  } | null;
}
const ItemsMasterPage = () => {
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
  const [showLoader, setShowLoader] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: null,
    severity: "info",
  });
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const gridId = "items-master";
  const containerId = `TreeGrid_${gridId}`;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedExport, setSelectedExport] = useState(false);
  const [comment, setComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);
  const privileges: {} = JSON.parse(localStorage.getItem("privileges") || "");
  const [headerLabels, setHeaderLabels] = useState<string[]>([]);
  const [saveFilter, setSaveFilter] = useState(false);
  const prevFilterRef = useRef<string>("");
  const { showToast } = useToastStore();
  const [state, setState] = useState<TreeGridState>({
    showSavePopover: false,
    popoverPosition: { top: 0, left: 0 },
    changedCell: null,
  });
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});

  const [
    requestSuccessNotficationVisible,
    setRequestSuccessNotficationVisible,
  ] = useState(false);

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

  const { data: listHeaderData, isLoading: isListHeadersLoading } =
    useListHeaders({ page_size: 10000, search: "", skip: 0, filter: filter });

  const {
    mutate: itemMasterExportRowMutate,
    isPending: itemMasterExportRowPending,
  } = useExportItemMasterRow();

  const {
    mutate: DownloadExportFile = () => {},
    isPending: isDownloadExportPending = false,
  } = useGetExportedFile() ?? {};

  const { mutate: deleteItemMasterRow, isPending: deleteItemMasterRowPending } =
    useDeleteItemMasterRow();
  const { mutateAsync: mutateItemMasterItem } = useEditItemMasterItem();

  const queryClient = useQueryClient();

  const { hasEditItemMasterPrivilege, hasAddItemMasterPrivilege } =
    hasItemMasterPrivileges(privileges);

  const {
    mutate: itemMasterBulkInsertAdminApproval,
    isPending: isitemMasterBulkInsertAdminApprovalPending,
  } = useAddBulkInsertAdminRequest();

  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);

  useEffect(() => {
    window.TGSetEvent("OnScroll", gridId, onHandleScroll);
    window.TGSetEvent("OnSelected", gridId, onSelected);
    window.TGSetEvent("OnFilter", gridId, onHandleFilterChange);
    window.TGSetEvent("OnValueChanged", gridId, onHandleValueChanged);
    // window.Grids.OnRightClick = handleRightClick;
    return () => {
      window.TGDelEvent("OnSelected", gridId);
      window.TGDelEvent("OnScroll", gridId);
      window.TGDelEvent("OnFilter", gridId);
      window.TGSetEvent("OnValueChanged", gridId);

      // if (window.Grids?.OnRightClick === handleRightClick) {
      //   delete window?.Grids?.OnRightClick;
      // }
    };
  }, []);
  useEffect(() => {
    setShowLoader(
      isItemsLoading ||
        isFetchingNextPage ||
        itemMasterExportRowPending ||
        isDownloadExportPending ||
        // createCommentPending ||
        isListHeadersLoading ||
        // isBulkInsertPending ||
        deleteItemMasterRowPending ||
        itemMasterExportRowPending ||
        isitemMasterBulkInsertAdminApprovalPending,
    );
  }, [
    isItemsLoading,
    isFetchingNextPage,
    // createCommentPending,
    isListHeadersLoading,
    itemMasterExportRowPending,
    isDownloadExportPending,
    // isBulkInsertPending,
    deleteItemMasterRowPending,
    itemMasterExportRowPending,
    isitemMasterBulkInsertAdminApprovalPending,
  ]);

  useEffect(() => {
    if (!listHeaderData?.headers) return;
    setHeaderLabels(listHeaderData.headers.map((h) => h.label));
  }, [listHeaderData]);

  const headerList = useMemo<HeaderList[]>(() => {
    if (!listHeaderData?.headers) return [];
    return listHeaderData.headers.map((header) => ({
      name: header.name,
      label: header.label,
      data_type: header.data_type,
    }));
  }, [listHeaderData]);

  useEffect(() => {
    if (!headerList) return;
    const initial: Record<string, boolean> = {};
    headerList.forEach((h) => {
      if (INITIAL_HEADERS.includes(h.label)) {
        initial[h.label] = true;
      } else {
        initial[h.label] = false;
      }
    });
    setSelectedColumns(initial);
    // setSelectedColumnsForAdd(initial);
  }, [headerList]);

  useEffect(() => {
    if (!gridInstance.current) return;
    const lastCol = headerLabels[headerLabels.length - 1];
    if (!lastCol) return;
    addColumn(gridInstance.current, lastCol);
  }, [headerLabels]);

  useEffect(() => {
    if (prevSearchQueryRef.current !== debouncedSearchQuery) {
      prevSearchQueryRef.current = debouncedSearchQuery;

      if (!isInitialLoadRef.current) {
        isSearchReplaceRef.current = true;
      }
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    console.log("filter in mian", filter);
    const filterString = JSON.stringify(filter);

    if (prevFilterRef.current !== filterString) {
      prevFilterRef.current = filterString;

      if (!isInitialLoadRef.current) {
        isSearchReplaceRef.current = true;
      }
    }
  }, [filter]);

  useEffect(() => {
    if (state.showSavePopover && gridInstance.current) {
      gridInstance.current.Focus(null, null);
    }
  }, [state.showSavePopover]);

  const handleExport = () => {
    handleItemMasterExport({
      selectedExport,
      selectedRows,
      setShowLoader,
      showToast,
      gridInstance,
      setSelectedRows,
      setSelectedExport,
      itemMasterExportRowMutate,
      DownloadExportFile,
    });
  };
  const onHandleValueChanged = (
    grid: TGrid,
    row: TRow,
    col: string,
    val: string,
    oldval: string,
    // enableEditPopover: boolean,
  ) => {
    handleValueChanged(grid, row, col, val, oldval, gridId, setState);
  };

  const onHandleFilterChange = (grid: TGrid) => {
    handleFilterChange(grid, setFilter);
  };

  const onHandleScroll = (grid: TGrid, hpos: number, vpos: number) => {
    onScroll(grid, hpos, vpos, gridId, 200, handleLoadMore);
  };

  const onDeleteSelection = () => {
    handleDeleteSelection({
      selectedRows,
      deleteItemMasterRow,
      gridInstance,
      setSelectedRows,
      setShowLoader,
      showToast,
    });
  };

  const handleGridEditConfirm = async (
    row: TRow,
    col: string,
    value: string,
    oldValue: string,
    comment?: string | null,
  ) => {
    if (value === oldValue) return;
    if (!hasEditItemMasterPrivilege) {
      const result = await openConfirmationModal("edit", confirm);
      if (result) {
        handleEditCellAdminRequest({
          row,
          col,
          value,
          oldValue,
          comment,
          itemMasterDataList,
          itemMasterBulkInsertAdminApproval,
          setShowLoader,
          setRequestSuccessNotficationVisible,
          showToast,
        });
      } else {
        const Grid = gridInstance.current;
        if (Grid) {
          const gridRow = Grid.GetRowById(row.id);
          if (gridRow) Grid.SetValue(gridRow, col, oldValue, 1);
        }
      }
      return;
    }
    const item_id = row?.id;
    if (!item_id) return;
    const allItems: itemMasterBodyResponseItems[] =
      itemMasterDataList?.pages.flatMap((page) => page.items) || [];
    const finalPayload: itemMasterBodyResponseItems | undefined = allItems.find(
      (item: any) => item.id === item_id,
    );
    if (!finalPayload) return;
    if (finalPayload.attributes?.[col]) {
      finalPayload.attributes[col].value = value;
    } else if (
      typeof (finalPayload as any)[col] === "object" &&
      (finalPayload as any)[col]?.value !== undefined
    ) {
      (
        finalPayload as unknown as Record<
          string,
          itemMasterBodyResponseItemsField
        >
      )[col].value = value;
    } else {
      // Plain primitive field
      (finalPayload as any)[col] = value;
    }
    const commentsPayload =
      comment && comment.trim().length > 0
        ? [
            {
              comment_type: "field",
              item_field_key: col,
              comment: comment,
            },
          ]
        : undefined;
    const finalPayloadWithMetadata = {
      data: finalPayload,
      comments: commentsPayload,
    };
    setShowLoader(true);
    mutateItemMasterItem(
      { item_id, payload: finalPayloadWithMetadata },
      {
        onSuccess: () => {
          setShowLoader(false);
          showToast("Item updated successfully!", "success");
          queryClient.invalidateQueries({ queryKey: ["item-master-history"] });
        },
        onError: () => {
          setShowLoader(false);
          showToast("Failed to save changes. Please try again.", "warning");
        },
      },
    );
  };
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const addRowsToGrid = (newRows: any[]) => {
    const Grid = gridInstance.current;
    if (!Grid) return;
    if (!Grid || !newRows?.length) return;

    newRows.forEach((rowData) => {
      const newRow = Grid.AddRow(null, null, 7, rowData.id);
      if (!newRow) return;

      Object.entries(rowData).forEach(([key, value]) => {
        if (key === "id") return;
        if (key === "Color") return;
        if (value === undefined) return;

        Grid.SetValue(newRow, key, value, 1);
      });

      Grid.RefreshRow(newRow);
    });

    Grid.Update();
    // gridInstance.current?.setLoading(false);
  };

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

    // const Grid = gridInstance?.current?.getGridInstance();
    const Grid = gridInstance?.current;
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

      // gridInstance.current?.setLoading(false);
      if (isFetchingNextPage) return;
      if (!hasNextPage) return;
      fetchNextPage();

      isSearchReplaceRef.current = false;
      return;
    }

    /**  3. INFINITE SCROLL (append rows) */
    const lastPage = pages[pages.length - 1];
    const newItems = lastPage?.items ?? [];

    const dataToAdd = buildItemMasterTreeGridBody(newItems);
    addRowsToGrid(dataToAdd?.Body[0]);
  }, [itemMasterDataList, listHeaderData]);

  const handleGridReady = useCallback((grid: TGrid) => {
    console.log("handleGridReady");
  }, []);

  const handleUploadComplete = (data: any) => {
    console.log("Import completed:", data);
  };

  const handleViewLog = () => {
    console.log("View log clicked");
  };

  const gridInstance = useTreeGridInit(
    gridId,
    containerId,
    layout,
    data,
    handleGridReady,
  );

  const onSelected = (grid: TGrid) => {
    handleSelected(grid, setSelectedRows);
  };

  const handleEditSave = () => {
    if (!state.changedCell) return;
    if (comment.trim().length === 0) {
      return;
    }
    const { row, col, value, oldValue } = state.changedCell;

    handleGridEditConfirm?.(row, col, value, oldValue, comment);
    setState((prev) => ({
      ...prev,
      showSavePopover: false,
      changedCell: null,
    }));
    setCommentAdded(false);
  };

  const handleEditCancel = () => {
    if (!state.changedCell) return;
    const { row, col, value, oldValue } = state.changedCell;
    const Grid = gridInstance.current;
    if (Grid) {
      const gridRow = Grid.GetRowById(row.id);
      if (gridRow) Grid.SetValue(gridRow, col, oldValue, 1);
    }
    setState((prev) => ({
      ...prev,
      showSavePopover: false,
      changedCell: null,
    }));
  };

  const handleColumnVisibility = (label: string, check: boolean) => {
    if (check) {
      showColumn(gridInstance.current, label);
    } else {
      hideColumn(gridInstance.current, label);
    }
  };

  const handleClearAllFilters = useCallback(() => {
    const Grid = gridInstance.current;
    if (Grid) {
      Grid.ChangeFilter("", "", "", 0, 0);
    }
    setFilter({});
  }, []);

  const applySavedFilterToFilterRow = (filter: Record<string, string[]>) => {
    const Grid = gridInstance.current;
    if (!Grid) return;
    const { cols, values, operators } = convertSavedFilter(filter);
    Grid.ChangeFilter(cols, values, operators, false, false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "brand.background",
      }}
    >
      <ActionHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setOpenRequestModal={setOpenRequestModal}
        setShowFilesModal={setShowFilesModal}
        onImportClick={() => setShowUploadFlow(true)}
        selectedRows={selectedRows}
        onHandleExport={handleExport}
        setSelectedExport={setSelectedExport}
        handleDeleteSelection={onDeleteSelection}
        headerLabels={headerLabels}
        setHeaderLabels={setHeaderLabels}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        handleColumnVisibility={handleColumnVisibility}
        saveFilter={saveFilter}
        setSaveFilter={setSaveFilter}
        filter={filter}
        saveFilterJson={setFilter}
        onClearAllFilters={handleClearAllFilters}
        applySavedFilterToFilterRow={applySavedFilterToFilterRow}
      />

      {openReqestModal && (
        <RequestsModal
          onClose={setOpenRequestModal}
          targetModule={"item_master"}
        />
      )}
      {showFilesModal && (
        <FileDetailsModal
          onClose={setShowFilesModal}
          showLoader={setShowLoader}
          showSnackBar={setSnackbar}
          module="item_master"
          filterOptions={FILE_FILTER_OPTIONS}
        />
      )}
      <Box
        sx={{
          flex: 1,
          p: 2,
        }}
      >
        <Box
          id={containerId}
          sx={{
            width: "100%",
            height: "calc(100vh - 144px)",
          }}
        />
      </Box>

      {showLoader && <LoaderOverlay />}
      <CompleteUploadFlow
        open={showUploadFlow}
        onClose={() => setShowUploadFlow(false)}
        onImportComplete={handleUploadComplete}
        onViewLog={handleViewLog}
        setSnackbar={setSnackbar}
        isSearchReplaceRef={isSearchReplaceRef}
      />
      {requestSuccessNotficationVisible && (
        <RequestSuccessDialog
          setNotificationOpen={setRequestSuccessNotficationVisible}
        />
      )}
      {state.showSavePopover && (
        <div
          style={{
            position: "absolute",
            top: state.popoverPosition.top,
            left: state.popoverPosition.left,
            zIndex: 1000,
          }}
        >
          <TableSavePopover
            onSave={() => {
              setCommentAdded(true);
              handleEditSave();
            }}
            onCancel={() => {
              setCommentAdded(false);
              handleEditCancel();
            }}
            setComment={setComment}
            comment={comment}
            commentAdded={commentAdded}
          />
        </div>
      )}
    </Box>
  );
};

export default ItemsMasterPage;
