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
// import Image from "next/image";
import SearchIcon from "@/assets/rate-libraries/search-01.svg";
// import { useTenantId } from "@/shared/utils/getTenantId";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { useListTariffRateComments } from "../../services/tariffRateService";
import formatDate from "@/utils/formatDate";
// import useTranslation from "@/shared/hooks/useTranslation";
// import formatDate from "@/shared/utils/formatDate";

type CommentSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onCommentSelect?: (comment: {
    tenant_id: string;
    tariff_rate_id: string;
    comment_type: string;
    tariff_field_key: string;
  }) => void;
};

type Comment = {
  id: number | string;
  author: string;
  text: string;
  time: string;
};

// Utility to format the timestamp
// const formatTime = (timestamp: string) => {
//   const date = new Date(timestamp);
//   return date.toLocaleString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

const getAvatarColor = (user: string) => {
  const colors = ["#CB5E5E", "#144E72", "#4caf50", "#ff9800", "#9c27b0"];
  let hash = 0;
  for (let i = 0; i < user.length; i++) {
    hash = user.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const CommentSidebar: React.FC<CommentSidebarProps> = ({
  isOpen,
  onClose,
  onCommentSelect,
}) => {
  // const { t } = useTranslation();
  const tenantId = import.meta.env.VITE_TENANT_ID;
  const [searchValue, setSearchValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(0);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const PAGE_SIZE = 10;

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearchValue(val);
        setPage(0);
        setAllComments([]);
        setHasMore(true);
      }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  };

  const { data, isLoading, error } = useListTariffRateComments({
    tenant_id: tenantId,
    search: searchValue,
    skip: page * PAGE_SIZE,
    page_size: PAGE_SIZE,
  });

  // Update comments when new data is fetched
  useEffect(() => {
    if (data?.comments) {
      if (page === 0) {
        // First page or search reset - replace all comments
        setAllComments(data.comments);
      } else {
        // Subsequent pages - append to existing comments
        setAllComments((prev) => [...prev, ...data.comments]);
      }

      // Check if there are more pages
      setHasMore(data.comments.length === PAGE_SIZE);
    }
  }, [data, page]);

  // Reset when search value changes
  useEffect(() => {
    if (searchValue !== inputValue) {
      setPage(0);
      setAllComments([]);
      setHasMore(true);
    }
  }, [searchValue]);

  // Intersection Observer for infinite scroll
  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          rootMargin: "100px", // Load next page when within 100px of the bottom
        },
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  // Reset state when sidebar opens/closes
  useEffect(() => {
    if (isOpen) {
      setPage(0);
      setHasMore(true);
      setSearchValue("");
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Map API response to the Comment type
  const comments: Comment[] = allComments.map((comment: any) => ({
    id: comment.id,
    author: comment.created_by.name,
    text: comment.comment,
    time: formatDate(comment.created_at),
  }));

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

      {/* Search */}
      <Box>
        <TextField
          fullWidth
          sx={{ flexShrink: 0 }}
          placeholder={"Search Comments"}
          size="small"
          variant="outlined"
          value={inputValue}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <img src={SearchIcon} alt="Search" width={25} height={25} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Comments List */}
      <Box
        ref={scrollContainerRef}
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
          scrollbarWidth: "thin", // for Firefox
          scrollbarColor: "#c1c1c1 transparent", // Firefox thumb + track
        }}
      >
        {/* Initial loading state */}
        {isLoading && page === 0 && (
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

        {error && <Typography color="error">Error loading comments</Typography>}

        {!isLoading && !error && comments.length === 0 && page === 0 && (
          <Typography>No comments available</Typography>
        )}

        {comments.map((c, idx) => {
          const original = allComments[idx];
          const isLast = idx === comments.length - 1;

          return (
            <Box
              key={`${c.id}-${idx}`}
              ref={isLast ? lastCommentElementRef : undefined}
              sx={{
                mb: 1,
                p: 1,
                borderRadius: "8px",
                "&:hover": { bgcolor: "#e8e8e8" },
                cursor: "pointer",
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
              }}
              onClick={() =>
                onCommentSelect?.({
                  tenant_id: original.tenant_id,
                  tariff_rate_id: original.tariff_rate_id,
                  comment_type: original.comment_type,
                  tariff_field_key: original.tariff_field_key,
                })
              }
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(c.author),
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {c.author[0].toUpperCase()}
              </Avatar>

              {/* Comment Content */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ color: "#1A2B44", p: 0 }}
                >
                  {c.author}{" "}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    · {c.time}
                  </Typography>
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: "#1A2B44" }}
                >
                  {c.text}
                </Typography>
              </Box>
            </Box>
          );
        })}

        {/* Loading more indicator */}
        {isLoading && page > 0 && (
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
