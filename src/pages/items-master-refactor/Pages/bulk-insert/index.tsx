import { Box } from "@mui/material";
import BulkInsertHeader from "./components/header";
import { useTreeGridInit } from "../../tree-grid/hooks/useTreeGridInit";
import { useEffect, useMemo, useState } from "react";
import {
  buildItemMasterTreeGridCols,
  bulkOrderSkippedRecordFormat,
  getDataBulkUploadFormat,
  getDataBulkUploadFormatAdminApproval,
  getEmptyRowData,
  hasItemMasterPrivileges,
  ItemMasterGridLayout,
} from "../../helper";
import {
  useAddBulkInsertAdminRequest,
  useBulkInsertItems,
  useListHeaders,
} from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { DEfAULT_VISIBLE_COLUMNS } from "../../constants/headers.constants";
import { useItemMasterStore } from "../../store/useItemMasterStore";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "@/store/useToastStore";
import CommentsModal from "../../components/comments-modal";
import type { TreeGridBody } from "../../helper/types";
import { getDataFromGrid } from "../../tree-grid/cellvalue/getDataFromGrid";
import { highlightSkippedRows } from "../../tree-grid/cellvalue/highlightCell";

const BulkInsertPage = () => {
  const gridId = "ItemMasterBulkInsertGrid";
  const gridContainerId = "TreeGrid_" + gridId;
  const navigate = useNavigate();
  const [gridData, setGridData] = useState<TreeGridBody | null>(null);
  const [onSubmitComment, setOnSubmitComment] = useState<
    ((comment: string) => void) | null
  >(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const setCheckBoxList = useItemMasterStore((store) => store.setCheckBoxList);
  const gridRef = useItemMasterStore((store) => store.gridRef);
  const showToast = useToastStore((store) => store.showToast);
  const privileges: {} = JSON.parse(localStorage.getItem("privileges") || "");
  const { hasAddItemMasterPrivilege } = hasItemMasterPrivileges(privileges);

  const { data: listHeaderData } = useListHeaders({
    page_size: 10000,
    search: "",
    skip: 0,
  });
  const { mutate: itemMasterBulkInsertMutate } = useBulkInsertItems();
  const { mutate: itemMasterBulkInsertAdminApproval } =
    useAddBulkInsertAdminRequest();

  const columns = useMemo(() => {
    if (!listHeaderData?.headers) return [];
    return buildItemMasterTreeGridCols(listHeaderData.headers).cols;
  }, [listHeaderData]);

  useEffect(() => {
    if (columns.length) {
      setGridData(getEmptyRowData(columns, 30));
    }
  }, [columns]);

  const gridLayout = useMemo(() => {
    if (!columns.length || !listHeaderData) return null;
    return ItemMasterGridLayout(columns, listHeaderData);
  }, [columns, listHeaderData]);

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

  const handleCancel = () => {
    navigate("/items-master");
  };

  const handleAddBulkInsertAdminRequest = () => {
    const newData = getDataFromGrid(gridRef);
    if (!newData) return;
    setOnSubmitComment(() => (comment: string) => {
      const formmatedData = getDataBulkUploadFormatAdminApproval(
        newData,
        comment,
      );
      itemMasterBulkInsertAdminApproval(formmatedData, {
        onSuccess: () => {
          showToast("Admin request send successfully!", "success");
          navigate("/items-master");
        },
        onError: () => {
          showToast("Admin request failed!", "warning");
        },
      });
    });
    setShowCommentModal(true);
  };

  const handleSave = () => {
    const newData = getDataFromGrid(gridRef);
    if (!newData || !gridLayout) return;
    const formmatedData = getDataBulkUploadFormat(newData);
    if (!hasAddItemMasterPrivilege) {
      handleAddBulkInsertAdminRequest();
      return;
    }
    itemMasterBulkInsertMutate(formmatedData, {
      onSuccess: (response) => {
        const skippedItems = response?.skipped_items ?? [];
        if (skippedItems.length > 0) {
          const cols = columns;
          const skippedGridData = bulkOrderSkippedRecordFormat(
            skippedItems,
            cols,
          );
          const emptyGridData = getEmptyRowData(columns, 20);
          const mergedBody = [
            ...(skippedGridData.Body[0] || []),
            ...(emptyGridData.Body[0] || []),
          ];
          if (gridRef) {
            const Grid = gridRef;
            if (!Grid) return;
            Grid.Source.Data.Data = {
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
          setGridData(skippedGridData);
          showToast(
            "Some rows were skipped. Please fix and re-save.",
            "warning",
          );
        } else {
          showToast("Items saved successfully!", "success");
          navigate("/items-master");
        }
      },
      onError: () => {
        showToast("Failed to save items", "error");
      },
    });
  };

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
      <BulkInsertHeader
        headers={headers}
        handleCancel={handleCancel}
        handleSave={handleSave}
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
      </Box>
      {showCommentModal && (
        <CommentsModal
          onSubmit={onSubmitComment}
          onClose={() => setShowCommentModal(false)}
        />
      )}
    </Box>
  );
};

export default BulkInsertPage;
