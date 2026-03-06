import ArrowBackIcon from "@/assets/actions/arrow-left.svg?react";
import CommentIcon from "@/assets/actions/comment.svg?react";
import DatabaseImportIcon from "@/assets/actions/database-import.svg?react";
import FileImportIcon from "@/assets/actions/file-import.svg?react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScenarioStore } from "../store/useScenarioStore";

// Use the same ID as in the page component
const THE_GRID_ID = "ScenarioGridDetails";

interface ActionHeaderProps {
  title?: string;
  onAddItems?: () => void;
  onSaveAsDraft?: () => void;
  onExport?: (format: string) => void;
  onPublish?: () => void;
  onPartialPublish?: (rowIds: string[]) => void;
  isSaving?: boolean;
  isPublishing?: boolean;
  selectedRowsCount?: number;
}

const ActionHeader = ({
  title,
  onAddItems,
  onSaveAsDraft,
  onExport,
  onPublish,
  onPartialPublish,
  isSaving,
  isPublishing,
  selectedRowsCount = 0,
}: ActionHeaderProps) => {
  const navigate = useNavigate();
  const setIsCommentsSidebarOpen = useScenarioStore(
    (state) => state.setIsCommentsSidebarOpen,
  );
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const handleBack = () => navigate("/scenario-builder");

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportOption = (format: string) => {
    onExport?.(format);
    handleExportClose();
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            border: "1px solid #3B9EDC1A",
            borderRadius: 1,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {title && (
          <Typography variant="subtitle1" sx={{ color: "background.default" }}>
            {title}
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button variant="contained" onClick={onSaveAsDraft} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save as draft"}
        </Button>
        <Button
          variant="contained"
          startIcon={<DatabaseImportIcon />}
          onClick={handleExportClick}
        >
          Export
        </Button>
        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleExportClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => handleExportOption("csv")}>CSV</MenuItem>
          <MenuItem onClick={() => handleExportOption("excel")}>Excel</MenuItem>
        </Menu>
        <Button
          variant="contained"
          startIcon={<FileImportIcon />}
          onClick={onAddItems}
        >
          Add Items
        </Button>
        <Button variant="contained" onClick={onPublish} disabled={isPublishing}>
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
        {selectedRowsCount > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              const grid = (window as any).Grids?.[THE_GRID_ID];
              if (grid) {
                const selRows = grid.GetSelRows();
                const rowIds = selRows.map((row: any) => row.id);
                onPartialPublish?.(rowIds);
              }
            }}
            disabled={isPublishing}
          >
            Partial Publish ({selectedRowsCount})
          </Button>
        )}
        <IconButton
          onClick={() => setIsCommentsSidebarOpen(true)}
          sx={{
            borderRadius: 1,
            width: 38,
            height: 38,
            "&:hover": { bgcolor: "#0C4468" },
          }}
        >
          <CommentIcon style={{ color: "white" }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default ActionHeader;
