import {
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import ActionHeader from "./components/ActionHeader";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  hasItemMasterPrivileges,
  ItemMasterGridLayout,
} from "./helper";
import { handleSelected } from "./tree-grid/utils/rowSelection";
import { useItemMasterStore } from "./store/useItemMasterStore";
import { handleFilterChange } from "./tree-grid/utils/Filter";
import { DEfAULT_VISIBLE_COLUMNS } from "./constants/headers.constants";
import { handleValueChanged } from "./tree-grid/cellvalue/handleValueChanged";
import TableSavePopover from "./components/table-save-popover";
import { useHandleEditPopover } from "./tree-grid/hooks/useHandleEditPopover";
import { useHandleGridEditConfirm } from "./actions/handleGridEditConfirm";
import RequestSuccessDialog from "@/components/common/request-notification";
import { COMMENT_TYPE } from "@/constants/comments.constants";
import CommentsModal from "./components/comments-modal";
import type { OpenPanel } from "./types/types";
import CommentSidebar from "./components/comment-sidebar";
import DetailView from "./components/detail-view";
import { DetailsModal } from "./components/detail-view-modal";
import { useConfirmComment } from "./actions/commentHandlers";
import SidePanel from "./components/sidepanel/SidePanel";
import { getRightClickHandlers } from "./tree-grid/utils/onHandleRightClick";
import { selectComment } from "./utils/getCommentSelection";
import AdminRequestConfirmationModal from "./components/admin-request-confirmation-modal";
import EmptyDataState from "./components/action-cards";

const gridId = "ItemMasterGrid";
const gridContainerId = "TreeGrid_" + gridId;

const ItemMasterListingPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [commentAdded, setCommentAdded] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [requestNotficationVisible, setRequestNotficationVisible] =
    useState(false);
  const [onSubmitComment, setOnSubmitComment] = useState<
    ((comment: string) => void) | null
  >(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [isDetailViewCell, setIsDetailViewCell] = useState(false);
  const [detailedViewId, setDetailedViewId] = useState<string>("");
  const [
    openAdminRequestConfirmationModal,
    setOpenAdminRequestConfirmationModal,
  ] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const filter = useItemMasterStore((store) => store.filter);
  const setCheckBoxList = useItemMasterStore((store) => store.setCheckBoxList);
  const showSavePopover = useItemMasterStore((s) => s.showSavePopover);
  const popoverPosition = useItemMasterStore((s) => s.popoverPosition);
  const closeSavePopover = useItemMasterStore((s) => s.closeSavePopover);
  const gridRef = useItemMasterStore((s) => s.gridRef);
  const privileges: {} = JSON.parse(localStorage.getItem("privileges") || "");
  const { hasEditItemMasterPrivilege, hasAddItemMasterPrivilege } =
    hasItemMasterPrivileges(privileges);
  const { handleConfirmComment, isCreatingComment } = useConfirmComment();

  const { data: itemMasterData, refetch } = useListItems({
    search: searchTerm,
    page_size: 100,
    filter: filter,
  });

  const { data: listHeaderData, refetch: refetchHeader } = useListHeaders({
    page_size: 10000,
    search: "",
    skip: 0,
  });

  useEffect(() => {
    window.TGSetEvent("OnSelected", gridId, onSelected);
    window.TGSetEvent("OnFilter", gridId, handleFilterChange);
    window.TGSetEvent("OnValueChanged", gridId, onHandleValueChanged);
    window.TGSetEvent("OnRightClick", gridId, onHandleRightClick);
    window.TGSetEvent("OnClick", gridId, onCellClick);
    return () => {
      window.TGDelEvent("OnSelected", gridId);
      window.TGDelEvent("OnFilter", gridId);
      window.TGDelEvent("OnValueChanged", gridId);
      window.TGDelEvent("OnRightClick", gridId);
      window.TGDelEvent("OnClick", gridId);
    };
  }, []);

  const cols = useMemo(() => {
    if (!listHeaderData?.headers) return [];
    return buildItemMasterTreeGridCols(listHeaderData.headers).cols;
  }, [listHeaderData]);

  const gridLayout = useMemo(() => {
    if (!cols.length || !listHeaderData) return null;
    return ItemMasterGridLayout(cols, listHeaderData);
  }, [cols, listHeaderData]);

  useEffect(() => {
    if (showSavePopover && gridRef) {
      gridRef.Focus(null, null);
    }
  }, [showSavePopover]);

  const gridData = useMemo(() => {
    if (!itemMasterData) return null;
    const items = itemMasterData.pages.flatMap((page) => page.items);
    return buildItemMasterTreeGridBody(items);
  }, [itemMasterData]);
  console.log(gridData);
  const showEmpty = gridData?.Body[0].length === 0;

  const headers = useMemo(() => {
    if (!listHeaderData?.headers) return null;
    const headers = listHeaderData?.headers.map((header) => {
      return {
        name: header.name,
        label: header.label,
        data_type: header.data_type,
      };
    });
    return headers;
  }, [listHeaderData]);

  useEffect(() => {
    if (!headers) return;
    const checkBoxList: Record<string, boolean> = {};
    headers.forEach((header) => {
      if (DEfAULT_VISIBLE_COLUMNS.includes(header.label)) {
        checkBoxList[header.label] = true;
      } else {
        checkBoxList[header.label] = false;
      }
    });
    setCheckBoxList(checkBoxList);
  }, [headers]);

  const onSelected = (grid: TGrid) => {
    handleSelected(grid);
  };

  const onHandleValueChanged = (
    grid: TGrid,
    row: TRow,
    col: string,
    val: string,
    oldval: string,
  ) => {
    handleValueChanged(grid, row, col, val, oldval, gridId);
  };

  const { handleGridEditConfirm } = useHandleGridEditConfirm();

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
      // confirm,
      gridRef,
      itemMasterData,
      setRequestNotficationVisible,
      openAdminRequestConfirmationModal,
      setOpenAdminRequestConfirmationModal,
    });
  };

  const { handleEditSave, handleEditCancel } = useHandleEditPopover({
    comment,
    setComment,
    setCommentAdded,
    gridRef,
    onCellEditConfirm,
  });

  const onClickCellComment = (grid: TGrid, row: TRow, col: string) => {
    setOnSubmitComment(() => (comment: string) => {
      const id = row?.id || "";
      handleConfirmComment(COMMENT_TYPE.CELL, id, col, comment);
    });
    setShowCommentModal(true);
  };

  const onHandleRightClick = useMemo(
    () => getRightClickHandlers(gridId, onClickCellComment),
    [onClickCellComment],
  );

  const handleCommentSelect = (comment: any) => {
    selectComment(comment);
  };

  const toggleCommentsPanel = useCallback((panel: OpenPanel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);

  const handleSkuUpcClick = (rowId: string, col: string, value: string) => {
    setDetailedViewId(rowId);
    setOpenPanel((prev) => (prev === "detail-view" ? prev : "detail-view"));
  };

  const onCellClick = (grid: TGrid, row: TRow, col: string) => {
    if (!row || row.Kind !== "Data") return;
    if (col === "SKU" || col === "UPC") {
      const value = row[col];
      if (!value) return;
      handleSkuUpcClick(row.id, col, value);
    }
  };

  const handleCardAction = useCallback((cardId: string) => {
    switch (cardId) {
      case "erp-sync":
        console.log("ERP sync clicked");
        break;
      case "csv-upload":
        setIsUploadModalOpen(true);
        break;
      case "manual-add":
        // handleManualAdd();
        break;
      default:
        console.warn("Unknown card action:", cardId);
    }
  }, []);

  useTreeGridInit(gridId, gridContainerId, gridLayout, gridData);

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
        position: "relative",
      }}
    >
      <ActionHeader
        onSearch={setSearchTerm}
        onImportComplete={() => {
          refetch();
          refetchHeader();
        }}
        headers={headers}
        onToggleCommentsPanel={() => toggleCommentsPanel("comments")}
        hasAddItemMasterPrivilege={hasAddItemMasterPrivilege}
        isUploadModalOpen={isUploadModalOpen}
        setIsUploadModalOpen={setIsUploadModalOpen}
      />
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: 1,
          display: "flex",
          position: "relative",
        }}
      >
        {showEmpty ? (
          <EmptyDataState handleCardAction={handleCardAction} />
        ) : (
          <Box
            id={gridContainerId}
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: 1,
            }}
          />
        )}
        <SidePanel isOpen={openPanel === "comments"} width={300}>
          <CommentSidebar
            onClose={() => setOpenPanel(null)}
            onCommentSelect={handleCommentSelect}
          />
        </SidePanel>
        <SidePanel isOpen={openPanel === "detail-view"} width={406}>
          <DetailView
            item_id={detailedViewId}
            timelineTitle="Timeline"
            onClose={() => setOpenPanel(null)}
            onExpandClick={() => setIsDetailViewCell(true)}
          />
        </SidePanel>
      </Box>
      {requestNotficationVisible && (
        <RequestSuccessDialog
          setNotificationOpen={setRequestNotficationVisible}
        />
      )}
      {showCommentModal && (
        <CommentsModal
          onSubmit={onSubmitComment}
          isLoading={isCreatingComment}
          onClose={() => setShowCommentModal(false)}
        />
      )}
      <DetailsModal
        isOpen={isDetailViewCell}
        onClose={() => setIsDetailViewCell(false)}
        timelineTitle={"Timeline"}
        item_id={detailedViewId}
      />
      <AdminRequestConfirmationModal
        open={openAdminRequestConfirmationModal}
        onClose={() => setOpenAdminRequestConfirmationModal(false)}
        title="Admin Approval Required!"
        description="You don’t have permission to edit data, but you can suggest editing data. Once approved by the admin, you can download it from ‘Files’"
        actions={[
          {
            label: "Cancel",
            variant: "outlined",
            onClick: () => setOpenAdminRequestConfirmationModal(false),
          },
          {
            label: "Understood",
            onClick: () => {
              setOpenAdminRequestConfirmationModal(false);
            },
          },
        ]}
      />
      {showSavePopover && (
        <div
          style={{
            position: "absolute",
            top: popoverPosition.top,
            left: popoverPosition.left,
            zIndex: 1000,
          }}
        >
          <TableSavePopover
            onSave={() => {
              setCommentAdded(true);
              handleEditSave();
              closeSavePopover();
            }}
            onCancel={() => {
              setCommentAdded(false);
              handleEditCancel();
              closeSavePopover();
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

export default ItemMasterListingPage;
