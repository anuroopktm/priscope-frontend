import { Box } from "@mui/material";
// import { ActionHeader } from "../scenario-builder/components/ActionHeader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoaderOverlay from "@/components/common/loader";
import RequestsModal from "@/components/common/requests-modal";
import {
  useAddBulkInsertAdminRequest,
  useCreateItemMasterComment,
  useDeleteItemMasterRow,
  useExportItemMasterRow,
  useListComments,
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master/item-master.queries";
import { useDebounce } from "../../hooks/useDebounce";
import { onScroll } from "./components/tree-grid/scroll/ScrollHandler";
import CompleteUploadFlow from "./components/upload-csv";
import { page_size_item_master } from "./constants/itemmaster.constants";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  convertSavedFilter,
  getItemMasterLayout,
} from "./helpers/itemMasterTreeGridHelperFunction";
import type {
  TreeGridBody,
  TreeGridHeader,
  TreeGridLayout,
} from "./helpers/types";
import { useTreeGridInit } from "./hooks/use-tree-grid-init";
import { handleFilterChange } from "./components/tree-grid/Filter/FilterChange";
import { handleSelected } from "./components/tree-grid/RowSelection/RowSelection";
import { useGetExportedFile } from "@/services/queries/common/common.queries";
import { handleValueChanged } from "./components/tree-grid/CellValue/handleValueChanged";
import TableSavePopover from "./components/table-save-popover";
import {
  createItemMasterCommentPayload,
  hasItemMasterPrivileges,
} from "./helpers/itemMasterHelpers";
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
import CommentSidebar from "@/components/common/loader/comment-sidebar";
import { focusCell, focusRow } from "./components/tree-grid/focus/FocusEvents";
import DetailView from "./components/detail-view";
import { DetailsModal } from "./components/detail-view-modal";
import MainContentContainer from "@/components/common/main-content-container";
import { useHandleGridEditConfirm } from "./actions/handleGridEditConfirm";
import type { HeaderList, OpenPanel, TreeGridState } from "./types/types";
import { useHandleEditPopover } from "./hooks/useHandleEditPopover";
import { useSkuUpcClickable } from "./hooks/useSkuUpcClickable";
import { ActionHeader } from "./components/header/ActionHeader";
import { handleRightClick } from "./components/tree-grid/CellValue/handleRightClick";
import { COMMENT_TYPE } from "@/constants/comments.constants";
import CommentsModal from "@/components/common/comment-modal";

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
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [detailedViewId, setDetailedViewId] = useState<string>("");
  const [isDetailViewModalOpen, setIsDetailViewModalOpen] = useState(false);
  const [onSubmitComment, setOnSubmitComment] = useState<
    ((comment: string) => void) | null
  >(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const { handleGridEditConfirm } = useHandleGridEditConfirm();
  const [isAdding, setIsAdding] = useState(false);

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
    // isError: isListItemsError,
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

  const { hasEditItemMasterPrivilege } = hasItemMasterPrivileges(privileges);

  const {
    mutate: itemMasterBulkInsertAdminApproval,
    isPending: isitemMasterBulkInsertAdminApprovalPending,
  } = useAddBulkInsertAdminRequest();

  const { mutateAsync: listComments, isPending: isCommentListingPending } =
    useListComments();

  const { mutateAsync: createComment, isPending: createCommentPending } =
    useCreateItemMasterComment();

  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);

  useEffect(() => {
    window.TGSetEvent("OnScroll", gridId, onHandleScroll);
    window.TGSetEvent("OnSelected", gridId, onSelected);
    window.TGSetEvent("OnFilter", gridId, onHandleFilterChange);
    window.TGSetEvent("OnValueChanged", gridId, onHandleValueChanged);
    window.TGSetEvent("OnRightClick", gridId, onHandleRightClick);
    return () => {
      window.TGDelEvent("OnSelected", gridId);
      window.TGDelEvent("OnScroll", gridId);
      window.TGDelEvent("OnFilter", gridId);
      window.TGSetEvent("OnValueChanged", gridId);
      window.TGDelEvent("OnRightClick", gridId);
    };
  }, []);

  useEffect(() => {
    setShowLoader(
      isItemsLoading ||
        isFetchingNextPage ||
        itemMasterExportRowPending ||
        isDownloadExportPending ||
        createCommentPending ||
        isListHeadersLoading ||
        // isBulkInsertPending ||
        deleteItemMasterRowPending ||
        itemMasterExportRowPending ||
        isitemMasterBulkInsertAdminApprovalPending,
    );
  }, [
    isItemsLoading,
    isFetchingNextPage,
    createCommentPending,
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
      gridInstance.current.Focus(undefined, undefined);
    }
  }, [state.showSavePopover]);

  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
  }, [hasNextPage]);

  useEffect(() => {
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

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

  const handleGridReady = useCallback(() => {
    console.log("handleGridReady");
  }, []);

  const gridInstance = useTreeGridInit(
    gridId,
    containerId,
    layout,
    data,
    handleGridReady,
  );

  const handleSkuUpcClick = (rowId: string) => {
    const Grid = gridInstance.current;
    if (Grid) {
      const gridRow = Grid.GetRowById(rowId);
      if (!gridRow || gridRow.Kind !== "Data") return;
    }
    setOpenPanel((prev) => {
      setDetailedViewId(rowId);
      if (prev !== "detail-view") {
        return "detail-view";
      }
      return prev;
    });
  };

  const handleSkuUpcClickRef =
    useRef<(rowId: string, col: string, value: any) => void>(handleSkuUpcClick);

  // useEffect(() => {
  // });
  useEffect(() => {
    handleSkuUpcClickRef.current = handleSkuUpcClick;
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

  useSkuUpcClickable({
    gridId,
    onSkuClick: handleSkuUpcClick,
    onUpcClick: handleSkuUpcClick,
  });

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

  const onHandleScroll = (grid: TGrid, vpos: number) => {
    onScroll(grid, vpos, gridId, 200, handleLoadMore);
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

  const handleLoadMore = () => {
    if (hasNextPageRef.current && !isFetchingNextPageRef.current) {
      fetchNextPage();
    }
  };

  const addRowsToGrid = (newRows: any[]) => {
    const Grid = gridInstance.current;
    if (!Grid) return;
    if (!Grid || !newRows?.length) return;

    newRows.forEach((rowData) => {
      const newRow = Grid.AddRow(undefined, undefined, 7, rowData.id);
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

  const handleUploadComplete = (data: any) => {
    console.log("Import completed:", data);
  };

  const handleViewLog = () => {
    console.log("View log clicked");
  };

  const onSelected = (grid: TGrid) => {
    handleSelected(grid, setSelectedRows);
  };

  const { handleEditSave, handleEditCancel } = useHandleEditPopover({
    state,
    comment,
    setState,
    setCommentAdded,
    gridInstance,
    onCellEditConfirm,
  });

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

  const handleCommentSelect = (comment: any) => {
    const id = comment.item_id;
    const Grid = gridInstance.current;
    if (comment.comment_type === "row") {
      focusRow(Grid, id);
    } else if (comment.comment_type === "field") {
      const fieldKey = comment.field_key;
      focusCell(Grid, id, fieldKey);
    }
  };

  const handleExpandClick = useCallback(() => {
    setIsDetailViewModalOpen(true);
  }, []);

  const togglePanel = useCallback((panel: OpenPanel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);
  const handleConfirmComment = (
    type: string,
    id: string,
    col: string,
    comment: string,
  ) => {
    const payload = createItemMasterCommentPayload(type, col, comment);

    if (!payload) {
      console.error("Invalid comment type");
      return;
    }

    setShowLoader(true);

    createComment(
      { itemMasterId: id, payload },
      {
        onSettled: () => {
          setShowLoader(false);
        },
        onSuccess: () => {
          showToast("Comment added successfully", "success");
        },
        onError: () => {
          showToast("Failed to add comment", "error");
        },
      },
    );
  };

  const onClickCellComment = (grid: TGrid, row: TRow, col: string) => {
    setOnSubmitComment(() => (comment: string) => {
      const id = row?.id || "";
      handleConfirmComment(COMMENT_TYPE.CELL, id, col, comment);
    });
    setShowCommentModal(true);
  };

  const onHandleRightClick = handleRightClick(gridId, [
    {
      name: "Comment on this cell",
      onClick: onClickCellComment,
    },
  ]);

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
        onToggleDrawer={() => togglePanel("comments")}
      />
      {isDetailViewModalOpen && (
        <DetailsModal
          isOpen={isDetailViewModalOpen}
          onClose={() => setIsDetailViewModalOpen(false)}
          timelineTitle={"Timeline"}
          item_id={detailedViewId}
        />
      )}
      {showCommentModal && (
        <CommentsModal
          onSubmit={onSubmitComment}
          onClose={() => setShowCommentModal(false)}
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
          showToast={showToast}
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
        onImportComplete={handleUploadComplete}
        onViewLog={handleViewLog}
        showToast={showToast}
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
