import {
  default as ExportDataIcon,
  default as ImportDataIcon,
  default as LogFileIcon,
  default as RequestsIcon,
} from "@/assets/actions/database-import.svg";
import SavedFilterIcon from "@/assets/actions/edit.svg";
import SearchIcon from "@/assets/actions/search.svg";
import CommentIcon from "@/assets/common/comment-02.svg";
import LoaderOverlay from "@/components/common/loader";
import SaveFilterModal from "@/components/common/save-filter";
import ConfirmationDialog from "@/components/common/upload-modal/confirmation-modal";
import { useSaveFilter } from "@/services/queries/item-master/item-master.queries";
import { openConfirmationModal } from "@/utils/getRequestConfirmationModal";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, Button, InputBase, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import AddNewItemDrawer from "../add-item";
import type { SnackbarState } from "../columns-dropdown";
import ColumnDropdown from "../columns-dropdown";
import SavedFiltersDropdown from "../saved-filters-dropdown";
import AddNewGridFilter from "./AddNewGridFilter";

interface FilterProps {
  onToggleDrawer?: () => void;
  hasAddItemMasterPermission?: boolean;
  isAdding?: boolean;
  setIsAdding?: (isAdding: boolean) => void;
  onSave?: () => void;
  onCancel?: () => void;
  selectedColumns: Record<string, boolean>;
  setSelectedColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
  isAllSelected?: boolean;
  selectedRows: string[];
  deleteSelection: () => void;
  headerList: string[];
  onImportClick: () => void;
  setSelectedColumnsForAdd?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  selectedColumnsForAdd?: Record<string, boolean>;
  setShowFilesModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetAddNewGrid?: () => void;
  handleColumnVisibility: (label: string, checked: boolean) => void;
  onHandleExport: () => void;
  setSelectedExport: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRequestModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleEmptyColumnVisibility?: (label: string, checked: boolean) => void;
  setSaveFilter: React.Dispatch<React.SetStateAction<boolean>>;
  saveFilter: boolean;
  filter: Record<string, string[]>;
  saveFilterJson: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  onClearAllFilters?: () => void;
  applySavedFilterToFilterRow: (filter: Record<string, string[]>) => void;
  setHeaderLabels?: React.Dispatch<React.SetStateAction<string[]>>;
}

