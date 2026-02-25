import ExportDataIcon from "@/assets/common/export-data.svg";
import ImportDataIcon from "@/assets/common/import-data.svg";
import LogFileIcon from "@/assets/common/log-file-view.svg";
import RequestsIcon from "@/assets/items-master/requests.svg";
import { Search } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import { useState } from "react";
import ConfirmationDialog from "@/components/common/upload-modal/confirmation-modal";
import ColumnDropdown from "@/pages/items-master/components/columns-dropdown";
import { useQueryClient } from "@tanstack/react-query";
import { useSaveFilter } from "@/services/queries/item-master/item-master.queries";
import SavedFiltersDropdown from "@/pages/items-master/components/saved-filters-dropdown";
import CommentIcon from "@/assets/common/comment.svg";
import ExportIcon from "@/assets/common/export-data.svg";
import SavedFilterIcon from "@/assets/items-master/bookmark-check-01.svg";
import AddIcon from "@mui/icons-material/Add";
import SaveFilterModal from "@/components/common/save-filter";
import { useToastStore } from "@/store/useToastStore";
import LoaderOverlay from "@/components/common/loader";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setOpenRequestModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFilesModal: React.Dispatch<React.SetStateAction<boolean>>;
  onImportClick: () => void;
  selectedRows: string[];
  onHandleExport: () => void;
  handleDeleteSelection: () => void;
  headerLabels: string[];
  setHeaderLabels: React.Dispatch<React.SetStateAction<string[]>>;
  selectedColumns: Record<string, boolean>;
  setSelectedColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  handleColumnVisibility: (label: string, checked: boolean) => void;
  setSaveFilter: React.Dispatch<React.SetStateAction<boolean>>;
  saveFilter: boolean;
  filter: Record<string, string[]>;
  saveFilterJson: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  onClearAllFilters?: () => void;
  applySavedFilterToFilterRow: (filter: Record<string, string[]>) => void;
  setSelectedExport: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ActionHeader = ({
  searchQuery,
  setSearchQuery,
  setOpenRequestModal,
  setShowFilesModal,
  onImportClick,
  selectedRows,
  onHandleExport,
  handleDeleteSelection,
  headerLabels,
  setHeaderLabels,
  selectedColumns,
  setSelectedColumns,
  handleColumnVisibility,
  setSaveFilter,
  saveFilter,
  filter,
  saveFilterJson,
  onClearAllFilters,
  applySavedFilterToFilterRow,
  setSelectedExport,
}: FilterProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [filterName, setFilterName] = useState("");
  const queryClient = useQueryClient();
  const { mutate: mutateSaveFilter, isPending: mutateSaveFilterPending } =
    useSaveFilter();

  const { showToast } = useToastStore();

  const handleRequestsClick = () => {
    setOpenRequestModal(true);
  };

  const handleFilesClick = () => {
    setShowFilesModal(true);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleOpenSaveFilterModal = () => {
    setSaveFilter(true);
  };

  const handleCloseSaveFilterModal = () => {
    setSaveFilter(false);
  };

  const handleExportData = () => {
    setSelectedExport(true);
    onHandleExport();
  };

  const handleSaveFilterModal = (label: string) => {
    setFilterName(label);
    const payload = {
      name: label,
      filter: filter,
    };
    mutateSaveFilter(payload, {
      onSuccess: () => {
        showToast("Filter added successfully!", "success");
        queryClient.invalidateQueries({ queryKey: ["saved-filter"] });
      },
      onError: () => {
        showToast("Failed to add filter", "error");
      },
    });
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundImage: "brand.background_gradient",
          pt: 2,
          px: 2,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search"
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          sx={{
            width: 250,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1, mr: 0.5 }}>
                <Search sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={0.5} alignItems="center">
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
                  onClick={onHandleExport}
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
                  <img src={RequestsIcon} alt={"request"} width={16} />
                }
              >
                Request
              </Button>

              <Button
                variant="contained"
                startIcon={<img src={RequestsIcon} alt={"clear"} width={16} />}
                onClick={onClearAllFilters}
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
              <SavedFiltersDropdown
                saveFilterJson={saveFilterJson}
                applySavedFilterToFilterRow={applySavedFilterToFilterRow}
              />
              <Button
                variant="contained"
                startIcon={<img src={LogFileIcon} alt="Log File" width={16} />}
                onClick={handleFilesClick}
              >
                Files
              </Button>

              <ColumnDropdown
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                headerList={headerLabels}
                setHeaderLabels={setHeaderLabels}
                handleColumnVisibility={handleColumnVisibility}
              />
              <Button variant="contained" startIcon={<AddIcon />}>
                Add Item
              </Button>

              <Button
                variant="contained"
                onClick={handleExportData}
                startIcon={<img src={ExportIcon} alt="Export" width={16} />}
              >
                Export
              </Button>

              <Button
                variant="contained"
                onClick={onImportClick}
                sx={{
                  padding: "8px 12px",
                  color: "grey.300",
                  "&:hover": {
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                }}
                startIcon={<img src={ImportDataIcon} alt="Import" width={16} />}
                endIcon={<KeyboardArrowDownRoundedIcon />}
              >
                Import Data
              </Button>

              <Button
              // onClick={handleToggle}
              >
                <img src={CommentIcon} alt="Comments" width={16} />
              </Button>
            </>
          )}
        </Stack>
      </Box>

      <Box>
        <SaveFilterModal
          open={saveFilter}
          onClose={handleCloseSaveFilterModal}
          onSubmit={handleSaveFilterModal}
          defaultLabel={filterName}
        />
        {mutateSaveFilterPending && <LoaderOverlay />}
        <ConfirmationDialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={() => {
            (handleDeleteSelection(), setOpenDeleteModal(false));
          }}
          message="Are you sure you want to delete selected row(s)? This action cannot be undone"
          confirmText="Delete"
          cancelText="Cancel"
        />
      </Box>
    </>
  );
};
