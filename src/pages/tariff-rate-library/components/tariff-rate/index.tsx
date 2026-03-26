import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { Box, Snackbar, Alert } from "@mui/material";
import {
  useBulkStatusUpdate,
  useCreateAdminRequest,
  useCreateTariffRate,
  useCreateTariffRateComment,
  useGetTariffRateById,
  useListTariffRates,
  useUpdateTariffRate,
  useUploadFreightRateFile,
} from "../../services/tariffRateService";
import type { CreateFreightRateRequestBodyParams } from "@/pages/freight-rate-library/types";
import type {
  TariffRate as TariffRateType,
  TariffRateResponse,
} from "../../types";
import { TARIFF_RATE_HEADERS } from "../../constants/tableHeaders.constants";
import formatDate from "@/utils/formatDate";
import { useCreateExport } from "@/services/queries/common/common.queries";
import { useConfirm } from "@/pages/items-master-refactor/utils/ModalProvider";
import { hasPrivilege } from "@/utils/hasPrivilege";
import {
  PRIVILEGE_ACTIONS,
  PRIVILEGE_MODULES,
} from "@/constants/privileges.constants";
import applyAlignmentFilter from "@/utils/applyAlignmentFilter";
import { resetHandsontableScroll } from "@/helpers/handsontableHelpers";
import {
  createAddAdminRequestPayload,
  createAdminRequestPayload,
} from "@/pages/freight-rate-library/helpers/type";
import {
  ADMIN_REQUEST_ACTIONS,
  ADMIN_REQUEST_MODULES,
} from "@/constants/admin-request.contants";
import { openConfirmationModal } from "@/utils/getRequestConfirmationModal";
import { buildStatusUpdate } from "../../helpers/helper";
import ActionBar from "@/components/common/action-bar";
import MainContentContainerWithProps from "@/components/common/main-content-container";
import RequestsModal from "@/components/common/requests-modal";
import FileDetailsModal from "@/components/file-detail-modal";
import { FILE_FILTER_OPTIONS } from "@/constants/file-modal.constants";
import RequestSuccessDialog from "@/components/common/request-notification";
import CommentsModal from "@/pages/items-master-refactor/components/comments-modal";
import TariffHandsontable from "../handsontable";
import TariffRateInitialPage from "../empty-tariff-rate";
import LoaderOverlay from "@/components/common/loader";
import { DetailsModal } from "../detailed-view-modal";
import CommentSidebar from "../comment-sidebar";
import { useToastStore } from "@/store/useToastStore";
const PAGE_SIZE = 50;

const columnFieldMap: Record<number, string> = {
  3: "rate",
  4: "valid_to",
};

interface SnackbarState {
  message: string | null;
  severity: "success" | "error" | "warning" | "info";
}

export function createTariffRateUpdateRequestBody(
  params: CreateFreightRateRequestBodyParams,
) {
  const {
    comments,
    updatedFields,
    tenantId,
    tariffRateId,
    fieldKey,
    ...optionalFields
  } = params;

  const reqBody: Record<string, any> = {
    tenant_id: tenantId,
    tariff_rate_id: tariffRateId,
    comments: comments.map(({ comment, fieldKey }) => ({
      comment,
      comment_type: "field",
      tariff_field_key: fieldKey,
    })),
    last_change_source: "tariff_rate",
    action_key: fieldKey,
    ...updatedFields,
  };

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value !== undefined) {
      reqBody[key] = value;
    }
  });

  return reqBody;
}

function getFieldNameByCol(colIndex: number): string {
  return columnFieldMap[colIndex] || "";
}

function transformResponse(data: TariffRateResponse | any) {
  const headers = TARIFF_RATE_HEADERS();

  const tariffData = data?.tariff_rates || data;
  if (!tariffData || tariffData.length === 0) {
    return { headers, values: [] };
  }

  const values = tariffData.map((item: TariffRateType) => {
    return [
      item.country_of_origin || "-",
      item.country_of_destination || "-",
      item.hs_code || "-",
      item.rate !== undefined ? item.rate : "-",
      formatDate(item.valid_to),
      item.last_updated_by ? item.last_updated_by.name || "-" : "-",
      formatDate(item.last_updated_at),
      item.id || "-",
      item.status || "-",
    ];
  });

  return { headers, values };
}

