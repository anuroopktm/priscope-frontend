import { useListScenarioComments } from "@/services/queries/scenario-builder/scenario-builder.queries";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useScenarioStore } from "../../store/useScenarioStore";

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const CommentsSidebar = () => {
  const { id: scenarioId } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");

  const { setIsOpen } = useScenarioStore(
    useShallow((state) => ({
      setIsOpen: state.setIsCommentsSidebarOpen,
    })),
  );

  const { data } = useListScenarioComments(scenarioId, {
    search: search || undefined,
    page_size: 50,
    skip: 0,
  });

  const comments = data?.comments || [];

  const handleCommentClick = (cellRef: string) => {
    if (!cellRef) return;

    // Parse cell_ref (e.g., "row_id:col_name")
    const parts = cellRef.split(":");
    if (parts.length !== 2) return;

    const [rowId, colName] = parts;
    const grid = (window as any).Grids?.["ScenarioGridDetails"];

    if (grid) {
      const targetRow = grid.GetRowById(rowId);

      if (targetRow) {
        // 1. Focus the cell (gives the visual indicator without selecting for publish)
        grid.Focus(targetRow, colName, null, null, 2);

        // 2. Scroll the cell into view
        grid.ScrollIntoView(targetRow, colName);
      } else {
        console.warn(`Row not found: ${rowId}`);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "brand.primary" }}>
          Comments
        </Typography>
        <IconButton
          onClick={() => setIsOpen(false)}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 1,
            width: 32,
            height: 32,
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Comments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: "#F9FAFB",
              "& fieldset": { borderColor: "#E5E7EB" },
            },
          }}
        />
      </Box>

      <Divider />

      {/* Comments List */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {comments.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No comments found
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {comments.map((comment, index) => (
              <ListItem
                key={comment.id}
                onClick={() => handleCommentClick(comment.cell_ref)}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  px: 0,
                  py: 1,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "#E2E8F0",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "#D65A5A",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                      src={comment.created_by.avatar}
                    >
                      {comment.created_by.name?.[0] ||
                        comment.created_by.email?.[0] ||
                        "U"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: "#1E293B" }}
                          >
                            {comment.created_by.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#64748B" }}
                          >
                            {formatTimeAgo(comment.created_at)}
                          </Typography>
                        </Stack>
                        {index === 0 && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#0C4468",
                            }}
                          />
                        )}
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "#334155",
                          lineHeight: 1.5,
                          fontSize: "13.5px",
                          fontWeight: 500,
                        }}
                      >
                        {comment.comment}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default CommentsSidebar;
