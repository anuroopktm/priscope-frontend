import {
  useAddBulkInsertAdminRequest,
  useCreateItemMasterComment,
  useListHeaders,
  useListItems,
} from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ActionHeader from "./components/ActionHeader";
import { useTreeGridInit } from "./tree-grid/hooks/useTreeGridInit";
import {
  buildItemMasterTreeGridBody,
  buildItemMasterTreeGridCols,
  ItemMasterGridLayout,
} from "./helper";
// import {
//   useAddBulkInsertAdminRequest,
//   useCreateItemMasterComment,
//   useListHeaders,
// } from "@/services/queries/item-master/item-master.queries";
import { handleSelected } from "./tree-grid/utils/rowSelection";
import { useItemMasterStore } from "./store/useItemMasterStore";
import { handleFilterChange } from "./tree-grid/utils/Filter";
import { DEfAULT_VISIBLE_COLUMNS } from "./constants/headers.constants";
import { handleValueChanged } from "./tree-grid/CellValue/handleValueChanged";
import TableSavePopover from "./components/table-save-popover";
import { useHandleEditPopover } from "./tree-grid/hooks/useHandleEditPopover";
import { useHandleGridEditConfirm } from "./actions/handleGridEditConfirm";
import {
  createItemMasterCommentPayload,
  hasItemMasterPrivileges,
} from "./helper/itemMasterHelpers";
import { handleEditCellAdminRequest } from "./actions/editItemMasterAdmin";
import RequestSuccessDialog from "@/components/common/request-notification";
import { handleRightClick } from "./tree-grid/CellValue/handleRightClick";
import { useToastStore } from "@/store/useToastStore";
import { COMMENT_TYPE } from "@/constants/comments.constants";
import CommentsModal from "./components/comments-modal";

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
    console.log("onCellEditConfirm called with:", {
      row,
      col,
      value,
      oldValue,
      comment,
    });
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
      }}
    >
      <ActionHeader
        onSearch={setSearchTerm}
        onImportComplete={() => refetch()}
        headers={headers}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: 1,
            p: 2,
            bgcolor: "background.paper",
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
              console.log("handleEditSave called from popover");
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