const TariffRate = () => {
  const hotRef = useRef<any>(null);
  const [alignment, setAlignment] = useState("all");
  const [search, setSearch] = useState("");
  const [showRequestsModal, setShowRequestsModal] = useState<boolean>(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [addItemInProgress, setAddItemInProgress] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUpdating, _setIsUpdating] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: null,
    severity: "info",
  });
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [localData, setLocalData] = useState<(string | number)[][]>([]);
  const [failedRows, setFailedRows] = useState<Set<number>>(new Set());
  const [loadingRows, setLoadingRows] = useState<Set<number>>(new Set());
  const [highlightTarget, setHighlightTarget] = useState<{
    tariffRateId: string | null;
    fieldKey?: string | null;
  }>({ tariffRateId: null, fieldKey: null });
  const [selectAll, setSelectAll] = useState(false);
  const [
    requestSuccessNotficationVisible,
    setRequestSuccessNotficationVisible,
  ] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [action, setAction] = useState("");

  const tenantId = import.meta.env.VITE_TENANT_ID;
  const [pageSize] = useState(PAGE_SIZE);
  const [skip, setSkip] = useState(0);
  const [commentData, setCommentData] = useState<any>(null);
  const showToast = useToastStore((state) => state.showToast);

  // const { data } = useSession();

  const { mutate: createTariffRate, isPending: createTariffRatePending } =
    useCreateTariffRate();
  const { mutate: updateTariffRate, isPending: updateTariffRatePending } =
    useUpdateTariffRate();
  const bulkStatusUpdateMutation = useBulkStatusUpdate();
  const { mutateAsync: getTariffRateDetails } = useGetTariffRateById();
  const { mutate: createExport, isPending: isExportPending } =
    useCreateExport();
  const { mutate: createAdminRequest, isPending: createAdminRequestPending } =
    useCreateAdminRequest();
  const { mutateAsync: createComment, isPending: createCommentPending } =
    useCreateTariffRateComment();
  const confirm = useConfirm();

  const privileges: {} = JSON.parse(localStorage.getItem("privileges") || "");

  const hasEditTariffPrivilege = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.TARIFF_RATE,
    PRIVILEGE_ACTIONS.EDIT,
  );

  const hasAddTariffRatePrivilege = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.TARIFF_RATE,
    PRIVILEGE_ACTIONS.CREATE,
  );
  const hasTariffEnableDisablePrivilage = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.TARIFF_RATE,
    PRIVILEGE_ACTIONS.ENABLE_DISABLE,
  );

  const hasTariffImportPrivilage = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.TARIFF_RATE,
    PRIVILEGE_ACTIONS.IMPORT,
  );

  const hasTariffExportPrivilage = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.TARIFF_RATE,
    PRIVILEGE_ACTIONS.EXPORT,
  );

  const payload = useMemo(() => {
    let filter = undefined;

    if (alignment === "enabled") {
      filter = { status: ["active"] };
    } else if (alignment === "disabled") {
      filter = { status: ["inactive"] };
    }

    return {
      page_size: pageSize,
      search,
      skip,
      tenant_id: tenantId,
      ...(filter ? { filter } : {}),
    };
  }, [pageSize, search, skip, tenantId, alignment]);

  const {
    data: tariffRateData,
    isLoading: tariffRateLoading,
    isError: isTariffRateListingError,
    refetch,
    isRefetching: isRefetchingTariffRates,
  } = useListTariffRates(payload);

  // Handle loading state
  useEffect(() => {
    if (
      tariffRateLoading ||
      createTariffRatePending ||
      isRefetchingTariffRates ||
      isUpdating ||
      updateTariffRatePending ||
      bulkStatusUpdateMutation.isPending ||
      createAdminRequestPending ||
      isExportPending ||
      createCommentPending
    ) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [
    tariffRateLoading,
    createTariffRatePending,
    isRefetchingTariffRates,
    isUpdating,
    updateTariffRatePending,
    bulkStatusUpdateMutation.isPending,
    createAdminRequestPending,
    isExportPending,
    createCommentPending,
  ]);

  // Handle error state for snackbar
  useEffect(() => {
    if (isTariffRateListingError) {
      setSnackbar({
        message: " Error loading tariff rates",
        severity: "error",
      });
    }
  }, [isTariffRateListingError]);

  // Update allData when tariffRateData changes
  useEffect(() => {
    if (tariffRateData?.tariff_rates) {
      if (tariffRateData.tariff_rates.length && !initialLoadCompleted) {
        setInitialLoadCompleted(true);
      }

      setAllData((prev) => {
        if (skip === 0) {
          return applyAlignmentFilter(tariffRateData.tariff_rates, alignment);
        }

        const newData = tariffRateData.tariff_rates;
        const newIds = new Set(newData.map((item) => item.id));

        const filteredOld = prev.filter((item) => !newIds.has(item.id));

        const merged = [...filteredOld, ...newData];

        return applyAlignmentFilter(merged, alignment);
      });
    }
  }, [tariffRateData, skip, alignment]);

  const { headers, values } = useMemo(() => {
    let filteredData = allData;

    const transformed = transformResponse({
      tariff_rates: filteredData,
    });
    setSelectAll(false);
    return {
      headers: transformed.headers,
      values: [...localData, ...transformed.values],
    };
  }, [allData, alignment, localData]);

  useEffect(() => {
    if (!tariffRateLoading && !isRefetchingTariffRates) {
      refetch();
    }
  }, [payload, refetch]);

  // Debounced search handler
  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setSkip(0);
        setAllData([]);
      }, 500),
    [],
  );

  // Callback for filter toggle
  const handleAlignmentChange = (_event: any, newAlignment: any) => {
    if (newAlignment !== null) {
      setAllData([]);
      resetHandsontableScroll(hotRef);
      setAlignment(newAlignment);
      setSelectedItems({});
      setSkip(0);
    }
  };

  // Callback for adding a new tariff rate
  const handleAddItem = useCallback(() => {
    setIsAddingItem(true);
    setTimeout(() => {
      setLocalData((prev) => [
        Array(TARIFF_RATE_HEADERS.length).fill(""),
        ...prev,
      ]);
      setIsAddingItem(false);
    }, 500);
  }, []);

  // Callback for confirming a new row
  const handleConfirmRow = (rowIndex: number, comment: string) => {
    const row = localData[rowIndex];

    // Mandatory fields check
    const requiredFields = [
      { key: "Country of Origin", value: row[0] },
      { key: "Country of Destination", value: row[1] },
      { key: "HS Code", value: row[2] },
      { key: "Rate", value: row[3] },
      { key: "Valid Until", value: row[4] },
    ];

    const missing = requiredFields.filter(
      (field) => !field.value || field.value.toString().trim() === "",
    );

    if (missing.length > 0) {
      setSnackbar({
        message: `Please fill required fields: ${missing
          .map((f) => f.key)
          .join(", ")}`,
        severity: "error",
      });

      setFailedRows((prev) => new Set([...prev, rowIndex]));
      setLoadingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rowIndex);
        return newSet;
      });

      return;
    }

    if (!hasAddTariffRatePrivilege) {
      const newRecord = {
        country_of_origin: row[0],
        country_of_destination: row[1],
        hs_code: row[2],
        rate: row[3],
        valid_to: row[4],
      };
      const requestInfo = [{ new_record: newRecord }];
      const addRequestPayload = createAddAdminRequestPayload(
        ADMIN_REQUEST_MODULES.TARIFF_RATE,
        ADMIN_REQUEST_MODULES.TARIFF_RATE,
        comment,
        ADMIN_REQUEST_ACTIONS.INSERT,
        requestInfo,
      );
      createAdminRequest(addRequestPayload, {
        onSuccess: () => {
          setRequestSuccessNotficationVisible(true);
          setLocalData((prev) => prev.filter((_, index) => index !== rowIndex));
          setAddItemInProgress(false);
        },
        onError: () => {
          setSnackbar({
            message: "Admin request failed",
            severity: "error",
          });
          setAddItemInProgress(true);
        },
      });
      return;
    }

    const payload: any = {
      country_of_origin: row[0],
      country_of_destination: row[1],
      hs_code: row[2],
      rate: row[3] ? Number(row[3]) : 0,
      valid_to: row[4],
      tenant_id: tenantId,
      last_change_source: "tariff_rate",
    };

    // Add action_key and comments only if comment is provided
    if (comment && comment.trim() !== "") {
      payload.action_key = "rate";
      payload.comments = [
        {
          comment,
          comment_type: "row",
        },
      ];
    }

    setLoadingRows((prev) => new Set([...prev, rowIndex]));

    createTariffRate(payload, {
      onSuccess: (res) => {
        setAllData((prev) => [res, ...prev]);
        setLocalData((prev) => prev.filter((_, index) => index !== rowIndex));
        setFailedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(rowIndex);
          return newSet;
        });
        setLoadingRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(rowIndex);
          return newSet;
        });
        setSnackbar({
          message: "Tariff rate created successfully",
          severity: "success",
        });
        setAddItemInProgress(false);
      },
      onError: (err: any) => {
        console.error("Error creating tariff rate:", err);
        const message =
          err.body.detail[0].msg ||
          err.body.detail ||
          "Tariff rate creation failed";
        setSnackbar({
          message,
          severity: "error",
        });
        setFailedRows((prev) => new Set([...prev, rowIndex]));
        setLoadingRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(rowIndex);
          return newSet;
        });
        setAddItemInProgress(true);
      },
    });
  };

  // Callback for canceling a row
  const handleCancelRow = (rowIndex: number) => {
    setLocalData((prev) => prev.filter((_, index) => index !== rowIndex));
    setFailedRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(rowIndex);
      return newSet;
    });
    setLoadingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(rowIndex);
      return newSet;
    });
    setAddItemInProgress(false);
  };

  // Callback for clearing selected items
  const handleClearSelection = () => {
    setSelectedItems({});
    setSelectAll(false);
  };

  // Callback for toggling comments drawer
  const handleToggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  // Custom filter options for tariff rates
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
  ];

  const onImportData = () => {
    setShowUploadModal(true);
  };
  const onAddManually = useCallback(async () => {
    if (hasAddTariffRatePrivilege) {
      handleAddItem();
      setAddItemInProgress(true);
    } else {
      const result = await openConfirmationModal("add", confirm);
      if (result) {
        handleAddItem();
        setAddItemInProgress(true);
      }
    }
  }, [hasAddTariffRatePrivilege, handleAddItem, confirm]);

  const handleRowClick = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDetailModalOpen(true);
  };

  // Close snackbar
  const handleSnackBarClose = () => {
    setSnackbar({ message: null, severity: "info" });
  };

  const handleConfirmEdit = (editingCell: any, data: any, comment: string) => {
    const tariffRateId = data[7];
    if (!hasEditTariffPrivilege) {
      const oldRate = allData.find((rate) => rate.id === tariffRateId);
      const oldRecord = {
        country_of_origin: oldRate.country_of_origin,
        country_of_destination: oldRate.country_of_destination,
        hs_code: oldRate.hs_code,
        rate: oldRate.rate,
        valid_to: oldRate.valid_to,
        last_change_source: "tariff_rate",
      };
      const newRecord = {
        country_of_origin: data[0],
        country_of_destination: data[1],
        hs_code: data[2],
        rate: data[3],
        valid_to: data[4],
        last_change_source: "tariff_rate",
      };
      const requestInfo = [{ new_record: newRecord, old_record: oldRecord }];
      const editRequestPayload = createAdminRequestPayload(
        ADMIN_REQUEST_MODULES.TARIFF_RATE,
        tariffRateId,
        ADMIN_REQUEST_MODULES.TARIFF_RATE,
        tariffRateId,
        comment,
        ADMIN_REQUEST_ACTIONS.UPDATE,
        requestInfo,
      );
      createAdminRequest(editRequestPayload, {
        onSuccess: () => {
          setRequestSuccessNotficationVisible(true);
        },
        onError: () => {
          setSnackbar({
            message: "Admin request failed",
            severity: "error",
          });
        },
      });
      const value = values.find((val) => val[7] === tariffRateId);
      value[3] = oldRate.rate;
      value[4] = oldRate.valid_to.split("T")[0];
      return;
    }
    const { col } = editingCell;
    const fieldKey = getFieldNameByCol(col);
    const fieldValue = data[col];
    const updatedFields = { [fieldKey]: fieldValue };

    const basePayload: any = {
      fieldKey,
      tenantId,
      updatedFields,
      tariffRateId,
      comments: [],
    };

    // Add comments only if comment exists
    if (comment && comment.trim() !== "") {
      basePayload.comments = [{ comment, fieldKey }];
    }

    const payload = createTariffRateUpdateRequestBody(basePayload);

    updateTariffRate(
      { payload, tariffRateId },
      {
        onSuccess: () => {
          setSnackbar({
            message: "Tariff rate updated",
            severity: "success",
          });
        },
        onError: () => {
          setSnackbar({
            message: "Failed to update tariff rate",
            severity: "error",
          });
        },
      },
    );
  };

  const handleConfirmComment = (
    editingCell: any,
    data: any,
    comment: string,
  ) => {
    if (!comment?.trim()) return;
    const { row, col } = editingCell;
    const tariffRateId = data[7] || allData[row].id;
    const id = tariffRateId || data[7] || allData[row]?.id;
    if (!id) return;

    const comments =
      col !== undefined
        ? [
            {
              comment_type: "field",
              field_key: getFieldNameByCol(col),
              comment,
            },
          ]
        : [{ comment_type: "row", comment }];

    const payload = {
      tenant_id: tenantId,
      comments,
      source: "tariff_rate",
      action_key: col !== undefined ? getFieldNameByCol(col) : undefined,
    };
    createComment(
      { tariffRateId, payload },
      {
        onSuccess: () => {
          setSnackbar({
            message: "Comment added successfully",
            severity: "success",
          });
        },
        onError: () => {
          setSnackbar({
            message: "Failed to add comment",
            severity: "error",
          });
        },
      },
    );
  };

  const loadMore = () => {
    if (
      !tariffRateLoading &&
      tariffRateData &&
      allData.length < tariffRateData.total &&
      !isRefetchingTariffRates
    ) {
      setSkip(allData.length);
    }
  };

  const handleBulkStatusUpdate = async (status: "active" | "inactive") => {
    const selectedIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id],
    );

    if (selectedIds.length === 0) {
      setSnackbar({
        message: "No rows selected",
        severity: "error",
      });
      return;
    }

    try {
      const result = await bulkStatusUpdateMutation.mutateAsync({
        action_key: "status",
        ids: selectedIds,
        source: "tariff_rate",
        status,
        tenant_id: tenantId,
      });

      setSnackbar({
        message: `Successfully ${status === "active" ? "enabled" : "disabled"} ${
          result.processed_count
        } tariff rate(s)`,
        severity: "success",
      });

      setSelectedItems({});
      if (skip !== 0) {
        setSkip(0);
        return;
      }
      refetch();
    } catch (error: any) {
      setSnackbar({
        message: `Failed to ${status === "active" ? "enable" : "disable"} tariff rates`,
        severity: "error",
      });
    }
  };

  const handleExportSelected = () => {
    if (selectAll) {
      handleExportAll();
      return;
    }
    const ids = Object.keys(selectedItems).filter((id) => selectedItems[id]);
    if (ids.length === 0) {
      setSnackbar({
        message: "No rows selected",
        severity: "error",
      });
      return;
    }

    const payload = {
      module_name: "tariff_rate",
      feature_name: "main",
      file_type: "csv",
      parameters: { ids, filter: {}, options: {} },
    };

    createExport(payload, {
      onSuccess: () => {
        setSnackbar({
          message: `Exported ${ids.length} tariff rate(s) successfully`,
          severity: "success",
        });
        setSelectedItems({});
      },
      onError: () => {
        setSnackbar({
          message: "Export failed. Please try again.",
          severity: "error",
        });
        setSelectedItems({});
      },
    });
  };

  const handleExportAll = () => {
    const ids = allData.map((row) => row.id);
    if (ids.length === 0) {
      setSnackbar({
        message: "No rows available for export",
        severity: "error",
      });
      return;
    }

    const payload = {
      module_name: "tariff_rate",
      feature_name: "main",
      file_type: "csv",
      parameters: { ids, filter: {}, options: {} },
    };

    createExport(payload, {
      onSuccess: () => {
        setSnackbar({
          message: `Exported ${ids.length} tariff rate(s) successfully`,
          severity: "success",
        });
      },
      onError: () => {
        setSnackbar({
          message: "Export failed. Please try again.",
          severity: "error",
        });
      },
    });
  };

  // const handleTariffRateIdNotFound = useCallback(
  //   async (tariffRateId: string) => {
  //     if (!tariffRateId) return;
  //     try {
  //       setShowLoader(true);
  //       let response;
  //       if (commentData?.id === tariffRateId) {
  //         response = commentData;
  //       } else {
  //         response = await await getTariffRateDetails(tariffRateId);
  //       }

  //       if (response) {
  //         const status = response.status;
  //         if (
  //           alignment === "all" ||
  //           (status === "inactive" && alignment === "disabled") ||
  //           (status === "active" && alignment === "enabled")
  //         ) {
  //           setAllData((prev) => [response, ...prev]);
  //           setCommentData(null);
  //           return true;
  //         } else {
  //           setCommentData(response);
  //           setAlignment("all");
  //           return false;
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching Tariff Rate details", error);
  //       setSnackbar({
  //         message: "Fetching Tariff Rate details failed.",
  //         severity: "error",
  //       });
  //     } finally {
  //       setShowLoader(false);
  //     }
  //   },
  //   [getTariffRateDetails, alignment],
  // );

  const handleTariffRateIdNotFound = useCallback(
    async (tariffRateId: string): Promise<boolean> => {
      if (!tariffRateId) return false;

      try {
        setShowLoader(true);
        let response;

        if (commentData?.id === tariffRateId) {
          response = commentData;
        } else {
          response = await getTariffRateDetails(tariffRateId);
        }

        if (response) {
          const status = response.status;

          if (
            alignment === "all" ||
            (status === "inactive" && alignment === "disabled") ||
            (status === "active" && alignment === "enabled")
          ) {
            setAllData((prev) => [response, ...prev]);
            setCommentData(null);
            return true;
          } else {
            setCommentData(response);
            setAlignment("all");
            return false;
          }
        }

        return false;
      } catch (error) {
        console.error("Error fetching Tariff Rate details", error);
        setSnackbar({
          message: "Fetching Tariff Rate details failed.",
          severity: "error",
        });

        return false;
      } finally {
        setShowLoader(false);
      }
    },
    [getTariffRateDetails, alignment, commentData],
  );
  const handleEnableDisabelRequest = (comment: string) => {
    const requestInfo = buildStatusUpdate(values, selectedItems, action);
    const adminRequestPayload = {
      source_module: ADMIN_REQUEST_MODULES.TARIFF_RATE,
      target_module: ADMIN_REQUEST_MODULES.TARIFF_RATE,
      request_action: ADMIN_REQUEST_ACTIONS.BULK_STATUS_UPDATE,
      request_comments: comment,
      request_info: requestInfo,
    };
    createAdminRequest(adminRequestPayload, {
      onSuccess: () => {
        setRequestSuccessNotficationVisible(true);
        setAction("");
      },
      onError: () => {
        setSnackbar({
          message: "Admin request failed",
          severity: "error",
        });
        setAction("");
      },
    });
  };

  const handleShowCommentModal = (action: string) => {
    setAction(action);
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    handleClearSelection();
    setShowCommentModal(false);
    setAction("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <ActionBar
        alignment={alignment}
        onAlignmentChange={handleAlignmentChange}
        onSearchChange={handleSearchChange}
        setShowRequestsModal={setShowRequestsModal}
        setShowFilesModal={setShowFilesModal}
        isAddingItem={isAddingItem}
        onAddItem={onAddManually}
        addItemInProgress={addItemInProgress}
        setAddItemInProgress={setAddItemInProgress}
        selectedItems={selectedItems}
        onClearSelection={handleClearSelection}
        isUpdating={isUpdating}
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onToggleDrawer={handleToggleDrawer}
        filterOptions={filterOptions}
        showButtons={{
          files: true,
          add: true,
          export: true,
          import: true,
          filter: true,
          comments: true,
          requests: true,
        }}
        templateName="Tariff Rate Template"
        acceptedFileTypes={[".csv", ".xlsx", ".xls"]}
        maxFileSize={10}
        useUploadMutation={useUploadFreightRateFile}
        feature={"tariff_rate"}
        onExportSelected={handleExportSelected}
        onExportAll={handleExportAll}
        hasEnableDisablePrivilage={hasTariffEnableDisablePrivilage}
        showCommentModal={handleShowCommentModal}
        setShowLoader={setShowLoader}
        hasAddPermission={hasAddTariffRatePrivilege}
        hasImportPermission={hasTariffImportPrivilage}
        hasExportPermission={hasTariffExportPrivilage}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          backgroundColor: "divider",
        }}
      >
        <MainContentContainerWithProps hasFilter={true}>
          {showRequestsModal && (
            <RequestsModal
              onClose={setShowRequestsModal}
              targetModule={"tariff_rate"}
            />
          )}
          {showFilesModal && (
            <FileDetailsModal
              onClose={setShowFilesModal}
              showLoader={setShowLoader}
              showToast={showToast}
              module="tariff_rate"
              filterOptions={FILE_FILTER_OPTIONS}
            />
          )}
          {requestSuccessNotficationVisible && (
            <RequestSuccessDialog
              setNotificationOpen={setRequestSuccessNotficationVisible}
            />
          )}
          {showCommentModal && (
            <CommentsModal
              onSubmit={handleEnableDisabelRequest}
              onClose={handleCloseCommentModal}
            />
          )}
          <Box
            sx={{ position: "relative", flex: 1, minHeight: "200px", gap: 2 }}
          >
            {(initialLoadCompleted || values.length > 0 || isAddingItem) && (
              <TariffHandsontable
                hotRef={hotRef}
                headers={headers}
                values={values}
                readOnlyColumns={[
                  TARIFF_RATE_HEADERS()[0],
                  TARIFF_RATE_HEADERS()[1],
                  TARIFF_RATE_HEADERS()[2],
                  TARIFF_RATE_HEADERS()[5],
                  TARIFF_RATE_HEADERS()[6],
                ]}
                onRowClick={handleRowClick}
                onConfirmRow={handleConfirmRow}
                onCancelRow={handleCancelRow}
                failedRows={failedRows}
                loadingRows={loadingRows}
                setAddRowInProgress={setAddItemInProgress}
                addRowInProgress={addItemInProgress}
                setSelectedRows={setSelectedItems}
                selectedRows={selectedItems}
                setShowLoader={setShowLoader}
                highlightTarget={highlightTarget}
                setHighlightTarget={setHighlightTarget}
                columnFieldMap={columnFieldMap}
                handleConfirmEdit={handleConfirmEdit}
                handleConfirmComment={handleConfirmComment}
                onLoadMore={loadMore}
                commentMantatoryFields={[TARIFF_RATE_HEADERS()[3]]}
                onTariffRateIdNotFound={handleTariffRateIdNotFound}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                hasEditPermission={hasEditTariffPrivilege}
                hasAddPermission={hasAddTariffRatePrivilege}
              />
            )}
            {allData.length === 0 &&
              localData.length === 0 &&
              !showLoader &&
              !initialLoadCompleted && (
                <TariffRateInitialPage
                  onImportData={onImportData}
                  onAddManually={onAddManually}
                  hasImportPermission={hasTariffImportPrivilage}
                />
              )}
            {showLoader && <LoaderOverlay />}
            {snackbar.message && (
              <Snackbar
                open
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handleSnackBarClose}
              >
                <Alert
                  severity={snackbar.severity}
                  sx={{ width: "100%" }}
                  onClose={handleSnackBarClose}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            )}
            {isDetailModalOpen && (
              <DetailsModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                rowData={selectedRowData}
                showToast={showToast}
                showLoader={setShowLoader}
              />
            )}
          </Box>
        </MainContentContainerWithProps>
        <Box
          sx={{
            width: isDrawerOpen ? 300 : 0,
            transition: "width 0.1s ease",
            overflow: "hidden",
            height: "calc(100vh - 147px)",
            marginLeft: isDrawerOpen ? 1 : 0,
            background: "white",
            color: "black",
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px 0 0 8px",
          }}
        >
          {isDrawerOpen && (
            <CommentSidebar
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onCommentSelect={(commentData) => {
                if (commentData.comment_type === "row") {
                  setHighlightTarget({
                    tariffRateId: commentData.tariff_rate_id,
                  });
                } else if (commentData.comment_type === "field") {
                  setHighlightTarget({
                    tariffRateId: commentData.tariff_rate_id,
                    fieldKey: commentData.tariff_field_key,
                  });
                } else {
                  setHighlightTarget({ tariffRateId: null });
                }
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TariffRate;
