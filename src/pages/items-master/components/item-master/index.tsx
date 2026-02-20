"use client";
import AppSnackbar from "@/shared/components/action-bar/AppSnackbar";
import CommentsModal from "@/shared/components/comment-modal";
import CommentSidebar from "@/shared/components/comment-sidebar";
import FileDetailsModal from "@/shared/components/file-detail-modal";
import LoaderOverlay from "@/shared/components/loader";
import MainContentContainer from "@/shared/components/main-content-container";
import { FILE_FILTER_OPTIONS } from "@/shared/constants/file-modal.constants";
import { useDebounce } from "@/shared/hooks/useDebounce";
import useTranslation from "@/shared/hooks/useTranslation";
import { useConfirm } from "@/shared/providers/ModalProvider";
import theme from "@/shared/styles/theme";
import { openConfirmationModal } from "@/shared/utils/getRequestConfirmationModal";
import { useTenantId } from "@/shared/utils/getTenantId";
import { Box, Grid, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SnackbarState } from "../../../freight-rate-library/types";
import {
  createItemMasterCommentPayload,
  hasItemMasterPrivileges,
} from "../../helpers/itemMasterHelpers";
import {
  useAddBulkInsertAdminRequest,
  useBulkInsertItems,
  useCreateItemMasterComment,
  usedeleteItemMasterRow,
  useEditItemMasterItem,
  useExportItemMasterRow,
  useListComments,
  useListHeaders,
  useListItems,
} from "../../services/itemMasterService";
import { DeleteSelectedRowPayload, HeaderList } from "../../types";
import ActionCard from "../action-cards/actionCard";
import { CARD_CONFIGS } from "../action-cards/cardConfigs";
import DetailView from "../detail-view";
import { DetailsModal } from "../detail-view-modal";
import Filter from "../filter";
import CompleteUploadFlow from "../upload-csv";
import { itemDetailData } from "./data";
import ItemMasterGrid from "../item-master-grid";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  bulkOrderSkippedRecordFormat,
  convertSavedFilter,
  getDataBulkUploadFormat,
  getDataBulkUploadFormatAdminApproval,
  getEditCellValueAdminApproval,
  getEmptyRowData,
  getItemMasterLayout,
} from "../../helpers/itemMasterTreeGridHelperFunction";
import {
  ExportItemMasterRowPayload,
  itemMasterBodyResponseItems,
  itemMasterBodyResponseItemsField,
  TreeGridBody,
  TreeGridHeader,
  TreeGridLayout,
} from "../../helpers/type";
import AddNewGrid from "../item-master-grid/EmptyGrid";
import {
  TreeGridApi,
  TreeGridInternalApi,
  TreeGridRef,
  TreeGridRow,
} from "@/shared/types/treegrid.types";
import { INITIAL_HEADERS } from "../../constants/tableHeaders.constants";
import { COMMENT_TYPE } from "@/shared/constants/comments.constants";
import { useQueryClient } from "@tanstack/react-query";
import RequestsModal from "@/shared/components/requests-modal";
import { page_size_item_master } from "../../constants/itemmaster.constants";
import { string } from "zod";
import RequestSuccessDialog from "@/shared/components/request-notification";
import { useGetExportedFile } from "@/shared/services/commonService";

type OpenPanel = "comments" | "detail-view" | null;

