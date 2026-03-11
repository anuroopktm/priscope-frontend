import LoaderOverlay from "@/components/common/loader";
import CommentSidebar from "@/components/common/loader/comment-sidebar";
import MainContentContainer from "@/components/common/main-content-container";
import RequestSuccessDialog from "@/components/common/request-notification";
import RequestsModal from "@/components/common/requests-modal";
// import FileDetailsModal from "@/components/file-detail-modal";
// import { FILE_FILTER_OPTIONS } from "@/constants/file-modal.constants";
import { Box } from "@mui/material";
import DetailView from "./components/detail-view";
import { DetailsModal } from "./components/detail-view-modal";
import Filter from "./components/filter";
import TableSavePopover from "./components/table-save-popover";
import CompleteUploadFlow from "./components/upload-csv";

import { useItemsMasterPage } from "./hooks/useItemsMasterPage";
import { useItemsMasterUIStore } from "./store/useItemsMasterUIStore";

const ItemsMasterPage = () => {
  const {
    state,
    showLoader,
    headerLabels,
    setHeaderLabels,
    selectedColumns,
    setSelectedColumns,
    openPanel,
    setOpenPanel,
    detailedViewId,
    setIsDetailViewModalOpen,
    // setShowFilesModal,
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
    comment,
    setComment,
    commentAdded,
    setCommentAdded,
    containerId,
    listComments,
    isCommentListingPending,
    isSearchReplaceRef,
  } = useItemsMasterPage();

  const {
    setOpenRequestModal,
    requestSuccessNotficationVisible,
    showUploadFlow,
    // showFilesModal,
    isDetailViewModalOpen,
    // setShowLoader,
  } = useItemsMasterUIStore();

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
        hasAddItemMasterPermission={true} // Adjust as needed based on privileges
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        headerList={headerLabels}
        setHeaderLabels={setHeaderLabels}
        handleColumnVisibility={handleColumnVisibility}
        onHandleExport={handleExport}
        applySavedFilterToFilterRow={applySavedFilterToFilterRow}
        deleteSelection={onDeleteSelection}
        onClearAllFilters={handleClearAllFilters}
      />

      {isDetailViewModalOpen && (
        <DetailsModal
          isOpen={isDetailViewModalOpen}
          onClose={() => setIsDetailViewModalOpen(false)}
          timelineTitle={"Timeline"}
          item_id={detailedViewId}
        />
      )}

      {useItemsMasterUIStore.getState().openRequestModal && (
        <RequestsModal
          onClose={setOpenRequestModal}
          targetModule="item_master"
        />
      )}

      {/* {showFilesModal && (
        <FileDetailsModal
          onClose={setShowFilesModal}
          showLoader={setShowLoader}
          showSnackBar={() => {}} // Consider adding to store if needed
          module="item_master"
          filterOptions={FILE_FILTER_OPTIONS}
        />
      )} */}

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
              isOpen={Boolean(openPanel)}
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
        setSnackbar={() => {}}
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
