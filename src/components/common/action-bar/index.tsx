"use client";

import SearchIcon from "@/public/images/search.svg";
import {
  Box,
  Button,
  CircularProgress,
  InputBase,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import React, { useCallback } from "react";
// import Image from "next/image";
import CommentIcon from "@/public/images/comment.svg";
import ExportDataIcon from "@/public/images/export-data.svg";
import ImportDataIcon from "@/public/images/import-data.svg";
import LogFileIcon from "@/public/images/log-file-view.svg";
import RequestsIcon from "@/public/images/requests.svg";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import UploadModal from "../../../components/common/upload-modal";
// import useTranslation from "@/shared/hooks/useTranslation";
import { openConfirmationModal } from "@/utils/getRequestConfirmationModal";

interface ExtendedActionBarProps {
  alignment?: string;
  onAlignmentChange?: (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => void;
  onSearchChange: (search: string) => void;
  setShowFilesModal?: (show: boolean) => void;
  isAddingItem?: boolean;
  onAddItem: () => void;
  addItemInProgress?: boolean;
  setAddItemInProgress?: (value: boolean) => void;
  selectedItems?: Record<number | string, boolean>;
  onClearSelection?: () => void;
  isUpdating?: boolean;
  showUploadModal?: boolean;
  setShowUploadModal?: (value: boolean) => void;
  onBulkStatusUpdate?: (status: string) => void;
  onToggleDrawer?: () => void;
  filterOptions?:
  | { value: string; label: string }[]
  | ((
    t: (ns: string, key: string, options?: any) => string,
  ) => { value: string; label: string }[]);
  showButtons?: {
    files?: boolean;
    add?: boolean;
    export?: boolean;
    import?: boolean;
    filter?: boolean;
    comments?: boolean;
    base_currency?: boolean;
    requests?: boolean;
  };
  templateName?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  useUploadMutation?: any;
  feature: string;
  baseCurrency?: string;
  onExportSelected?: () => void;
  onExportAll?: () => void;
  hasEnableDisablePrivilage?: boolean;
  showCommentModal?: any;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  hasAddPermission?: boolean;
  setShowRequestsModal: React.Dispatch<React.SetStateAction<boolean>>;
  hasImportPermission?: boolean;
  hasExportPermission?: boolean;
}

const DEFAULT_FILTER_OPTIONS = (
  t: (ns: string, key: string) => string,
): { value: string; label: string }[] => [
    { value: "all", label: t("common", "actionBar.filterOptions.all") },
    { value: "enabled", label: t("common", "actionBar.filterOptions.enabled") },
    { value: "disabled", label: t("common", "actionBar.filterOptions.disabled") },
  ];

const ActionBar = ({
  alignment,
  onAlignmentChange,
  onSearchChange,
  setShowFilesModal,
  isAddingItem = false,
  onAddItem,
  setAddItemInProgress,
  selectedItems = {},
  onClearSelection,
  isUpdating = false,
  showUploadModal = false,
  setShowUploadModal,
  onBulkStatusUpdate,
  onToggleDrawer,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  showButtons = {
    files: true,
    add: true,
    export: true,
    import: true,
    filter: true,
    comments: true,
    base_currency: true,
    requests: true,
  },
  templateName = "Generic Template",
  acceptedFileTypes = [".csv", ".xlsx", ".xls"],
  maxFileSize = 10,
  useUploadMutation,
  feature,
  baseCurrency = "NA",
  onExportSelected,
  onExportAll,
  hasEnableDisablePrivilage,
  showCommentModal,
  hasAddPermission,
  setShowRequestsModal,
  setShowLoader,
  hasExportPermission,
  hasImportPermission,
}: ExtendedActionBarProps) => {
  const t = (_ns: string, key: string, _options?: any) => key.split('.').pop()?.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()) || key;
  const theme = useTheme();
  const confirm = (opts: any) => Promise.resolve(window.confirm(opts.message));

  const handleImportData = () => {
    setShowUploadModal?.(true);
  };

  const handleImportComplete = (_fileData: any) => {
    setShowUploadModal?.(false);
  };

  const handleCloseModal = () => {
    setShowUploadModal?.(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleFilesClick = useCallback(() => {
    setShowFilesModal?.(true);
  }, [setShowFilesModal]);

  const handleRequestsClick = useCallback(() => {
    setShowRequestsModal(true);
  }, [setShowRequestsModal]);

  const handleDisableSelection = async () => {
    if (hasEnableDisablePrivilage) {
      onBulkStatusUpdate?.("inactive");
    } else {
      const result = await openConfirmationModal("disable", confirm);
      if (result) {
        showCommentModal?.("inactive");
      } else {
        onClearSelection?.();
      }
    }
  };

  const handleEnableSelection = async () => {
    if (hasEnableDisablePrivilage) {
      onBulkStatusUpdate?.("active");
    } else {
      const result = await openConfirmationModal("enable", confirm);
      if (result) {
        showCommentModal?.("active");
      } else {
        onClearSelection?.();
      }
    }
  };

  const handleAddItem = async () => {
    if (hasAddPermission) {
      onAddItem();
      setAddItemInProgress?.(true);
    } else {
      const result = await openConfirmationModal("add", confirm);
      if (result) {
        onAddItem();
        setAddItemInProgress?.(true);
      } else {
        return;
      }
    }
  };

  const hasSelectedItems = Object.values(selectedItems).some(
    (selected) => selected,
  );

  // Determine which filter options to use
  const resolvedFilterOptions =
    typeof filterOptions === "function" ? filterOptions(t) : filterOptions;

  if (hasSelectedItems) {
    return (
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: "1 1 auto",
            maxWidth: "200px",
          }}
        >
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <img src={SearchIcon} alt="Search" width={16} />
          </Box>
          <InputBase
            placeholder="Search"
            onChange={handleSearchChange}
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: "1 1 auto",
            justifyContent: "flex-end",
          }}
        >
          {alignment !== "disabled" && onBulkStatusUpdate && (
            <Button
              onClick={handleDisableSelection}
              disabled={isUpdating}
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
              startIcon={
                isUpdating ? (
                  <CircularProgress size={16} />
                ) : (
                  <HighlightOffOutlinedIcon />
                )
              }
            >
              Disable Selection
            </Button>
          )}

          {alignment !== "enabled" && onBulkStatusUpdate && (
            <Button
              onClick={handleEnableSelection}
              disabled={isUpdating}
              sx={{
                padding: "8px 16px",
                color: "#22c55e",
                textTransform: "none",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(32, 52, 139, 0.1)",
                },
                "&:disabled": {
                  color: theme.palette.grey[500],
                },
                fontWeight: 500,
              }}
              startIcon={
                isUpdating ? (
                  <CircularProgress size={16} />
                ) : (
                  <CheckCircleOutlineOutlinedIcon />
                )
              }
            >
              Enable Selection
            </Button>
          )}

          {hasExportPermission && (
            <Button
              onClick={onExportSelected}
              disabled={isUpdating}
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
              startIcon={<img src={ExportDataIcon} alt="Export" width={16} />}
            >
              Export Selected
            </Button>
          )}
        </Box>
      </Box>
    );
  }

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: "1 1 auto",
            maxWidth: "200px",
          }}
        >
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={SearchIcon}
              alt={t("common", "actionBar.searchIconAlt")}
              width={16}
            />
          </Box>
          <InputBase
            placeholder={t("common", "actionBar.searchPlaceholder")}
            onChange={handleSearchChange}
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
          {showButtons.requests && (
            <Button
              onClick={handleRequestsClick}
              sx={{
                padding: "8px 12px",
                color: theme.palette.grey[300],
                "&:hover": {
                  color: "white",
                  bgcolor: theme.palette.brand.hover,
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
          )}

          {showButtons.files && (
            <Button
              onClick={handleFilesClick}
              sx={{
                padding: "8px 12px",
                color: theme.palette.grey[300],
                "&:hover": {
                  color: "white",
                  bgcolor: theme.palette.brand.border,
                },
                textTransform: "none",
                fontWeight: 600,
              }}
              startIcon={
                <img
                  src={LogFileIcon}
                  alt={t("common", "actionBar.logFileIconAlt")}
                  width={16}
                />
              }
            >
              {t("common", "actionBar.files")}
            </Button>
          )}

          {showButtons.add && (
            <Button
              onClick={handleAddItem}
              disabled={isAddingItem}
              sx={{
                padding: "8px 12px",
                color: theme.palette.grey[300],
                "&:hover": {
                  color: "white",
                  bgcolor: theme.palette.brand.hover,
                },
                "&:disabled": {
                  color: "white",
                  bgcolor: theme.palette.brand.hover,
                },
                textTransform: "none",
                fontWeight: 600,
              }}
              startIcon={<AddIcon />}
            >
              {t("common", "actionBar.new")}
            </Button>
          )}

          {showButtons.export && hasExportPermission && (
            <Button
              onClick={onExportAll}
              sx={{
                padding: "8px 12px",
                color: theme.palette.grey[300],
                "&:hover": {
                  color: "white",
                  bgcolor: theme.palette.brand.hover,
                },
                textTransform: "none",
                fontWeight: 600,
              }}
              startIcon={
                <img
                  src={ExportDataIcon}
                  alt={t("common", "actionBar.exportDataIconAlt")}
                  width={16}
                />
              }
            >
              {t("common", "actionBar.export")}
            </Button>
          )}

          {showButtons.import && hasImportPermission && setShowUploadModal && (
            <Button
              onClick={handleImportData}
              sx={{
                padding: "8px 12px",
                color: theme.palette.grey[300],
                "&:hover": {
                  color: "white",
                  bgcolor: theme.palette.brand.hover,
                },
                textTransform: "none",
                fontWeight: 600,
              }}
              startIcon={
                <img
                  src={ImportDataIcon}
                  alt={t("common", "actionBar.importDataIconAlt")}
                  width={16}
                />
              }
            >
              {t("common", "actionBar.import")}
            </Button>
          )}

          {showButtons.filter && (
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={onAlignmentChange}
              aria-label="Platform"
              sx={{
                border: "1px solid",
                borderColor: theme.palette.brand.tertiary,
                borderRadius: "9px",
                "& .MuiToggleButton-root": {
                  color: theme.palette.grey[300],
                  textTransform: "none",
                  fontWeight: 600,
                  "&.Mui-selected": {
                    bgcolor: theme.palette.brand.tertiary,
                    color: "white",
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                  },
                  "&:hover": {
                    borderRadius: "8px",
                    bgcolor: theme.palette.brand.hover,
                  },
                },
              }}
            >
              {resolvedFilterOptions.map((option) => (
                <ToggleButton
                  key={option.value}
                  value={option.value}
                  sx={{ padding: "6px 12px", border: "none" }}
                >
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}

          {showButtons.comments && onToggleDrawer && (
            <Button
              onClick={onToggleDrawer}
              sx={{
                padding: "11px 12px",
                color: theme.palette.grey[300],
                border: "1px solid",
                borderRadius: "8px",
                borderColor: theme.palette.brand.tertiary,
                "&:hover": {
                  color: "white",
                  bgcolor: theme.palette.brand.hover,
                },
                textTransform: "none",
                fontWeight: 600,
                minWidth: "40px",
                width: "fit-content",
              }}
            >
              <img
                src={CommentIcon}
                alt={t("common", "actionBar.commentIconAlt")}
                width={16}
              />
            </Button>
          )}
          {showButtons.base_currency && (
            <Box
              sx={{
                padding: "8px 12px",
                color: theme.palette.grey[300],
                border: "1px solid",
                borderRadius: "8px",
                borderColor: theme.palette.brand.tertiary,
                fontWeight: 400,
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "transparent",
                cursor: "default",
                userSelect: "none",
              }}
            >
              {t("common", "actionBar.baseCurrency")}{" "}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {baseCurrency}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {showButtons.import && setShowUploadModal && (
        <UploadModal
          open={showUploadModal}
          onClose={handleCloseModal}
          onImportComplete={handleImportComplete}
          useUploadMutation={useUploadMutation}
          templateName={templateName}
          acceptedFileTypes={acceptedFileTypes}
          maxFileSize={maxFileSize}
          feature={feature}
          setShowLoader={setShowLoader}
        />
      )}
    </>
  );
};

export default ActionBar;