const ItemMaster = () => {
  const isInitialLoadRef = useRef(true);
  const isSearchReplaceRef = useRef(false);
  const prevSearchQueryRef = useRef<string>("");
  const [layout, setLayout] = useState<TreeGridLayout | null>(null);
  const [data, setData] = useState<TreeGridBody | null>(null);
  const [bulkOrderDataGrid, setbulkOrderDataGrid] =
    useState<TreeGridBody | null>(null);
  const gridRef = useRef<TreeGridRef | null>(null);
  const emptyGridRef = useRef<TreeGridRef | null>(null);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [openReqestModal, setOpenRequestModal] = useState(false);
  const [headers, setHeaders] = useState<string[]>([
    "Id",
    "SKU",
    "Category",
    "Description",
  ]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isDetailViewModalOpen, setIsDetailViewModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});
  const [selectedColumnsForAdd, setSelectedColumnsForAdd] = useState<
    Record<string, boolean>
  >({ SKU: true, Category: true, Description: true });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [onSubmitComment, setOnSubmitComment] = useState<
    ((comment: string) => void) | null
  >(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: null,
    severity: "info",
  });
  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [bulkInsertErrorRows, setBulkInsertErrorRows] = useState<number[]>([]);
  const treeGridHeadersRef = useRef<TreeGridHeader[]>([]);
  const [showLoader, setShowLoader] = useState(false);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [selectedExport, setSelectedExport] = useState(false);
  const [detailedViewId, setDetailedViewId] = useState<string>("");
  const prevFilterRef = useRef<string>("");
  const queryClient = useQueryClient();
  const isGridReady = !!layout && !!data;
  const hasData = !!data?.Body?.[0]?.length;
  const showEmpty = !isGridReady && !isAdding && !hasData && !showLoader;
  const [
    requestSuccessNotficationVisible,
    setRequestSuccessNotficationVisible,
  ] = useState(false);
  const [saveFilter, setSaveFilter] = useState(false);
  const [filter, setFilter] = useState<Record<string, string[]>>({});

  const { mutateAsync: mutateItemMasterItem } = useEditItemMasterItem();
  const { mutate: deleteItemMasterRow, isPending: deleteItemMasterRowPending } =
    usedeleteItemMasterRow();
  const confirm = useConfirm();
  const { t } = useTranslation();
  const tenantId = useTenantId();
  const { data: sessiojnData } = useSession();
  const privileges = sessiojnData?.user?.privileges || {};
  const { mutateAsync: createComment, isPending: createCommentPending } =
    useCreateItemMasterComment();
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

  useEffect(() => {
    if (!listHeaderData?.headers) return;

    const labels = Array.from(
      new Set(listHeaderData.headers.map((header) => header.label)),
    );

    setColumns(labels);
  }, [listHeaderData]);

  const headerList = useMemo<HeaderList[]>(() => {
    if (!listHeaderData?.headers) return [];
    return listHeaderData.headers.map((header) => ({
      name: header.name,
      label: header.label,
      data_type: header.data_type,
    }));
  }, [listHeaderData]);

  const { mutateAsync: lisComments, isPending: isCommentListingPending } =
    useListComments();

  const { mutate: itemMasterBulkInsertMutate, isPending: isBulkInsertPending } =
    useBulkInsertItems();

  const {
    mutate: itemMasterBulkInsertAdminApproval,
    isPending: isitemMasterBulkInsertAdminApprovalPending,
  } = useAddBulkInsertAdminRequest();

  const {
    mutate: itemMasterExportRowMutate,
    isPending: itemMasterExportRowPending,
  } = useExportItemMasterRow();

  const {
    mutate: DownloadExportFile = () => {},
    isPending: isDownloadExportPending = false,
  } = useGetExportedFile() ?? {};

  const { hasEditItemMasterPrivilege, hasAddItemMasterPrivilege } =
    hasItemMasterPrivileges(privileges);

  useEffect(() => {
    if (!gridRef.current) return;
    const lastCol = columns[columns.length - 1];
    if (!lastCol) return;
    // const Grid = gridRef.current.getGridInstance();
    gridRef.current.addColumn(lastCol);
  }, [columns]);

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
    if (!itemMasterDataList || !listHeaderData?.headers.length) return;

    const pages = itemMasterDataList.pages;
    const firstPageItems = pages[0]?.items ?? [];
    const body = buildItemMasterTreeGridBody(firstPageItems);

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

  const resetAddNewGrid = useCallback(() => {
    if (!layout) return;
    const newData = getEmptyRowData(layout?.Cols, 30);
    setbulkOrderDataGrid(newData);
    if (emptyGridRef.current) {
      const Grid =
        emptyGridRef.current.getGridInstance() as TreeGridInternalApi;
      if (!Grid) return;
      Grid.Source.Data.Data = newData;
      delete Grid.Source.Data.Url;
      Grid.ReloadBody();
    }
  }, [layout]);

  const refreshGrid = () => {
    isSearchReplaceRef.current = true;
    queryClient.removeQueries({
      queryKey: ["listItems"],
      exact: false,
    });
  };

  const addRowsToGrid = (newRows: any[]) => {
    const Grid = gridRef.current?.getGridInstance();
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
    gridRef.current?.setLoading(false);
  };

  const handleEditCellAdminRequest = (
    row: TreeGridRow,
    col: string,
    value: string,
    oldValue: string,
    comment?: string | null,
  ) => {
    const item_id = row?.id;
    const allItems: any =
      itemMasterDataList?.pages.flatMap((page) => page.items) || [];
    const finalPayload: itemMasterBodyResponseItems | undefined = allItems.find(
      (item: any) => item.id === item_id,
    );
    const oldPayload = structuredClone(finalPayload);
    if (!finalPayload) return;
    if (finalPayload.attributes?.[col]) {
      finalPayload.attributes[col].value = value;
    } else {
      (finalPayload as unknown as Record<string, unknown>)[col] = value;
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
    const adminRequestEditCellPayload = getEditCellValueAdminApproval(
      finalPayload,
      oldPayload,
      commentsPayload,
    );
    setShowLoader(true);
    if (!adminRequestEditCellPayload) return null;
    itemMasterBulkInsertAdminApproval(adminRequestEditCellPayload, {
      onSuccess: (response) => {
        setShowLoader(false);
        setRequestSuccessNotficationVisible(true);
      },
      onError: (e) => {
        setShowLoader(false);
        setSnackbar({
          message: "Failed to save changes. Please try again.",
          severity: "warning",
        });
      },
    });
  };

  const handleGridEditConfirm = async (
    row: TreeGridRow,
    col: string,
    value: string,
    oldValue: string,
    comment?: string | null,
  ) => {
    if (value === oldValue) return;
    if (!hasEditItemMasterPrivilege) {
      const result = await openConfirmationModal("edit", confirm);
      if (result) {
        handleEditCellAdminRequest(row, col, value, oldValue, comment);
      } else {
        const Grid = gridRef.current?.getGridInstance();
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
          setSnackbar({
            message: "Item updated successfully!",
            severity: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["item-master-history"] });
        },
        onError: () => {
          setShowLoader(false);
          setSnackbar({
            message: "Failed to save changes. Please try again.,",
            severity: "warning",
          });
        },
      },
    );
  };

  useEffect(() => {
    setSelectedRows([]);
  }, [selectAll]);

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
    setSelectedColumnsForAdd(initial);
  }, [headerList]);

  const highlightSkippedRows = (Grid: any) => {
    if (!Grid) return;
    const cols = Grid.GetCols();
    let row = Grid.GetFirst();
    while (row) {
      if (row.__skipped) {
        const nextRow = Grid.GetNext(row);

        cols.forEach((colIndex: number) => {
          Grid.SetBorder(row, colIndex, "2,#d32f2f", 14, 3);

          if (nextRow) {
            Grid.SetBorder(nextRow, colIndex, "2,#d32f2f", 1, 3);
          }
        });
        Grid.RefreshRow(row);
        if (nextRow) Grid.RefreshRow(nextRow);
      }
      row = Grid.GetNext(row);
    }
  };

  const handleAddBulkInsertAdminRequest = () => {
    const newData = emptyGridRef.current?.getDataFromTable();
    if (!newData) return;
    setOnSubmitComment(() => (comment: string) => {
      const formmatedData = getDataBulkUploadFormatAdminApproval(
        newData,
        comment,
      );
      setShowLoader(true);
      itemMasterBulkInsertAdminApproval(formmatedData, {
        onSuccess: (response) => {
          setShowLoader(false);
          setSnackbar({
            message: "Admin request send successfully!",
            severity: "success",
          });
          setIsAdding(false);
        },
        onError: (e) => {
          setShowLoader(false);
          setIsAdding(true);
          setSnackbar({
            message: "Admin request failed!",
            severity: "warning",
          });
        },
      });
    });
    setShowCommentModal(true);
  };
  const handleSave = useCallback(() => {
    const newData = emptyGridRef.current?.getDataFromTable();
    if (!newData || !layout) return;
    const formmatedData = getDataBulkUploadFormat(newData);
    if (!hasAddItemMasterPrivilege) {
      handleAddBulkInsertAdminRequest();
      return;
    }
    (setShowLoader(true),
      itemMasterBulkInsertMutate(formmatedData, {
        onSuccess: (response) => {
          setShowLoader(false);
          const skippedItems = response?.skipped_items ?? [];
          if (skippedItems.length > 0) {
            const cols = treeGridHeadersRef.current;
            const skippedGridData = bulkOrderSkippedRecordFormat(
              skippedItems,
              cols,
            );
            const emptyGridData = getEmptyRowData(layout.Cols, 20);

            const mergedBody = [
              ...(skippedGridData.Body[0] || []),
              ...(emptyGridData.Body[0] || []),
            ];
            if (emptyGridRef.current) {
              const Grid =
                emptyGridRef.current.getGridInstance() as TreeGridInternalApi;
              if (!Grid) return;
              Grid.Source.Data.Data = {
                // Body: [skippedGridData.Body[0] || []],
                Body: [mergedBody],
              };
              delete Grid.Source.Data.Url;
              Grid.ReloadBody();
              setTimeout(() => {
                let row = Grid.GetFirst();
                while (row) {
                  if (row.__skipped) {
                    highlightSkippedRows(Grid);
                  }
                  row = Grid.GetNext(row);
                }
              }, 50);

              Grid.ReloadBody();
            }
            setbulkOrderDataGrid(skippedGridData);
            setIsAdding(true);
            setSnackbar({
              message: "Some rows were skipped. Please fix and re-save.",
              severity: "warning",
            });
          } else {
            setShowLoader(false);
            setSnackbar({
              message: "Items saved successfully!",
              severity: "success",
            });
            refreshGrid();
            resetAddNewGrid();
            setIsAdding(false);
          }
        },
        onError: (error) => {
          setSnackbar({
            message: "Failed to save items",
            severity: "error",
          });
        },
      }));
  }, [
    headers,
    tableData,
    hasAddItemMasterPrivilege,
    itemMasterBulkInsertMutate,
    layout,
  ]);

  // Callback to handle cancel action from Filter
  const handleCancel = useCallback(() => {
    setHeaders(["Id", "SKU", "Category", "Description"]);
    setTableData([]);
    setIsAdding(false);
    setBulkInsertErrorRows([]);
  }, []);

  // Callback for expand icon
  const handleExpandClick = useCallback(() => {
    setIsDetailViewModalOpen(true);
  }, []);

  const handleUploadComplete = (data: any) => {
    console.log("Import completed:", data);
  };

  const handleViewLog = () => {
    console.log("View log clicked");
  };

  const handleManualAdd = async () => {
    if (hasAddItemMasterPrivilege) {
      setIsAdding(true);
    } else {
      const result = await openConfirmationModal("add", confirm);
      if (result) {
        setIsAdding(true);
      }
    }
  };

  const handleCardAction = useCallback((cardId: string) => {
    switch (cardId) {
      case "erp-sync":
        console.log("ERP sync clicked");
        break;
      case "csv-upload":
        setShowUploadFlow(true);
        break;
      case "manual-add":
        handleManualAdd();
        break;
      default:
        console.warn("Unknown card action:", cardId);
    }
  }, []);

  // Memoized static styles
  const headerTextStyles = useMemo(
    () => ({
      color: theme.custom.textColor,
      textAlign: "center",
      mb: 1,
    }),
    [],
  );

  const subTextStyles = useMemo(
    () => ({
      color: theme.custom.subTextColor,
      textAlign: "center",
    }),
    [],
  );

  const containerBoxStyles = useMemo(
    () => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      pt: "3%",
      minHeight: "60vh",
    }),
    [],
  );

  const gridStyles = useMemo(
    () => ({
      mt: { xs: 1, sm: 2 },
      maxWidth: "700px",
      mx: "auto",
      width: "100%",
      gap: 0,
    }),
    [],
  );

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
          setSnackbar({
            message: t("common", "commentsModal.successMessage"),
            severity: "success",
          });
        },
        onError: () => {
          setSnackbar({
            message: t("common", "commentsModal.failureMessage"),
            severity: "error",
          });
        },
      },
    );
  };

  const togglePanel = useCallback((panel: OpenPanel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);

  useEffect(() => {
    setShowLoader(
      isItemsLoading ||
        isFetchingNextPage ||
        createCommentPending ||
        isListHeadersLoading ||
        isBulkInsertPending ||
        deleteItemMasterRowPending ||
        itemMasterExportRowPending ||
        isitemMasterBulkInsertAdminApprovalPending,
    );
  }, [
    isItemsLoading,
    isFetchingNextPage,
    createCommentPending,
    isListHeadersLoading,
    isBulkInsertPending,
    deleteItemMasterRowPending,
    itemMasterExportRowPending,
    isitemMasterBulkInsertAdminApprovalPending,
  ]);

  useEffect(() => {
    if (!isItemsLoading) {
      setInitialLoadCompleted(true);
    }
  }, [isItemsLoading]);

  const handleDeleteSelection = () => {
    if (!selectedRows || selectedRows.length === 0) return;
    const payload: DeleteSelectedRowPayload = { item_ids: selectedRows };
    setShowLoader(true);
    deleteItemMasterRow(payload, {
      onSuccess: (response) => {
        setShowLoader(false);
        setSnackbar({
          message: "Deleted successfully!",
          severity: "success",
        });
        gridRef.current?.deleteSeletectedRows();
        setSelectedRows([]);
      },
      onError: (e) => {
        setSnackbar({
          message: "Failed to delete rows",
          severity: "error",
        });
        setShowLoader(false);
      },
    });
  };

  const handleExport = () => {
    if (!selectedExport && (!selectedRows || selectedRows.length === 0)) return;
    setShowLoader(true);
    const payload: ExportItemMasterRowPayload = {
      module_name: "item_master",
      feature_name: "main",
      file_type: "csv",
      parameters: {
        ids: selectedExport ? ["all"] : selectedRows,
        filter: {},
        options: {},
      },
    };
    itemMasterExportRowMutate(payload, {
      onSuccess: (response) => {
        setShowLoader(false);
        setSnackbar({
          message: "Rows exported successfully!",
          severity: "success",
        });
        gridRef?.current?.getGridInstance()?.ClearSelection();
        setSelectedRows([]);
        setSelectedExport(false);
        DownloadExportFile(response?.export_id, {
          onSuccess: (res) => {
            if (res?.download_url) {
              const link = document.createElement("a");
              link.href = res.download_url;
              link.setAttribute("download", "export_file.csv");
              document.body.appendChild(link);
              link.click();
              link.remove();
            }
          },
          onError: (err: any) => {
            setSnackbar({
              message: "Failed to download file",
              severity: "error",
            });
          },
        });
      },
      onError: (error) => {
        setShowLoader(false);
        setSnackbar({
          message: "Failed to export rows",
          severity: "error",
        });
      },
    });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleEmptyColumnVisibility = (label: string, check: boolean) => {
    if (check) {
      emptyGridRef.current?.showColumn(label);
    } else {
      emptyGridRef.current?.hideColumn(label);
    }
  };

  const handleColumnVisibility = (label: string, check: boolean) => {
    if (check) {
      gridRef.current?.showColumn(label);
    } else {
      gridRef.current?.hideColumn(label);
    }
  };

  const onClickCellComment = (
    grid: TreeGridApi,
    row: TreeGridRow,
    col: string,
  ) => {
    setOnSubmitComment(() => (comment: string) => {
      const id = row?.id || "";
      handleConfirmComment(COMMENT_TYPE.CELL, id, col, comment);
    });
    setShowCommentModal(true);
  };

  const onClickRowComment = (
    grid: TreeGridApi,
    row: TreeGridRow,
    col: string,
  ) => {
    setOnSubmitComment(() => (comment: string) => {
      const id = row?.id || "";
      handleConfirmComment(COMMENT_TYPE.ROW, id, col, comment);
    });
    setShowCommentModal(true);
  };

  const handleCommentSelect = (comment: any) => {
    const id = comment.item_id;
    if (comment.comment_type === "row") {
      gridRef.current?.focusRow(id);
    } else if (comment.comment_type === "field") {
      const fieldKey = comment.field_key;
      gridRef.current?.focusCell(id, fieldKey);
    }
  };

  const handleSkuUpcClick = (rowId: string, col: string, value: any) => {
    const Grid = gridRef.current?.getGridInstance();
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

  const handleClearAllFilters = useCallback(() => {
    const Grid = gridRef.current?.getGridInstance();
    if (Grid) {
      Grid.ChangeFilter("", "", "", 0, 0);
    }
    setFilter({});
  }, []);

  const applySavedFilterToFilterRow = (filter: Record<string, string[]>) => {
    const Grid = gridRef.current?.getGridInstance();
    if (!Grid) return;
    const { cols, values, operators } = convertSavedFilter(filter);
    Grid.ChangeFilter(cols, values, operators, false, false);
  };
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Filter
          onToggleDrawer={() => togglePanel("comments")}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          onSave={handleSave}
          onCancel={handleCancel}
          activeColumns={headers}
          hasAddItemMasterPermission={hasAddItemMasterPrivilege}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSnackbar={setSnackbar}
          selectedRows={selectedRows}
          isAllSelected={selectAll}
          deleteSelection={handleDeleteSelection}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          headerList={columns}
          setColumns={setColumns}
          onImportClick={() => setShowUploadFlow(true)}
          selectedColumnsForAdd={selectedColumnsForAdd}
          setSelectedColumnsForAdd={setSelectedColumnsForAdd}
          setShowFilesModal={setShowFilesModal}
          resetAddNewGrid={resetAddNewGrid}
          handleColumnVisibility={handleColumnVisibility}
          onHandleExport={handleExport}
          setSelectedExport={setSelectedExport}
          setOpenRequestModal={setOpenRequestModal}
          handleEmptyColumnVisibility={handleEmptyColumnVisibility}
          setSaveFilter={setSaveFilter}
          saveFilter={saveFilter}
          filter={filter}
          saveFilterJson={setFilter}
          onClearAllFilters={handleClearAllFilters}
          applySavedFilterToFilterRow={applySavedFilterToFilterRow}
        />
        {isDetailViewModalOpen && (
          <DetailsModal
            isOpen={isDetailViewModalOpen}
            onClose={() => setIsDetailViewModalOpen(false)}
            timelineTitle={itemDetailData.timelineTitle}
            item_id={detailedViewId}
          />
        )}
        <Box sx={{ display: "flex", position: "relative" }}>
          <MainContentContainer hasFilter={true}>
            {showFilesModal && (
              <FileDetailsModal
                onClose={setShowFilesModal}
                showLoader={setShowLoader}
                showSnackBar={setSnackbar}
                module="item_master"
                filterOptions={FILE_FILTER_OPTIONS}
              />
            )}
            {openReqestModal && (
              <RequestsModal
                onClose={setOpenRequestModal}
                targetModule={"item_master"}
              />
            )}
            {showCommentModal && (
              <CommentsModal
                onSubmit={onSubmitComment}
                onClose={() => setShowCommentModal(false)}
              />
            )}
            {requestSuccessNotficationVisible && (
              <RequestSuccessDialog
                setNotificationOpen={setRequestSuccessNotficationVisible}
              />
            )}
            {initialLoadCompleted && (
              <div style={{ padding: "8px" }}>
                {/* {isLoading && <LoaderOverlay />} */}
                {isGridReady && isAdding && (
                  <AddNewGrid
                    gridId="AddNewGrid"
                    ref={emptyGridRef}
                    layout={layout}
                    data={bulkOrderDataGrid}
                    enableInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    contextMenuItems={[]}
                    onEditConfirm={handleGridEditConfirm}
                    enableEditPopover={false}
                  />
                )}
                {isGridReady && !isAdding && (
                  <ItemMasterGrid
                    gridId="InventoryGrid"
                    ref={gridRef}
                    layout={layout}
                    data={data}
                    enableInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    onEditConfirm={handleGridEditConfirm}
                    enableEditPopover={true}
                    setFilter={setFilter}
                    contextMenuItems={[
                      {
                        name: "Comment on this row",
                        onClick: onClickRowComment,
                      },
                      {
                        name: "Comment on this column",
                        onClick: onClickCellComment,
                      },
                    ]}
                    setSelectedRows={setSelectedRows}
                    onSkuUpcClick={handleSkuUpcClick}
                  />
                )}
                {showEmpty && (
                  <Box p={1} sx={containerBoxStyles}>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      gutterBottom
                      sx={headerTextStyles}
                    >
                      Hey, It seems like you're new here
                    </Typography>

                    <Typography variant="body2" mb={4} sx={subTextStyles}>
                      Try any of the below option to add data here
                    </Typography>

                    <Grid
                      container
                      justifyContent="center"
                      alignItems="stretch"
                      sx={gridStyles}
                    >
                      {CARD_CONFIGS.map((config) => (
                        <ActionCard
                          key={config.id}
                          config={config}
                          onAction={handleCardAction}
                        />
                      ))}
                    </Grid>
                  </Box>
                )}
              </div>
            )}
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
                listComments={lisComments}
                isLoading={isCommentListingPending}
                onCommentSelect={(comment) => {
                  handleCommentSelect(comment);
                  console.log("commant selcted", comment);
                }}
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
                timelineTitle={itemDetailData.timelineTitle}
                onClose={() => setOpenPanel(null)}
                onExpandClick={handleExpandClick}
              />
            )}
          </Box>
          <AppSnackbar
            snackbar={snackbar}
            onClose={() => setSnackbar({ message: null, severity: "info" })}
          />
          {showLoader && <LoaderOverlay />}
        </Box>
      </Box>
      <CompleteUploadFlow
        open={showUploadFlow}
        onClose={() => setShowUploadFlow(false)}
        onImportComplete={handleUploadComplete}
        onViewLog={handleViewLog}
        setSnackbar={setSnackbar}
        isSearchReplaceRef={isSearchReplaceRef}
      />
    </>
  );
};

export default ItemMaster;
