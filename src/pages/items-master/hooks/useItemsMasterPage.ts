import { useDebounce } from "@/hooks/useDebounce";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { handleEditCellAdminRequest } from "../actions/editItemMasterAdmin";
import { handleDeleteSelection } from "../actions/handleDeleteSelection";
import { useHandleGridEditConfirm } from "../actions/handleGridEditConfirm";
import { handleItemMasterExport } from "../actions/handleItemMasterExport";
import {
  addColumn,
  hideColumn,
  showColumn,
} from "../components/tree-grid/Columns/Columns";
import { focusCell, focusRow } from "../components/tree-grid/focus/FocusEvents";
import { page_size_item_master } from "../constants/itemmaster.constants";
import { INITIAL_HEADERS } from "../constants/tableHeaders.constants";
import { hasItemMasterPrivileges } from "../helpers/itemMasterHelpers";
import { convertSavedFilter } from "../helpers/itemMasterTreeGridHelperFunction";
import { useItemsMasterUIStore } from "../store/useItemsMasterUIStore";
import type { HeaderList, OpenPanel, TreeGridState } from "../types/types";
import { useItemsMasterGridData } from "./useItemsMasterGridData";
import { useItemsMasterGridEvents } from "./useItemsMasterGridEvents";

export const useItemsMasterPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    showLoader,
    setShowLoader,
    selectedRows,
    setSelectedRows,
    selectedExport,
    setSelectedExport,
    openPanel,
    setOpenPanel,
    detailedViewId,
    setDetailedViewId,
    setIsDetailViewModalOpen,
    setShowFilesModal,
    setShowUploadFlow,
    setRequestSuccessNotficationVisible,
  } = useItemsMasterUIStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { showToast } = useToastStore();
  const privileges = JSON.parse(localStorage.getItem("privileges") || "{}");
  const { hasEditItemMasterPrivilege } = hasItemMasterPrivileges(privileges);

  const [headerLabels, setHeaderLabels] = useState<string[]>([]);
  const [saveFilter, setSaveFilter] = useState(false);
  const [state, setState] = useState<TreeGridState>({
    showSavePopover: false,
    popoverPosition: { top: 0, left: 0 },
    changedCell: null,
  });
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});
  const [comment, setComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);

  const gridId = "items-master";
  const containerId = `TreeGrid_${gridId}`;

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

  const {
    mutate: itemMasterBulkInsertAdminApproval,
    isPending: isitemMasterBulkInsertAdminApprovalPending,
  } = useAddBulkInsertAdminRequest();

  const { mutateAsync: listComments, isPending: isCommentListingPending } =
    useListComments();

  const { handleGridEditConfirm } = useHandleGridEditConfirm();

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
    setShowLoader,
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
    [gridInstance, setOpenPanel, setDetailedViewId],
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

  const onCellEditConfirm = useCallback(
    (
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
    },
    [
      hasEditItemMasterPrivilege,
      gridInstance,
      itemMasterDataList,
      itemMasterBulkInsertAdminApproval,
      setShowLoader,
      setRequestSuccessNotficationVisible,
      showToast,
      handleGridEditConfirm,
    ],
  );

  const handleEditSave = () => {
    if (!state.changedCell) return;
    if (comment.trim().length === 0) return;
    const { row, col, value, oldValue } = state.changedCell;
    onCellEditConfirm(row, col, value, oldValue, comment);
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
  }, [gridInstance, setFilter]);

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
    [setIsDetailViewModalOpen],
  );

  const togglePanel = useCallback(
    (panel: OpenPanel) =>
      setOpenPanel((prev) => (prev === panel ? null : panel)),
    [setOpenPanel],
  );

  return {
    state,
    setState,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    showLoader,
    selectedRows,
    selectedExport,
    setSelectedExport,
    headerLabels,
    setHeaderLabels,
    selectedColumns,
    setSelectedColumns,
    saveFilter,
    setSaveFilter,
    openPanel,
    setOpenPanel,
    detailedViewId,
    setIsDetailViewModalOpen,
    setShowFilesModal,
    setShowUploadFlow,
    setRequestSuccessNotficationVisible,
    handleExport,
    onDeleteSelection,
    handleEditSave,
    handleEditCancel,
    handleColumnVisibility,
    handleClearAllFilters,
    applySavedFilterToFilterRow,
    handleCommentSelect,
    handleExpandClick,
    togglePanel,
    comment,
    setComment,
    commentAdded,
    setCommentAdded,
    containerId,
    listComments,
    isCommentListingPending,
    isSearchReplaceRef,
  };
};
