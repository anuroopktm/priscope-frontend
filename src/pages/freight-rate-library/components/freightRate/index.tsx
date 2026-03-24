import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import { debounce } from "lodash";
import {
  useBulkStatusUpdate,
  useCreateAdminRequest,
  useCreateFreightRate,
  useCreateFreightRateComment,
  useGetFreightRateById,
  useListContainerTypes,
  useListFreightRates,
  useListGlobalCurrencies,
  useUpdateFrieghtRate,
  useUploadFreightRateFile,
} from "../../services/freightRateService";
import type { SnackbarState } from "../../types";
import { FREIGHT_RATE_HEADERS } from "../../constants/tableHeaders.constants";
import {
  FILTER_OPTIONS,
  FREIGHT_RATE_ACTION_BAR_BUTTONS,
} from "../../constants/actionbar.constants";
import { DetailsModal } from "../detailed-view-modal";
import FreightRateInitialPage from "../empty-freight-rate";
import CommentSidebar from "../comment-sidebar";
import { hasFreightRatePrivilages } from "../../helpers/freightRateHelpers";
import { columnFieldMap } from "../../constants/freightRate.constants";
import { transformResponse } from "../../helpers/freightRateHelpers";
import {
  addEmptyFreightRateRow,
  addNewFreightRate,
  cancelFreightRateAdd,
  editFreightRate,
  enableDisabelRequestHandler,
  exportAllFreightRates,
  exportSelectedFreightRates,
  freightRateBulkStatusUpdate,
  handleCommentSelect,
  addComment,
} from "../../helpers/freightRateHandlers";
import MainContentContainer from "@/components/common/main-content-container";
import {
  PAGE_SIZE,
  RATE_FILTER_OPTIONS,
} from "@/constants/rateLibrary.constants";
import { useCreateExport } from "@/services/queries/common/common.queries";
import LoaderOverlay from "@/components/common/loader";
import Handsontable from "@/components/common/handsontable";
import CommentsModal from "@/pages/items-master-refactor/components/comments-modal";
import RequestSuccessDialog from "@/components/common/request-notification";
import FileDetailsModal from "@/components/file-detail-modal";
import { FILE_FILTER_OPTIONS } from "@/constants/file-modal.constants";
import ActionBar from "@/components/common/action-bar";
import { useConfirm } from "@/pages/items-master-refactor/utils/ModalProvider";
import { resetHandsontableScroll } from "@/helpers/handsontableHelpers";
import { openConfirmationModal } from "@/utils/getRequestConfirmationModal";
import applyAlignmentFilter from "@/utils/applyAlignmentFilter";
import RequestsModal from "@/components/common/requests-modal";

