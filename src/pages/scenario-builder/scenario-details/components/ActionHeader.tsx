import ArrowBackIcon from "@/assets/actions/arrow-left.svg?react";
import CommentIcon from "@/assets/actions/comment.svg?react";
import DatabaseImportIcon from "@/assets/actions/database-import.svg?react";
import FileImportIcon from "@/assets/actions/file-import.svg?react";
import { useSearchItemGroups } from "@/services/queries/common/common.queries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import debounce from "lodash.debounce";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScenarioStore } from "../store/useScenarioStore";

const THE_GRID_ID = "ScenarioGridDetails";

export interface ActionHeaderProps {
  title?: string;
  status?: string;
  onAddItems?: () => void;
  onAddGroupItems?: (groupIds: string[]) => void;
  onSaveAsDraft?: () => void;
  onExport?: (format: string) => void;
  onPublish?: () => void;
  onPartialPublish?: (itemIds: string[], groupIds: string[]) => void;
  onDeleteSelected?: () => void;
  isSaving?: boolean;
  isPublishing?: boolean;
  selectedRowsCount?: number;
}

const ActionHeader = ({
  title,
  status,
  onAddItems,
  onAddGroupItems,
  onSaveAsDraft,
  onExport,
  onPublish,
  onPartialPublish,
  onDeleteSelected,
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

  // Group Adding State
  const [searchGroupTerm, setSearchGroupTerm] = useState<string>("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [groupAnchorEl, setGroupAnchorEl] = useState<null | HTMLElement>(null);

  const debouncedSearch = useMemo(
    () => debounce((newValue: string) => setSearchGroupTerm(newValue), 500),
    [],
  );

  const { data: groupsData, isLoading: isLoadingGroups } = useSearchItemGroups({
    page_size: 50,
    skip: 0,
    search: searchGroupTerm,
  });

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

  const handleGroupMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGroupAnchorEl(event.currentTarget);
  };

  const handleGroupMenuClose = () => {
    setGroupAnchorEl(null);
    setSelectedGroupIds([]);
  };

  const handleToggleGroup = (id: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAddGroupClick = () => {
    if (selectedGroupIds.length > 0) {
      onAddGroupItems?.(selectedGroupIds);
      handleGroupMenuClose(); // reset after adding
    }
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
          <>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleGroupMenuOpen}
            >
              Group
            </Button>
            <Popover
              open={Boolean(groupAnchorEl)}
              anchorEl={groupAnchorEl}
              onClose={handleGroupMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{ mt: 1 }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  minWidth: 320,
                }}
              >
                <TextField
                  placeholder="Search Groups"
                  size="small"
                  fullWidth
                  onChange={(e) => debouncedSearch(e.target.value)}
                  InputProps={{
                    endAdornment: isLoadingGroups ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null,
                  }}
                />
                <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                  {isLoadingGroups && !(groupsData as any)?.groups?.length ? (
                    <ListItem dense sx={{ py: 0 }}>
                      <ListItemText
                        primary="Loading..."
                        primaryTypographyProps={{
                          variant: "body2",
                          style: { fontSize: "13px" },
                        }}
                      />
                    </ListItem>
                  ) : null}
                  {!isLoadingGroups && !(groupsData as any)?.groups?.length ? (
                    <ListItem dense sx={{ py: 0 }}>
                      <ListItemText
                        primary="No groups found"
                        primaryTypographyProps={{
                          variant: "body2",
                          style: { fontSize: "13px" },
                        }}
                      />
                    </ListItem>
                  ) : null}
                  {(groupsData as any)?.groups?.map((group: any) => {
                    const labelId = `checkbox-list-label-${group.id}`;
                    const isChecked = selectedGroupIds.includes(group.id);
                    return (
                      <ListItem key={group.id} disableGutters>
                        <ListItemButton
                          role={undefined}
                          onClick={() => handleToggleGroup(group.id)}
                          dense
                        >
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <Checkbox
                              edge="start"
                              size="small"
                              checked={isChecked}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                              sx={{ p: 0.5 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={labelId}
                            primary={group.name}
                            primaryTypographyProps={{
                              variant: "body2",
                              style: { fontSize: "13px" },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={handleAddGroupClick}
                  disabled={selectedGroupIds.length === 0}
                >
                  Add ({selectedGroupIds.length})
                </Button>
              </Box>
            </Popover>

            <Button
              variant="contained"
              onClick={() => onSaveAsDraft?.()}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save as draft"}
            </Button>
          </>
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
            {!isPublished && selectedRowsCount > 0 && (
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => onDeleteSelected?.()}
                sx={{
                  color: "red",
                  minWidth: "90px",
                }}
              >
                Delete ({selectedRowsCount})
              </Button>
            )}
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
