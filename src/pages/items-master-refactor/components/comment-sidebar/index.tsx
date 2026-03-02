import SearchIcon from "@/assets/items-master/search-01.svg";
import CloseIcon from "@mui/icons-material/Close";
import { useListComments } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import { getAvatarColor } from "@/utils/getAvatarColor";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Comment } from "./types";

type CommentSidebarProps = {
  onClose: () => void;
  error?: string | null;
  onCommentSelect?: (comment: Comment) => void;
};

const CommentSidebar = ({ onCommentSelect, onClose }: CommentSidebarProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
  } = useListComments({
    search: searchValue,
    page_size: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(inputValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const comments = data?.pages?.flatMap((page) => page?.comments ?? []) ?? [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography fontWeight={600} sx={{ color: "#1A2B44" }}>
          Comments
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            border: "1px solid #E8E8E8",
            color: "#1A2B44",
            borderRadius: "8px",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <TextField
        fullWidth
        placeholder="Search Comments"
        size="small"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <img src={SearchIcon} alt="search" width={20} height={20} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "8px",
          },
          scrollbarWidth: "thin",
        }}
        onScroll={handleScroll}
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {isError && (
          <Typography color="error">Failed to load comments</Typography>
        )}
        {!isLoading && !isError && comments.length === 0 && (
          <Typography>No comments available</Typography>
        )}
        {comments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              mb: 1,
              p: 1,
              borderRadius: "8px",
              "&:hover": { bgcolor: "#f5f5f5" },
              cursor: "pointer",
              display: "flex",
              gap: 1,
            }}
            onClick={() => onCommentSelect?.(comment)}
          >
            <Avatar
              sx={{
                bgcolor: getAvatarColor(comment.created_by.name),
                width: 24,
                height: 24,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {comment.created_by.name[0].toUpperCase()}
            </Avatar>

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ color: "#1A2B44" }}
              >
                {comment.created_by.name}
              </Typography>

              <Typography variant="body2" sx={{ color: "#1A2B44" }}>
                {comment.comment}
              </Typography>
            </Box>
          </Box>
        ))}

        {isFetchingNextPage && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentSidebar;