function FreightRate() {
  const hotRef = useRef<any>(null);
  const [alignment, setAlignment] = useState(FILTER_OPTIONS[0].value);
  const [search, setSearch] = useState("");
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [localData, setLocalData] = useState<(string | number)[][]>([]);
  const [failedRows, setFailedRows] = useState<Set<number>>(new Set());
  const [loadingRows, setLoadingRows] = useState<Set<number>>(new Set());
  const [showRequestsModal, setShowRequestsModal] = useState<boolean>(false);
  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
  const [addRowInprogress, setAddRowInprogress] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: null,
    severity: "info",
  });
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
  const [highlightTarget, setHighlightTarget] = useState<{
    freightRateId: string | null;
    fieldKey?: string | null;
  }>({ freightRateId: null, fieldKey: null });
  const [selectAll, setSelectAll] = useState(false);
  const [
    requestSuccessNotficationVisible,
    setRequestSuccessNotficationVisible,
  ] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [action, setAction] = useState("");
  const [pageSize] = useState(PAGE_SIZE);
  const [skip, setSkip] = useState(0);
  const [allData, setAllData] = useState<any[]>([]);
  const [commentData, setCommentData] = useState<any>(null);

  const tenantId = import.meta.env.VITE_TENANT_ID;
  const { mutate: createFreightRate, isPending: createFreightRatePending } =
    useCreateFreightRate();
  const { mutate: updateFreightRate, isPending: updateFreightRatePending } =
    useUpdateFrieghtRate();
  const bulkStatusUpdateMutation = useBulkStatusUpdate();
  const { mutateAsync: getFreightRateDetails } = useGetFreightRateById();
  const { mutate: createExport, isPending: isExportPending } =
    useCreateExport();
  const { mutate: createAdminRequest, isPending: createAdminRequestPending } =
    useCreateAdminRequest();
  const { mutateAsync: createComment, isPending: createCommentPending } =
    useCreateFreightRateComment();
  const privileges: {} = JSON.parse(localStorage.getItem("privileges") || "");
  const {
    hasEditFreightRatePrivilege,
    hasFreightEnableDisablePrivilage,
    hasAddFreightRatePrivilege,
    hasExportFreightRatePrivilege,
    hasImportFreightRatePrivilege,
  } = hasFreightRatePrivilages(privileges);
  const confirm = useConfirm();

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setSkip(0);
        setAllData([]);
      }, 500),
    [],
  );

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAllData([]);
    resetHandsontableScroll(hotRef);
    setAlignment(newAlignment);
    setSkip(0);
  };

  const payload = useMemo(() => {
    let filter = undefined;

    if (alignment === "enabled") {
      filter = { status: "active" };
    } else if (alignment === "disabled") {
      filter = { status: "inactive" };
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
    data: freightRateData,
    isLoading: freightRateLoading,
    isError: isFreightRateListingError,
    refetch,
    isRefetching: isRefetchingFreightRates,
  } = useListFreightRates(payload);

  useEffect(() => {
    if (isFreightRateListingError) {
      setSnackbar({
        message: "Error loading data",
        severity: "error",
      });
    }
  }, [isFreightRateListingError]);

  useEffect(() => {
    if (
      freightRateLoading ||
      createFreightRatePending ||
      updateFreightRatePending ||
      isRefetchingFreightRates ||
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
    freightRateLoading,
    createFreightRatePending,
    updateFreightRatePending,
    isRefetchingFreightRates,
    bulkStatusUpdateMutation.isPending,
    createAdminRequestPending,
    isExportPending,
    createCommentPending,
  ]);

  const { data: containerTypesData } = useListContainerTypes({
    tenant_id: tenantId,
  });

  const { data: currenciesData } = useListGlobalCurrencies({
    search: "",
    page_size: 300,
    skip: 0,
  });

  useEffect(() => {
    if (!isRefetchingFreightRates && !freightRateLoading) {
      refetch();
    }
  }, [payload, refetch]);

  const handleFreightRateIdNotFound = useCallback(
    async (freightRateId: string): Promise<boolean> => {
      if (!freightRateId) return false;

      try {
        setShowLoader(true);
        let response;
        if (commentData?.id === freightRateId) {
          response = commentData;
        } else {
          response = await getFreightRateDetails(freightRateId);
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
        console.error("Error fetching Freight Rate details", error);
        return false;
      } finally {
        setShowLoader(false);
      }
    },
    [getFreightRateDetails, alignment],
  );

  useEffect(() => {
    if (freightRateData?.freight_rates) {
      if (freightRateData?.freight_rates?.length && !initialLoadCompleted) {
        setInitialLoadCompleted(true);
      }

      setAllData((prev) => {
        if (skip === 0) {
          return applyAlignmentFilter(freightRateData.freight_rates, alignment);
        }

        const newData = freightRateData.freight_rates;
        const newIds = new Set(newData.map((item) => item.id));

        const filteredOld = prev.filter((item) => !newIds.has(item.id));

        const merged = [...filteredOld, ...newData];

        return applyAlignmentFilter(merged, alignment);
      });
    }
  }, [freightRateData, skip, alignment]);

  const { headers, values } = useMemo(() => {
    if (!allData) return { headers: [], values: [] };

    let filteredData = allData;

    const transformed = transformResponse({
      freight_rates: filteredData,
      total: filteredData.length,
    });
    setSelectAll(false);
    return {
      headers: transformed.headers.map((header: string) => header),
      values: [...localData, ...transformed.values],
    };
  }, [allData, alignment, localData]);

  const containerTypeOptions = useMemo(() => {
    return (
      containerTypesData?.container_types.map((c) => ({
        id: c.id,
        label: c.type,
      })) || []
    );
  }, [containerTypesData]);

  const currencyOptions = useMemo(() => {
    return (
      currenciesData?.currencies.map((c) => ({
        id: c.id,
        label: c.currency,
        description: c.description,
        status: c.status,
      })) || []
    );
  }, [currenciesData]);

  const loadMore = () => {
    if (
      !freightRateLoading &&
      freightRateData &&
      allData.length < freightRateData.total &&
      !isRefetchingFreightRates
    ) {
      setSkip(allData.length);
    }
  };

  const handleAddNewRow = () => {
    addEmptyFreightRateRow({ setIsAddingRow, setLocalData });
  };

  const handleConfirmRow = (rowIndex: number, comment: string, hotRef: any) => {
    addNewFreightRate({
      localData,
      rowIndex,
      setSnackbar,
      setFailedRows,
      setLoadingRows,
      hotRef,
      containerTypeOptions,
      hasAddFreightRatePrivilege,
      createAdminRequest,
      setRequestSuccessNotficationVisible,
      setLocalData,
      comment,
      tenantId,
      setAllData,
      handleSnackBarClose,
      setAddRowInprogress,
      createFreightRate,
      // t,
    });
  };

  const handleCancelRow = (rowIndex: number) => {
    cancelFreightRateAdd({
      setLocalData,
      setFailedRows,
      setLoadingRows,
      rowIndex,
    });
  };

  const handleRowClick = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDetailModalOpen(true);
  };

  const handleConfirmEdit = (editingCell: any, data: any, comment: string) => {
    editFreightRate({
      editingCell,
      data,
      comment,
      allData,
      hasEditFreightRatePrivilege,
      containerTypesData,
      createAdminRequest,
      setRequestSuccessNotficationVisible,
      setSnackbar,
      values,
      tenantId,
      updateFreightRate,
      // t,
    });
  };

  const handleConfirmComment = (editingCell: any, data: any, comment: any) => {
    addComment({
      allData,
      createComment,
      comment,
      tenantId,
      setSnackbar,
      // t,
      data,
      editingCell,
    });
  };

  const handleBulkStatusUpdate = async (status: "active" | "inactive") => {
    freightRateBulkStatusUpdate({
      status,
      selectedRows,
      setSnackbar,
      bulkStatusUpdateMutation,
      tenantId,
      setSelectedRows,
      refetch,
      setSkip,
      skip,
      // t,
    });
  };

  const handleClearSelection = () => {
    setSelectedRows({});
  };

  const handleAddManually = useCallback(async () => {
    if (hasAddFreightRatePrivilege) {
      handleAddNewRow();
      setAddRowInprogress(true);
    } else {
      const result = await openConfirmationModal("add", confirm);
      if (result) {
        handleAddNewRow();
        setAddRowInprogress(true);
      } else {
        return;
      }
    }
  }, [hasAddFreightRatePrivilege, handleAddNewRow, confirm]);

  const handleImportData = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleSnackBarClose = () => {
    setSnackbar({ severity: "info", message: null });
  };

  const handleExportSelected = () => {
    if (selectAll) {
      handleExportAll();
      return;
    }

    exportSelectedFreightRates({
      selectedRows,
      setSnackbar,
      createExport,
      setSelectedRows,
      // t,
    });
  };

  const handleExportAll = () => {
    exportAllFreightRates({ allData, setSnackbar, createExport });
  };

  const handleEnableDisabelRequest = (comment: string) => {
    enableDisabelRequestHandler({
      comment,
      createAdminRequest,
      setRequestSuccessNotficationVisible,
      setSnackbar,
      setAction,
      // t,
      values,
      selectedRows,
      action,
      containerTypesData,
    });
  };

  const handleShowCommentModal = (action: string) => {
    setAction(action);
    setShowCommentModal(true);
  };

  const handleCloseCommandModal = () => {
    handleClearSelection();
    setShowCommentModal(false);
    setAction("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <ActionBar
        alignment={alignment}
        onAlignmentChange={handleChange}
        onSearchChange={handleSearchChange}
        setShowRequestsModal={setShowRequestsModal}
        setShowFilesModal={setShowFilesModal}
        isAddingItem={isAddingRow}
        onAddItem={handleAddManually}
        addItemInProgress={addRowInprogress}
        setAddItemInProgress={setAddRowInprogress}
        selectedItems={selectedRows}
        onClearSelection={handleClearSelection}
        isUpdating={false}
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        filterOptions={RATE_FILTER_OPTIONS}
        showButtons={FREIGHT_RATE_ACTION_BAR_BUTTONS}
        templateName={"Freight Rate Template"}
        acceptedFileTypes={[".csv", ".xlsx", ".xls"]}
        maxFileSize={10}
        useUploadMutation={useUploadFreightRateFile}
        feature={"freight_rate"}
        onExportSelected={handleExportSelected}
        onExportAll={handleExportAll}
        hasEnableDisablePrivilage={hasFreightEnableDisablePrivilage}
        showCommentModal={handleShowCommentModal}
        setShowLoader={setShowLoader}
        hasAddPermission={hasAddFreightRatePrivilege}
        hasImportPermission={hasImportFreightRatePrivilege}
        hasExportPermission={hasExportFreightRatePrivilege}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          backgroundColor: "divider",
        }}
      >
        <MainContentContainer hasFilter={true}>
          {showRequestsModal && (
            <RequestsModal
              onClose={setShowRequestsModal}
              targetModule={"freight_rate"}
            />
          )}
          {showFilesModal && (
            <FileDetailsModal
              onClose={setShowFilesModal}
              showLoader={setShowLoader}
              showSnackBar={setSnackbar}
              module="freight_rate"
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
              onClose={handleCloseCommandModal}
            />
          )}
          <Box
            sx={{ position: "relative", flex: 1, minHeight: "200px", gap: 2 }}
          >
            {(initialLoadCompleted || values?.length > 0 || isAddingRow) && (
              <Handsontable
                hotRef={hotRef}
                headers={headers}
                data={values}
                onConfirmRow={handleConfirmRow}
                onCancelRow={handleCancelRow}
                readOnlyColumns={[
                  FREIGHT_RATE_HEADERS[0],
                  FREIGHT_RATE_HEADERS[1],
                  FREIGHT_RATE_HEADERS[2],
                  FREIGHT_RATE_HEADERS[6],
                  FREIGHT_RATE_HEADERS[7],
                ]}
                onLoadMore={loadMore}
                failedRows={failedRows}
                loadingRows={loadingRows}
                containerTypeOptions={containerTypeOptions}
                currencyOptions={currencyOptions}
                onRowClick={handleRowClick}
                setAddRowInprogress={setAddRowInprogress}
                addRowInprogress={addRowInprogress}
                relations={[[FREIGHT_RATE_HEADERS[3], FREIGHT_RATE_HEADERS[4]]]}
                handleConfirmEdit={handleConfirmEdit}
                handleConfirmComment={handleConfirmComment}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
                setShowLoader={setShowLoader}
                commentMantatoryFields={[
                  FREIGHT_RATE_HEADERS[3],
                  FREIGHT_RATE_HEADERS[4],
                ]}
                highlightTarget={highlightTarget}
                setHighlightTarget={setHighlightTarget}
                columnFieldMap={columnFieldMap}
                onFreightRateIdNotFound={handleFreightRateIdNotFound}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                hasEditPermission={hasEditFreightRatePrivilege}
                hasAddPermission={hasAddFreightRatePrivilege}
              />
            )}
            {allData.length === 0 &&
              localData.length === 0 &&
              !showLoader &&
              !initialLoadCompleted && (
                <FreightRateInitialPage
                  onImportData={handleImportData}
                  onAddManually={handleAddManually}
                  hasImportPermission={hasImportFreightRatePrivilege}
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
                showSnackBar={setSnackbar}
                showLoader={setShowLoader}
              />
            )}
          </Box>
        </MainContentContainer>
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
                handleCommentSelect(commentData, setHighlightTarget);
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default FreightRate;
