import LoaderOverlay from "@/components/common/loader";
import CommentSidebar from "@/components/common/loader/comment-sidebar";
import MainContentContainer from "@/components/common/main-content-container";
import RequestSuccessDialog from "@/components/common/request-notification";
import RequestsModal from "@/components/common/requests-modal";
import FileDetailsModal from "@/components/file-detail-modal";
import { FILE_FILTER_OPTIONS } from "@/constants/file-modal.constants";
import { useGetExportedFile } from "@/services/queries/common/common.queries";
import {
  useAddBulkInsertAdminRequest,
  useDeleteItemMasterRow,
  useExportItemMasterRow,
  useListComments,
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master/item-master.queries";
import { useToastStore } from "@/store/useToastStore";
import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { handleEditCellAdminRequest } from "./actions/editItemMasterAdmin";
import { handleDeleteSelection } from "./actions/handleDeleteSelection";
import { useHandleGridEditConfirm } from "./actions/handleGridEditConfirm";
import { handleItemMasterExport } from "./actions/handleItemMasterExport";
import type { SnackbarState } from "./components/columns-dropdown";
import DetailView from "./components/detail-view";
import { DetailsModal } from "./components/detail-view-modal";
import Filter from "./components/filter";
import TableSavePopover from "./components/table-save-popover";
import {
  addColumn,
  hideColumn,
  showColumn,
} from "./components/tree-grid/Columns/Columns";
import { focusCell, focusRow } from "./components/tree-grid/focus/FocusEvents";
import CompleteUploadFlow from "./components/upload-csv";
import { page_size_item_master } from "./constants/itemmaster.constants";
import { INITIAL_HEADERS } from "./constants/tableHeaders.constants";
import { hasItemMasterPrivileges } from "./helpers/itemMasterHelpers";
import { convertSavedFilter } from "./helpers/itemMasterTreeGridHelperFunction";
import { useItemsMasterGridData } from "./hooks/useItemsMasterGridData";
import { useItemsMasterGridEvents } from "./hooks/useItemsMasterGridEvents";
import type { HeaderList, OpenPanel, TreeGridState } from "./types/types";

const ItemsMasterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Record<string, string[]>>({});
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [openReqestModal, setOpenRequestModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [, setSnackbar] = useState<SnackbarState>({
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
  const privileges: {} = JSON.parse(localStorage.getItem("privileges") || "{}");
  const [headerLabels, setHeaderLabels] = useState<string[]>([]);
  const [saveFilter, setSaveFilter] = useState(false);
  const { showToast } = useToastStore();
  const [state, setState] = useState<TreeGridState>({
    showSavePopover: false,
    popoverPosition: { top: 0, left: 0 },
    changedCell: null,
  });
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [detailedViewId, setDetailedViewId] = useState<string>("");
  const [isDetailViewModalOpen, setIsDetailViewModalOpen] = useState(false);
  const { handleGridEditConfirm } = useHandleGridEditConfirm();

  const [
    requestSuccessNotficationVisible,
    setRequestSuccessNotficationVisible,
  ] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);

  const {
    data: itemMasterDataList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isItemsLoading,
  } = useListItems({
    search: debouncedSearchQuery,
    page_size: page_size_item_master,
    filter: filter,
  });

  const { data: listHeaderData, isLoading: isListHeadersLoading } =
    useListHeaders({
      page_size: 10000,
      search: "",
      skip: 0,
      filter: filter,
    });

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
  const { hasEditItemMasterPrivilege } = hasItemMasterPrivileges(privileges);
  const {
    mutate: itemMasterBulkInsertAdminApproval,
    isPending: isitemMasterBulkInsertAdminApprovalPending,
  } = useAddBulkInsertAdminRequest();
  const { mutateAsync: listComments, isPending: isCommentListingPending } =
    useListComments();

  // Grid logic and layout
  const { gridInstance, isSearchReplaceRef } = useItemsMasterGridData({
    gridId,
    containerId,
    itemMasterDataList,
    listHeaderData,
    debouncedSearchQuery,
    filter,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // Grid Events
  useItemsMasterGridEvents({
    gridId,
    setFilter,
    setSelectedRows,
    setState,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  useEffect(() => {
    setShowLoader(
      isItemsLoading ||
        isFetchingNextPage ||
        itemMasterExportRowPending ||
        isDownloadExportPending ||
        isListHeadersLoading ||
        deleteItemMasterRowPending ||
        isitemMasterBulkInsertAdminApprovalPending,
    );
  }, [
    isItemsLoading,
    isFetchingNextPage,
    isListHeadersLoading,
    itemMasterExportRowPending,
    isDownloadExportPending,
    deleteItemMasterRowPending,
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
      initial[h.label] = INITIAL_HEADERS.includes(h.label);
    });
    setSelectedColumns(initial);
  }, [headerList]);

  useEffect(() => {
    if (!gridInstance?.current) return;
    const lastCol = headerLabels[headerLabels.length - 1];
    if (!lastCol) return;
    addColumn(gridInstance.current, lastCol);
  }, [headerLabels, gridInstance]);

  useEffect(() => {
    if (state.showSavePopover && gridInstance?.current) {
      gridInstance.current.Focus(null as any, null as any);
    }
  }, [state.showSavePopover, gridInstance]);

  const handleSkuUpcClick = useCallback(
    (rowId: string, _col: string, _value: any) => {
      const Grid = gridInstance?.current;
      if (Grid) {
        const gridRow = Grid.GetRowById(rowId);
        if (!gridRow || gridRow.Kind !== "Data") return;
      }
      setOpenPanel((prev) => {
        setDetailedViewId(rowId);
        return prev !== "detail-view" ? "detail-view" : prev;
      });
    },
    [gridInstance],
  );

  const handleSkuUpcClickRef = useRef(handleSkuUpcClick);

  useEffect(() => {
    handleSkuUpcClickRef.current = handleSkuUpcClick;
  });

  useEffect(() => {
    (window as any).onSkuUpcClick = (
      rowId: string,
      col: string,
      value: any,
    ) => {
      handleSkuUpcClickRef.current(rowId, col, value);
    };
    return () => {
      delete (window as any).onSkuUpcClick;
    };
  }, []);

  useEffect(() => {
    (window as any).Grids = (window as any).Grids || {};
    const prev = window.Grids.OnGetHtmlValue;

    window.Grids.OnGetHtmlValue = (grid: any, row: any, col: any, val: any) => {
      if (grid.id !== gridId || row?.Kind === "Header") {
        return prev ? prev(grid, row, col, val) : val;
      }

      if ((col === "SKU" || col === "UPC") && val) {
        const safeVal = String(val).replace(/"/g, "&quot;");
        return `<a 
        href="javascript:void(0)" 
        onclick="window.onSkuUpcClick('${row.id}', '${col}', '${safeVal}')"
        style="color: inherit; text-decoration: underline; cursor: pointer;"
      >${safeVal}</a>`;
      }
      return prev ? prev(grid, row, col, val) : val;
    };

    return () => {
      if (prev) window.Grids.OnGetHtmlValue = prev;
      else delete (window as any).Grids.OnGetHtmlValue;
    };
  }, [gridId]);

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

  const onCellEditConfirm = (
    row: TRow,
    col: string,
    value: string,
    oldValue: string,
    comment?: string,
  ) => {
    handleGridEditConfirm({
      row,
      col,
      value,
      oldValue,
      comment,
      hasEditItemMasterPrivilege,
      confirm,
      gridInstance,
      itemMasterDataList,
      itemMasterBulkInsertAdminApproval,
      setShowLoader,
      setRequestSuccessNotficationVisible,
      showToast,
      handleEditCellAdminRequest,
    });
  };

  const handleEditSave = () => {
    if (!state.changedCell) return;
    if (comment.trim().length === 0) return;
    const { row, col, value, oldValue } = state.changedCell;
    onCellEditConfirm?.(row, col, value, oldValue, comment);
    setState((prev) => ({
      ...prev,
      showSavePopover: false,
      changedCell: null,
    }));
    setCommentAdded(false);
  };

  const handleEditCancel = () => {
    if (!state.changedCell) return;
    const { row, col, oldValue } = state.changedCell;
    const Grid = gridInstance?.current;
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
    if (check) showColumn(gridInstance?.current, label);
    else hideColumn(gridInstance?.current, label);
  };

  const handleClearAllFilters = useCallback(() => {
    const Grid = gridInstance?.current;
    if (Grid) Grid.ChangeFilter("", "", "", 0 as any, 0 as any);
    setFilter({});
  }, [gridInstance]);

  const applySavedFilterToFilterRow = (filter: Record<string, string[]>) => {
    const Grid = gridInstance?.current;
    if (!Grid) return;
    const { cols, values, operators } = convertSavedFilter(filter);
    Grid.ChangeFilter(cols, values, operators, false as any, false as any);
  };

  const handleCommentSelect = (comment: any) => {
    const id = comment.item_id;
    const Grid = gridInstance?.current;
    if (comment.comment_type === "row") focusRow(Grid, id);
    else if (comment.comment_type === "field")
      focusCell(Grid, id, comment.field_key);
  };

  const handleExpandClick = useCallback(
    () => setIsDetailViewModalOpen(true),
    [],
  );
  const togglePanel = useCallback(
    (panel: OpenPanel) =>
      setOpenPanel((prev) => (prev === panel ? null : panel)),
    [],
  );

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
      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setOpenRequestModal={setOpenRequestModal}
        setShowFilesModal={setShowFilesModal}
        onImportClick={() => setShowUploadFlow(true)}
        selectedRows={selectedRows}
        onHandleExport={handleExport}
        setSelectedExport={setSelectedExport}
        deleteSelection={onDeleteSelection}
        headerList={headerLabels}
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
        onToggleDrawer={() => togglePanel("comments")}
        setSnackbar={setSnackbar}
      />

      {isDetailViewModalOpen && (
        <DetailsModal
          isOpen={isDetailViewModalOpen}
          onClose={() => setIsDetailViewModalOpen(false)}
          timelineTitle={"Timeline"}
          item_id={detailedViewId}
        />
      )}

      {openReqestModal && (
        <RequestsModal
          onClose={setOpenRequestModal}
          targetModule="item_master"
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

      <Box sx={{ display: "flex", position: "relative", padding: 2 }}>
        <MainContentContainer hasFilter={true}>
          <Box sx={{ flex: 1, padding: 2, minWidth: 0 }}>
            <Box
              id={containerId}
              sx={{ width: "100%", height: "calc(100vh - 144px)" }}
            />
          </Box>
        </MainContentContainer>

        <Box
          sx={{
            width: openPanel === "comments" ? 300 : 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
            height: "calc(100vh - 147px)",
            marginLeft: openPanel === "comments" ? 1 : 0,
            background: "white",
            color: "black",
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px 0 0 8px",
          }}
        >
          {openPanel === "comments" && (
            <CommentSidebar
              isOpen={openPanel}
              onClose={() => setOpenPanel(null)}
              listComments={listComments}
              isLoading={isCommentListingPending}
              onCommentSelect={handleCommentSelect}
            />
          )}
        </Box>

        <Box
          sx={{
            width: openPanel === "detail-view" ? 406 : 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
            height: "calc(100vh - 147px)",
            marginLeft: openPanel === "detail-view" ? 1 : 0,
            background: "white",
            color: "black",
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px 0 0 8px",
          }}
        >
          {openPanel === "detail-view" && (
            <DetailView
              item_id={detailedViewId}
              timelineTitle={"Timeline"}
              onClose={() => setOpenPanel(null)}
              onExpandClick={handleExpandClick}
            />
          )}
        </Box>
      </Box>

      {showLoader && <LoaderOverlay />}

      <CompleteUploadFlow
        open={showUploadFlow}
        onClose={() => setShowUploadFlow(false)}
        onImportComplete={() => {}}
        onViewLog={() => {}}
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