const Filter: React.FC<FilterProps> = ({
  onToggleDrawer,
  isAdding,
  setIsAdding,
  onSave,
  onCancel,
  hasAddItemMasterPermission,
  selectedColumns,
  setSelectedColumns,
  searchQuery,
  setSearchQuery,
  setSnackbar,
  selectedRows,
  isAllSelected,
  deleteSelection,
  headerList,
  onImportClick,
  selectedColumnsForAdd,
  setSelectedColumnsForAdd,
  setShowFilesModal,
  handleColumnVisibility,
  resetAddNewGrid,
  onHandleExport,
  setSelectedExport,
  setOpenRequestModal,
  handleEmptyColumnVisibility,
  setHeaderLabels,
  setSaveFilter,
  saveFilter,
  filter,
  saveFilterJson,
  onClearAllFilters,
  applySavedFilterToFilterRow,
}) => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const confirm = (opts: any) => Promise.resolve(window.confirm(opts.message));
  const t = (_ns: string, key: string) => {
    const parts = key.split(".");
    return parts[parts.length - 1]
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());
  };
  const [showSelectedOptions, setShowSelectedOptions] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: mutateSaveFilter, isPending: mutateSaveFilterPending } =
    useSaveFilter();

  useEffect(() => {
    const hasAnySelected = isAllSelected || selectedRows.length > 0;
    setShowSelectedOptions(hasAnySelected);
  }, [selectedRows, isAllSelected]);

  const handleToggle = () => {
    onToggleDrawer?.();
  };

  const handleAddItemClick = async () => {
    if (hasAddItemMasterPermission) {
      resetAddNewGrid?.();
      setIsAdding?.(true);
    } else {
      const result = await openConfirmationModal("add", confirm);
      if (result) {
        resetAddNewGrid?.();
        setIsAdding?.(true);
      } else {
        return;
      }
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleExportData = () => {
    setSelectedExport(true);
    onHandleExport();
  };

  const handleFilesClick = () => {
    setShowFilesModal(true);
  };

  const handleRequestsClick = () => {
    setOpenRequestModal(true);
  };

  const handleOpenSaveFilterModal = () => {
    setSaveFilter(true);
  };

  const handleCloseSaveFilterModal = () => {
    setSaveFilter(false);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleSaveFilterModal = (label: string) => {
    setFilterName(label);
    const payload = {
      name: label,
      filter: filter,
    };
    mutateSaveFilter(payload, {
      onSuccess: () => {
        setSnackbar({
          message: "Filter added successfully!",
          severity: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["saved-filter"] });
      },
      onError: () => {
        setSnackbar({
          message: "Failed to add filter",
          severity: "error",
        });
      },
    });
  };

  return (
    <>
      <Box
        p={1}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!isAdding && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: "1 1 auto",
              maxWidth: "200px",
            }}
          >
            <Box
              component="span"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img src={SearchIcon} alt="Search" width={16} />
            </Box>
            <InputBase
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search"
              sx={{
                p: 1,
                borderRadius: 2,
                color: "white",
                width: "100%",
                maxWidth: 300,
                "&:focus": {
                  bgcolor: theme.palette.grey[600],
                },
              }}
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            alignItems: "center",
            gap: 1,
            flex: "1 1 auto",
            minWidth: "300px",
          }}
        >
          {showSelectedOptions ? (
            <div>
              <Button
                onClick={handleOpenDeleteModal}
                disabled={false}
                sx={{
                  padding: "8px 12px",
                  color: "#ff4444",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(32, 52, 139, 0.1)",
                  },
                  "&:disabled": {
                    color: theme.palette.grey[500],
                  },
                  textTransform: "none",
                  fontWeight: 500,
                }}
                startIcon={<DeleteOutlineIcon />}
              >
                {t("common", "actionBar.deleteSelection")}
              </Button>

              <Button
                onClick={onHandleExport}
                // disabled={isUpdating}
                sx={{
                  padding: "8px 12px",
                  color: theme.palette.grey[300],
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(32, 52, 139, 0.1)",
                  },
                  "&:disabled": {
                    color: theme.palette.grey[500],
                  },
                  textTransform: "none",
                  fontWeight: 500,
                }}
                startIcon={
                  <img
                    src={ExportDataIcon}
                    alt={t("common", "actionBar.exportDataIconAlt")}
                    width={16}
                  />
                }
              >
                {t("common", "actionBar.exportSelected")}
              </Button>
            </div>
          ) : (
            <div>
              {!isAdding ? (
                <>
                  <Button
                    onClick={handleRequestsClick}
                    sx={{
                      padding: "8px 12px",
                      color: theme.palette.grey[300],
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(32, 52, 139, 0.1)",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    startIcon={
                      <img
                        src={RequestsIcon}
                        alt={t("common", "actionBar.requestIconAlt")}
                        width={16}
                      />
                    }
                  >
                    {t("common", "actionBar.requests")}
                  </Button>
                  <Button
                    sx={{
                      padding: "8px 12px",
                      color: theme.palette.grey[300],
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(32, 52, 139, 0.1)",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    startIcon={
                      <img
                        src={RequestsIcon}
                        alt={t("common", "actionBar.requestIconAlt")}
                        width={16}
                      />
                    }
                    onClick={onClearAllFilters}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    disabled={!Object.keys(filter).length}
                    onClick={handleOpenSaveFilterModal}
                    sx={{
                      padding: "8px 12px",
                      color: theme.palette.grey[300],
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&.Mui-disabled": {
                        color: theme.palette.grey[500],
                        bgcolor: "rgba(255,255,255,0.05)",
                        borderRadius: "6px",
                        cursor: "not-allowed",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    startIcon={
                      <img
                        src={SavedFilterIcon}
                        alt="Saved Filter"
                        width={16}
                      />
                    }
                  >
                    Save Filter
                  </Button>
                  <SavedFiltersDropdown
                    saveFilterJson={saveFilterJson}
                    applySavedFilterToFilterRow={applySavedFilterToFilterRow}
                  />

                  <Button
                    sx={{
                      padding: "8px 12px",
                      color: theme.palette.grey[300],
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    startIcon={
                      <img src={LogFileIcon} alt="Log File" width={16} />
                    }
                    onClick={handleFilesClick}
                  >
                    Files
                  </Button>

                  <ColumnDropdown
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                    headerList={headerList}
                    setHeaderLabels={setHeaderLabels}
                    handleColumnVisibility={handleColumnVisibility}
                  />

                  <Button
                    onClick={handleAddItemClick}
                    sx={{
                      padding: "8px 12px",
                      color: theme.palette.grey[300],
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    startIcon={<AddIcon />}
                  >
                    New
                  </Button>

                  <Button
                    onClick={handleExportData}
                    sx={{
                      padding: "8px 12px",
                      color: theme.palette.grey[300],
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    startIcon={
                      <img src={ExportDataIcon} alt="Export" width={16} />
                    }
                  >
                    Export
                  </Button>

                  <Button
                    onClick={onImportClick}
                    sx={{
                      padding: "8px 12px",
                      color: theme.palette.grey[300],
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                    }}
                    startIcon={
                      <img src={ImportDataIcon} alt="Import" width={16} />
                    }
                    endIcon={<KeyboardArrowDownRoundedIcon />}
                  >
                    Import Data
                  </Button>

                  <Button
                    sx={{
                      padding: "11px 12px",
                      color: theme.palette.grey[300],
                      border: "1px solid",
                      borderRadius: "8px",
                      borderColor: theme.palette.divider,
                      "&:hover": {
                        color: "white",
                        bgcolor: "rgba(32, 52, 139, 0.1)",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: "40px",
                      width: "fit-content",
                    }}
                    onClick={handleToggle}
                  >
                    <img src={CommentIcon} alt="Comments" width={16} />
                  </Button>
                </>
              ) : (
                <AddNewGridFilter
                  onCancel={onCancel || (() => {})}
                  onSave={onSave || (() => {})}
                  selectedColumns={selectedColumnsForAdd || {}}
                  setSelectedColumns={setSelectedColumnsForAdd || (() => {})}
                  headerList={headerList}
                  handleColumnVisibility={
                    handleEmptyColumnVisibility || (() => {})
                  }
                />
              )}
            </div>
          )}
        </Box>
      </Box>
      <SaveFilterModal
        open={saveFilter}
        onClose={handleCloseSaveFilterModal}
        onSubmit={handleSaveFilterModal}
        defaultLabel={filterName}
      />
      {mutateSaveFilterPending && <LoaderOverlay />}
      {
        <ConfirmationDialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={() => {
            (deleteSelection(), setOpenDeleteModal(false));
          }}
          message="Are you sure you want to delete selected row(s)? This action cannot be undone"
          confirmText="Delete"
          cancelText="Cancel"
        />
      }
      <AddNewItemDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default Filter;
