import ExportDataIcon from "@/assets/common/export-data.svg";
import ImportDataIcon from "@/assets/common/import-data.svg";
import LogFileIcon from "@/assets/common/log-file-view.svg";
import RequestsIcon from "@/assets/items-master/requests.svg";
import ConfirmationDialog from "@/components/common/upload-modal/confirmation-modal";
import {
  AddOutlined,
  BookmarkBorderOutlined,
  FilterListOutlined,
  KeyboardArrowDown,
  Search,
} from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import { useState } from "react";
import ConfirmationDialog from "@/components/common/upload-modal/confirmation-modal";
import ColumnDropdown from "@/pages/items-master/components/columns-dropdown";

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
  setSelectedColumns
}: FilterProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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

  return (
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
      {/* Left: Search Bar */}
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

      {/* Right: Actions */}
      <Stack direction="row" spacing={1} alignItems="center">
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
                // disabled={isUpdating}
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
              // sx={{
              //   padding: "8px 12px",
              //   color: theme.palette.grey[300],
              //   "&:hover": {
              //     color: "white",
              //     bgcolor: theme.palette.brand.hover,
              //   },
              //   textTransform: "none",
              //   fontWeight: 600,
              // }}
              startIcon={<img src={RequestsIcon} alt={"request"} width={16} />}
            >
              Request
            </Button>
            <Button
              variant="contained"
              // sx={{
              //   padding: "8px 12px",
              //   color: theme.palette.grey[300],
              //   "&:hover": {
              //     color: "white",
              //     bgcolor: "rgba(255, 255, 255, 0.1)",
              //   },
              //   textTransform: "none",
              //   fontWeight: 600,
              // }}
              startIcon={<img src={LogFileIcon} alt="Log File" width={16} />}
              onClick={handleFilesClick}
            >
              Files
            </Button>

            {/* Columns Dropdown Mock */}
            {/* <Button variant="contained" endIcon={<KeyboardArrowDown />}>
              Columns
            </Button> */}
            <ColumnDropdown
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              headerList={headerLabels}
              setHeaderLabels={setHeaderLabels}
              // handleColumnVisibility={handleColumnVisibility}
            />

            {/* Saved Filters Dropdown Mock */}
            <Button
              variant="contained"
              startIcon={<BookmarkBorderOutlined />}
              endIcon={<KeyboardArrowDown />}
            >
              Saved Filters
            </Button>

            {/* Show Filter */}
            <Button variant="contained" startIcon={<FilterListOutlined />}>
              Show Filter
            </Button>

            {/* Add Item */}
            <Button variant="contained" startIcon={<AddOutlined />}>
              Add Item
            </Button>

            {/* Import Data Dropdown */}
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
          </>
        )}
      </Stack>
      {
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
      }
    </Box>
  );
};
