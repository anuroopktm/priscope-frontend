"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  CircularProgress,
} from "@mui/material";
import ClockIcon from "@/assets/common/clock.svg";
import CloseIcon from "@/assets/common/multiplication-sign.svg";
import UserIcon from "@/assets/common/user-circle.svg";
import CommentIcon from "@/assets/common/comment-02.svg";
import { useListApprovalRequests } from "@/services/queries/freight/freight.queries";
import { RequestSummary } from "./requests-summary";
import { getRequestTitle } from "@/utils/getRequestsTitle";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

interface FileDetailsModalProps {
  open?: boolean;
  onClose: any;
  targetModule: string;
}

const RequestsModal: React.FC<FileDetailsModalProps> = ({
  open = true,
  onClose,
  targetModule,
}) => {
  const [alignment, setAlignment] = useState(FILTER_OPTIONS[0].value);
  const [page, setPage] = useState(0);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();
  const tenantId = import.meta.env.VITE_TENANT_ID!;

  const { mutate, data, isPending, isError } = useListApprovalRequests();
  const pageSize = 10;

  useEffect(() => {
    // Reset page and requests when filter or targetModule changes
    setPage(0);
    setAllRequests([]);
    setHasMore(true);
    mutate({
      tenant_id: tenantId,
      search: "",
      filter: {
        target_module: [targetModule],
        ...(alignment !== "all" ? { status: [alignment] } : {}),
      },
      page_size: pageSize,
      skip: 0,
    });
  }, [alignment, tenantId, targetModule, mutate]);

  // Update requests when new data is fetched
  useEffect(() => {
    if (data?.requests) {
      if (page === 0) {
        // First page or filter reset - replace all requests
        setAllRequests(data.requests);
      } else {
        // Subsequent pages - append to existing requests
        setAllRequests((prev) => [...prev, ...data.requests]);
      }
      // Check if there are more pages
      setHasMore(data.requests.length === pageSize);
    }
  }, [data, page, pageSize]);

  const requests = useMemo(() => {
    return allRequests.map((item: any) => {
      const requestedAt = new Date(item.requested_at);
      const reviewedAt = item.reviewed_at ? new Date(item.reviewed_at) : null;

      return {
        id: item.id,
        title: getRequestTitle(item),
        status: item.status,
        requestDate: requestedAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        requestTime: requestedAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        requestedBy: item?.requested_by?.name ?? "",
        reviewedDate: reviewedAt
          ? reviewedAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : null,
        comments: item.request_comments ?? "",
        requestAction: item.request_action,
        requestInfo: item.request_info,
      };
    });
  }, [allRequests]);

  const onLoadMore = useCallback(() => {
    if (isPending || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    mutate({
      tenant_id: tenantId,
      search: "",
      filter: {
        target_module: [targetModule],
        ...(alignment !== "all" ? { status: [alignment] } : {}),
      },
      page_size: pageSize,
      skip: nextPage * pageSize,
    });
  }, [
    isPending,
    hasMore,
    page,
    tenantId,
    targetModule,
    alignment,
    mutate,
    pageSize,
  ]);

  const lastElementRef = useInfiniteScroll({
    isLoading: isPending,
    hasMore,
    onLoadMore,
    rootMargin: "100px",
  });

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  const handleCloseFileModal = () => {
    onClose(false);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleCloseFileModal}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          maxHeight: "75vh",
          minHeight: "75vh",
          maxWidth: "771px",
          paddingBottom: "24px",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            height: "55px",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Requests
          </Typography>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="File filter"
              sx={{
                height: "32px",
                border: "1px solid",
                borderColor: theme.palette.brand.tertiary,
                borderRadius: "9px",
                "& .MuiToggleButton-root": {
                  color: theme.palette.brand.tertiary,
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
              {FILTER_OPTIONS.map((option) => (
                <ToggleButton
                  key={option.value}
                  value={option.value}
                  sx={{ padding: "6px 12px", border: "none" }}
                >
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <IconButton
              onClick={handleCloseFileModal}
              size="small"
              sx={{
                // border: "1px solid #1A2B441A",
                borderRadius: "5px",
                padding: "7px",
                height: "32px",
                width: "32px",
                backgroundColor: "white",
              }}
            >
              <img src={CloseIcon} alt="Close" width={20} height={20} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          paddingBottom: "0px",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isPending && requests.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Typography color="error">Failed to load requests.</Typography>
        )}
        {!isPending && !isError && requests.length === 0 && (
          <Typography sx={{ textAlign: "center", py: 4 }}>
            No requests found.
          </Typography>
        )}
        {requests.map((request: any, index: number) => (
          <Box
            key={request.id}
            ref={index === requests.length - 1 ? lastElementRef : null}
            sx={{
              borderBottom: index < requests.length - 1 ? 1 : 0,
              borderRadius: "1px",
              borderColor: "divider",
              background: "#ecf6fc",
              mb: 2,
              px: 2,
              py: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {request.title}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={request.status}
                size="small"
                sx={{
                  backgroundColor: "#e8f5e8",
                  color: "#2e7d32",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <img
                  src={UserIcon}
                  alt="User"
                  width={20}
                  height={20}
                  style={{ padding: 2 }}
                />
                <Typography variant="body2" color="#1A2B44">
                  {request.requestedBy}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <img
                  src={ClockIcon}
                  alt="Clock"
                  width={20}
                  height={20}
                  style={{ padding: 2 }}
                />
                <Typography variant="body2" color="#1A2B44">
                  {request.requestDate} {request.requestTime}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
              <RequestSummary
                requestInfo={request.requestInfo}
                requestAction={request.requestAction}
                sourceModule={allRequests[0]?.source_module || ""}
                module={targetModule}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                bgcolor: "#3333330D",
                p: 1,
                mt: 1,
                borderColor: "grey.300",
                borderRadius: 8,
              }}
            >
              <img
                src={CommentIcon}
                alt="comment"
                width={20}
                height={20}
                style={{ padding: 2 }}
              />
              <Typography
                variant="body2"
                color="#777777"
                sx={{ fontWeight: 400 }}
              >
                {request.comments}
              </Typography>
            </Box>
          </Box>
        ))}
        {isPending && requests.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestsModal;
