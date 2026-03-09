import AddIcon from "@/assets/actions/add.svg?react";
import {
  default as ExportDataIcon,
  default as ExportIcon,
} from "@/assets/common/export-data.svg";
import CommentIcon from "@/assets/items-master/CommentsButton.svg";
import LogFileIcon from "@/assets/items-master/Group.svg";
import SavedFilterIcon from "@/assets/items-master/bookmark-check-01.svg";
import DatabaseImportIcon from "@/assets/items-master/database-import.svg";
import RequestsIcon from "@/assets/items-master/requests.svg";
import SearchTextField from "@/components/common/SearchTextField";
import { FILE_FILTER_OPTIONS } from "@/constants/file-modal.constants";
import { useGetExportedFile } from "@/services/queries/common/common.queries";
import {
  useDeleteItemMasterRow,
  useExportItemMasterRow,
  useSaveFilter,
} from "@/services/queries/item-master/item-master.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Button, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { handleDeleteSelected } from "../actions/handleDeleteRows";
import { handleItemMasterExport } from "../actions/handleExportRows";
import { useItemMasterStore } from "../store/useItemMasterStore";
import { handleClearAllFilters } from "../tree-grid/utils/clearGrid";
import type { HeaderList } from "../types/types";
import ColumnDropdown from "./columns-dropdown";
import DeleteConfirmModal from "./delete-confirmation-modal";
import FileDetailsModal from "./file-detail-modal";
import LoaderOverlay from "./loader";
import { ItemMasterRequestsModal } from "./request-modal";
import SaveFilterModal from "./save-filter";
import SavedFiltersDropdown from "./saved-filters-dropdown";
import UploadFileModal from "./upload-file/UploadFileModal";

interface ActionHeaderProps {
  onSearch: (value: string) => void;
  onImportComplete?: () => void;
  headers: HeaderList[] | null;
  onToggleCommentsPanel: () => void;
}

const ActionHeader = ({
  onSearch,
  onImportComplete,
  headers,
  onToggleCommentsPanel,
}: ActionHeaderProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openRequestModal, setOpenRequestModal] = useState<boolean>(false);
  const [openSaveFilterModal, setOpenSaveFilterModal] =
    useState<boolean>(false);
  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);
  const selectedRows = useItemMasterStore((state) => state.selectedRows);
  const filter = useItemMasterStore((state) => state.filter);
  const setSelectedExport = useItemMasterStore(
    (state) => state.setSelectedExport,
  );
  const showToast = useToastStore((state) => state.showToast);
  const queryClient = useQueryClient();

  const {
    mutate: itemMasterExportRowMutate,
    isPending: itemMasterExportRowPending,
  } = useExportItemMasterRow();

  const { mutate: DownloadExportFile } = useGetExportedFile() ?? {};

  const { mutate: deleteItemMasterRow, isPending: deleteItemMasterRowPending } =
    useDeleteItemMasterRow();

  const { mutate: mutateSaveFilter, isPending: mutateSaveFilterPending } =
    useSaveFilter();

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };
  const handleRequestsClick = () => {
    setOpenRequestModal(true);
  };

  const handleDeleteConfirm = () => {
    (handleDeleteSelected({ deleteItemMasterRow }), setOpenDeleteModal(false));
  };

  const handleOpenSaveFilterModal = () => {
    setOpenSaveFilterModal(true);
  };

  const handleSaveFilterModal = (label: string) => {
    const payload = {
      name: label,
      filter: filter,
    };
    mutateSaveFilter(payload, {
      onSuccess: () => {
        showToast("Filter added successfully!", "success");
        queryClient.invalidateQueries({ queryKey: ["saved-filter"] });
      },
      onError: (error) => {
        showToast(getErrorMessage(error, "Failed to add filter"), "error");
      },
    });
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
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          flexWrap="wrap"
        >
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
            startIcon={<img src={RequestsIcon} alt={"clear"} width={16} />}
            onClick={handleClearAllFilters}
          >
            Clear Filters
          </Button>
          <Button
            variant="contained"
            // disabled={!Object.keys(filter).length}
            onClick={handleOpenSaveFilterModal}
            startIcon={
              <img src={SavedFilterIcon} alt="Saved Filter" width={16} />
            }
          >
            Save Filter
          </Button>
          <SavedFiltersDropdown />
          <Button
            variant="contained"
            startIcon={<img src={LogFileIcon} alt="Log File" width={16} />}
            onClick={() => {
              setShowFilesModal(true);
            }}
          >
            Files
          </Button>
          <ColumnDropdown headers={headers} />
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Item
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedExport(true);
              handleItemMasterExport({
                itemMasterExportRowMutate,
                DownloadExportFile,
              });
            }}
            startIcon={<img src={ExportIcon} alt="Export" width={16} />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<img src={DatabaseImportIcon} alt="Export" width={16} />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Import Data
          </Button>
          <Button onClick={onToggleCommentsPanel}>
            <img src={CommentIcon} alt="Comments" />
          </Button>
        </Stack>
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
      <SaveFilterModal
        open={openSaveFilterModal}
        onClose={() => setOpenSaveFilterModal(false)}
        onSubmit={handleSaveFilterModal}
        isLoading={mutateSaveFilterPending}
      />
      <FileDetailsModal
        open={showFilesModal}
        onClose={() => setShowFilesModal(false)}
        showToast={showToast}
        module="item_master"
        filterOptions={FILE_FILTER_OPTIONS}
      />
    </Box>
  );
};

export default ActionHeader;
