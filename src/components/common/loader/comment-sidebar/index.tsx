"use client";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { debounce } from "lodash";
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import SearchIcon from "@/assets/items-master/search-01.svg";
import { getAvatarColor } from "@/utils/getAvatarColor";
import type { Comment } from "./types";

type CommentSidebarProps<T> = {
  isOpen: any;
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
  pageSize?: number;
  onCommentSelect?: (comment: Comment) => void;
  renderComment?: (comment: Comment, index: number) => React.ReactNode;
  title?: string;
  listComments: any; // Function to call API
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CommentSidebar = <T,>({
  isOpen,
  onClose,
  isLoading = false,
  error = null,
  listComments,
  title = "Comments",
  onCommentSelect,
  renderComment,
  pageSize = 50,
}: CommentSidebarProps<T>) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchComments = useCallback(
    async (pageNum = 0, search = "") => {
      const payload: any = {
        skip: pageNum * pageSize,
        page_size: pageSize,
      };

      if (search) payload.search = search;

      setLoading(true);

      listComments(payload, {
        onSuccess: (res: any) => {
          const newComments = res.comments || [];

          if (pageNum === 0) {
            setComments(newComments);
          } else {
            setComments((prev) => [...prev, ...newComments]);
          }

          setHasMore(newComments.length === pageSize);
        },
        onError: () => {
          setHasMore(false);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    },
    [listComments, pageSize]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearchValue(val);
        setPage(0);
        fetchComments(0, val);
      }, 500),
    [fetchComments]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  };

  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchComments(nextPage, searchValue);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchComments, searchValue]
  );

  useEffect(() => {
    if (isOpen) {
      setComments([]);
      setPage(0);
      setInputValue("");
      setSearchValue("");
      fetchComments(0);
    }
  }, [isOpen, fetchComments]);

  if (!isOpen) return null;

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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography fontWeight={600} sx={{ color: "#1A2B44" }}>
          {title}
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

      {/* Search */}
      <Box>
        <TextField
          fullWidth
          placeholder="Search Comments"
          size="small"
          variant="outlined"
          value={inputValue}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <img
                    src={SearchIcon}
                    alt="search"
                    width={25}
                    height={25}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Comments List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a8a8a8",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c1c1 transparent",
        }}
      >
        {/* Loading first page */}
        {loading && page === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Error */}
        {error && <Typography color="error">{error}</Typography>}

        {/* Empty */}
        {!loading && !error && comments.length === 0 && (
          <Typography>No comments available</Typography>
        )}

        {/* Comment items */}
        {comments.map((comment, idx) => {
          const isLast = idx === comments.length - 1;
          return renderComment ? (
            <Box
              key={`${comment.id}-${idx}`}
              ref={isLast ? lastCommentElementRef : undefined}
              onClick={() => onCommentSelect?.(comment)}
            >
              {renderComment(comment, idx)}
            </Box>
          ) : (
            <Box
              key={`${comment.id}-${idx}`}
              ref={isLast ? lastCommentElementRef : undefined}
              sx={{
                mb: 1,
                p: 1,
                borderRadius: "8px",
                "&:hover": { bgcolor: "#e8e8e8" },
                cursor: "pointer",
                display: "flex",
                gap: 1,
              }}
              onClick={() => onCommentSelect?.(comment)}
            >
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(comment.created_by.name),
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {comment.created_by.name[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ color: "#1A2B44", p: 0 }}
                >
                  {comment.created_by.name}{" "}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    · {formatTime(comment.created_at)}
                  </Typography>
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: "#1A2B44" }}
                >
                  {comment.comment}
                </Typography>
              </Box>
            </Box>
          );
        })}

        {/* Loading more */}
        {loading && page > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <CircularProgress size={20} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentSidebar;