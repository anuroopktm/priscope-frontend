import {
  useAddBulkInsertAdminRequest,
  useCreateItemMasterComment,
  useListComments,
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
  createItemMasterCommentPayload,
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
// import {
//   createItemMasterCommentPayload,
//   hasItemMasterPrivileges,
// } from "./helper/itemMasterHelpers";
import { handleEditCellAdminRequest } from "./actions/editItemMasterAdmin";
import RequestSuccessDialog from "@/components/common/request-notification";
import { handleRightClick } from "./tree-grid/cellvalue/handleRightClick";
import { useToastStore } from "@/store/useToastStore";
import { COMMENT_TYPE } from "@/constants/comments.constants";
import CommentsModal from "./components/comments-modal";
import type { OpenPanel } from "./types/types";
import CommentSidebar from "./components/comment-sidebar";
import { focusCell, focusRow } from "./tree-grid/focus/focusEvents";

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
  const filter = useItemMasterStore((store) => store.filter);
  const setCheckBoxList = useItemMasterStore((store) => store.setCheckBoxList);
  const showSavePopover = useItemMasterStore((s) => s.showSavePopover);
  const popoverPosition = useItemMasterStore((s) => s.popoverPosition);
  const closeSavePopover = useItemMasterStore((s) => s.closeSavePopover);
  const gridRef = useItemMasterStore((s) => s.gridRef);
  const privileges: {} = JSON.parse(localStorage.getItem("privileges") || "");
  const { hasEditItemMasterPrivilege } = hasItemMasterPrivileges(privileges);
  const showToast = useToastStore((state) => state.showToast);

  const { data: itemMasterData, refetch } = useListItems({
    search: searchTerm,
    page_size: 100,
    filter: filter,
  });

  const { data: listHeaderData, isLoading: isListHeadersLoading } =
    useListHeaders({ page_size: 10000, search: "", skip: 0 });

  const {
    mutate: itemMasterBulkInsertAdminApproval,
    isPending: isitemMasterBulkInsertAdminApprovalPending,
  } = useAddBulkInsertAdminRequest();

  const { mutateAsync: createComment, isPending: createCommentPending } =
    useCreateItemMasterComment();

  const { mutateAsync: listComments, isPending: isCommentListingPending } =
    useListComments();

  useEffect(() => {
    window.TGSetEvent("OnSelected", gridId, onSelected);
    window.TGSetEvent("OnFilter", gridId, handleFilterChange);
    window.TGSetEvent("OnValueChanged", gridId, onHandleValueChanged);
    window.TGSetEvent("OnRightClick", gridId, onHandleRightClick);
    return () => {
      window.TGDelEvent("OnSelected", gridId);
      window.TGDelEvent("OnFilter", gridId);
      window.TGDelEvent("OnValueChanged", gridId);
      window.TGDelEvent("OnRightClick", gridId);
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

  const gridData = useMemo(() => {
    if (!itemMasterData) return null;
    const items = itemMasterData.pages.flatMap((page) => page.items);
    return buildItemMasterTreeGridBody(items);
  }, [itemMasterData]);

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
    console.log(headers, "headers");
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

  // editing cell
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
      confirm,
      gridRef,
      itemMasterData,
      itemMasterBulkInsertAdminApproval,
      setRequestNotficationVisible,
      handleEditCellAdminRequest,
    });
  };

  const { handleEditSave, handleEditCancel } = useHandleEditPopover({
    comment,
    setComment,
    setCommentAdded,
    gridRef,
    onCellEditConfirm,
  });

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

    // setShowLoader(true);

    createComment(
      { itemMasterId: id, payload },
      {
        onSettled: () => {
          // setShowLoader(false);
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

  const handleCommentSelect = (comment: any) => {
    const id = comment.item_id;
    if (comment.comment_type === "row") {
      focusRow(gridRef, id);
    } else if (comment.comment_type === "field") {
      const fieldKey = comment.field_key;
      focusCell(gridRef, id, fieldKey);
    }
  };

  const toggleCommentsPanel = useCallback((panel: OpenPanel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
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
        onImportComplete={() => refetch()}
        headers={headers}
        onToggleCommentsPanel={() => toggleCommentsPanel("comments")}
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
        <Box
          id={gridContainerId}
          sx={{
            height: "100%",
            width: "100%",
            borderRadius: 1,
          }}
        />
        <Box
          sx={{
            width: openPanel === "comments" ? 300 : 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
            height: "100%",
            marginLeft: openPanel === "comments" ? 1 : 0,
            background: "white",
            color: "black",
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px 0 0 8px",
            boxShadow:
              openPanel === "comments" ? "0px 0px 8px rgba(0,0,0,0.1)" : "none",
            zIndex: 2,
          }}
        >
          {openPanel === "comments" && (
            <CommentSidebar
              isOpen={openPanel}
              onClose={() => setOpenPanel(null)}
              listComments={listComments}
              onCommentSelect={handleCommentSelect}
            />
          )}
        </Box>
      </Box>

      {requestNotficationVisible && (
        <RequestSuccessDialog
          setNotificationOpen={setRequestNotficationVisible}
        />
      )}
      {showCommentModal && (
        <CommentsModal
          onSubmit={onSubmitComment}
          onClose={() => setShowCommentModal(false)}
        />
      )}

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
