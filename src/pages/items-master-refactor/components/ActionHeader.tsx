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
import { handleItemMasterExport } from "../actions/handleExportRows";
import { useGetExportedFile } from "@/services/queries/common/common.queries";
import { handleDeleteSelected } from "../actions/handleDeleteRows";
import DeleteConfirmModal from "./delete-confirmation-modal";
import RequestsIcon from "@/assets/items-master/requests.svg";
import { ItemMasterRequestsModal } from "./request-modal";

interface ActionHeaderProps {
  onSearch: (value: string) => void;
  onImportComplete?: () => void;
}

const ActionHeader = ({ onSearch, onImportComplete }: ActionHeaderProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openRequestModal, setOpenRequestModal] = useState<boolean>(false);
  const selectedRows = useItemMasterStore((state) => state.selectedRows);

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
  const handleRequestsClick = () => {
    setOpenRequestModal(true);
  };

  const handleDeleteConfirm = () => {
    (handleDeleteSelected({ deleteItemMasterRow }), setOpenDeleteModal(false));
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
            onClick={handleRequestsClick}
            startIcon={
              <img src={RequestsIcon} alt={"request icon"} width={16} />
            }
          >
            Request
          </Button>
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
      {itemMasterExportRowPending && <LoaderOverlay />}
      <DeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteItemMasterRowPending}
      />
      <ItemMasterRequestsModal
        open={openRequestModal}
        onClose={() => setOpenRequestModal(false)}
      />
    </Box>
  );
};

export default ActionHeader;
