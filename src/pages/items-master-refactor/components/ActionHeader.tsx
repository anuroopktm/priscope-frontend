import AddIcon from "@/assets/actions/add.svg?react";
import SearchTextField from "@/components/common/SearchTextField";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import UploadFileModal from "./upload-file/UploadFileModal";
import { useItemMasterStore } from "../store/useItemMasterStore";
import ExportDataIcon from "@/assets/common/export-data.svg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useDeleteItemMasterRow,
  useExportItemMasterRow,
} from "@/services/queries/item-master/item-master.queries";
import LoaderOverlay from "./loader";
import { useLoaderStore } from "../store/useLoaderStore";
import { handleItemMasterExport } from "../actions/handleExport";
import { useGetExportedFile } from "@/services/queries/common/common.queries";
import ConfirmationDialog from "./confirmation-modal";
import { handleDeleteSelected } from "../actions/handleDeleteRows";

interface ActionHeaderProps {
  onSearch: (value: string) => void;
  onImportComplete?: () => void;
}

const ActionHeader = ({ onSearch, onImportComplete }: ActionHeaderProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const selectedRows = useItemMasterStore((state) => state.selectedRows);
  const { loading } = useLoaderStore.getState();

  const {
    mutate: itemMasterExportRowMutate,
    isPending: itemMasterExportRowPending,
  } = useExportItemMasterRow();

  const { mutate: DownloadExportFile } = useGetExportedFile() ?? {};

  const { mutate: deleteItemMasterRow, isPending: deleteItemMasterRowPending } =
    useDeleteItemMasterRow();

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pt: 2,
        px: 2,
      }}
    >
      <SearchTextField onSearch={onSearch} />

      {selectedRows.length > 0 ? (
        <>
          <div>
            <Button
              onClick={handleOpenDeleteModal}
              disabled={false}
              sx={{
                padding: "8px 12px",
                color: "#ff4444",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
                "&:disabled": {
                  color: "grey.500",
                },
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<DeleteOutlineIcon />}
            >
              Delete Selected
            </Button>

            <Button
              onClick={() =>
                handleItemMasterExport({
                  itemMasterExportRowMutate,
                  DownloadExportFile,
                })
              }
              sx={{
                padding: "8px 12px",
                color: "grey.300",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
                "&:disabled": {
                  color: "grey.500",
                },
                textTransform: "none",
                fontWeight: 500,
              }}
              startIcon={<img src={ExportDataIcon} width={16} />}
            >
              Export Selected
            </Button>
          </div>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Import Data
          </Button>
        </>
      )}

      <UploadFileModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportComplete={onImportComplete}
      />
      {loading && <LoaderOverlay />}
      <ConfirmationDialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={() => {
          (handleDeleteSelected({ deleteItemMasterRow }),
            setOpenDeleteModal(false));
        }}
        message="Are you sure you want to delete selected row(s)? This action cannot be undone"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default ActionHeader;
