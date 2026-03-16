import ArrowBackIcon from "@/assets/actions/arrow-left.svg?react";
import CommentIcon from "@/assets/actions/comment.svg?react";
import DatabaseImportIcon from "@/assets/actions/database-import.svg?react";
import FileImportIcon from "@/assets/actions/file-import.svg?react";
import HistoryIcon from "@mui/icons-material/History";
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

const THE_GRID_ID = "ScenarioGridDetails";

interface ActionHeaderProps {
  title?: string;
  status?: string;
  onAddItems?: () => void;
  onSaveAsDraft?: () => void;
  onExport?: (format: string) => void;
  onPublish?: () => void;
  onPartialPublish?: (itemIds: string[], groupIds: string[]) => void;
  isSaving?: boolean;
  isPublishing?: boolean;
  selectedRowsCount?: number;
}

const ActionHeader = ({
  title,
  status,
  onAddItems,
  onSaveAsDraft,
  onExport,
  onPublish,
  onPartialPublish,
  isSaving,
  isPublishing,
  selectedRowsCount = 0,
}: ActionHeaderProps) => {
  const isPublished = status === "published";
  const navigate = useNavigate();
  const setIsCommentsSidebarOpen = useScenarioStore(
    (state) => state.setIsCommentsSidebarOpen,
  );
  const setIsActivitiesSidebarOpen = useScenarioStore(
    (state) => state.setIsActivitiesSidebarOpen,
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
        {!isPublished && (
          <Button
            variant="contained"
            onClick={() => onSaveAsDraft?.()}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save as draft"}
          </Button>
        )}
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
        {!isPublished && (
          <>
            <Button
              variant="contained"
              startIcon={<FileImportIcon />}
              onClick={onAddItems}
            >
              Add Items
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedRowsCount > 0) {
                  const grid = (window as any).Grids?.[THE_GRID_ID];
                  if (grid) {
                    const selRows = grid.GetSelRows();
                    const itemIdSet = new Set<string>();
                    const groupIdSet = new Set<string>();

                    const collectItemIdsRecursive = (parentRow: any) => {
                      let child = parentRow.firstChild;
                      while (child) {
                        if (child.itemId) {
                          itemIdSet.add(child.itemId);
                        }
                        if (child.firstChild) {
                          collectItemIdsRecursive(child);
                        }
                        child = child.nextSibling;
                      }
                    };

                    selRows.forEach((row: any) => {
                      if (row.Def?.Name === "Group" || row.firstChild) {
                        groupIdSet.add(row.id);
                        collectItemIdsRecursive(row);
                      } else {
                        itemIdSet.add(row.itemId || row.id);
                      }
                    });

                    onPartialPublish?.(
                      Array.from(itemIdSet),
                      Array.from(groupIdSet),
                    );
                  }
                } else {
                  onPublish?.();
                }
              }}
              loading={isPublishing}
              sx={{ minWidth: "90px" }}
            >
              {selectedRowsCount > 0
                ? `Publish (${selectedRowsCount})`
                : "Publish"}
            </Button>
          </>
        )}
        <IconButton
          onClick={() => {
            setIsActivitiesSidebarOpen(true);
            setIsCommentsSidebarOpen(false);
          }}
          sx={{
            borderRadius: 1,
            width: 38,
            height: 38,
            "&:hover": { bgcolor: "#0C4468" },
          }}
        >
          <HistoryIcon style={{ color: "white" }} />
        </IconButton>
        <IconButton
          onClick={() => {
            setIsCommentsSidebarOpen(true);
            setIsActivitiesSidebarOpen(false);
          }}
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
