import ClockIcon from "@/assets/common/clock.svg";
import CommentIcon from "@/assets/common/comment-02.svg";
import CloseIcon from "@/assets/common/multiplication-sign.svg";
import UserIcon from "@/assets/common/user-circle.svg";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useListApprovalRequests } from "@/services/queries/freight/freight.queries";
import { getRequestTitle } from "@/utils/getRequestsTitle";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RequestContent } from "./RequestContent";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

interface Props {
  open?: boolean;
  onClose: (value: boolean) => void;
}

export const ItemMasterRequestsModal: React.FC<Props> = ({
  open = true,
  onClose,
}) => {
  const theme = useTheme();
  const tenantId = import.meta.env.VITE_TENANT_ID!;
  const pageSize = 10;

  const [alignment, setAlignment] = useState("all");
  const [page, setPage] = useState(0);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { mutate, data, isPending, isError } = useListApprovalRequests();

  useEffect(() => {
    setPage(0);
    setAllRequests([]);
    setHasMore(true);

    mutate({
      tenant_id: tenantId,
      search: "",
      filter: {
        target_module: ["item_master"],
        ...(alignment !== "all" ? { status: [alignment] } : {}),
      },
      page_size: pageSize,
      skip: 0,
    });
  }, [alignment, tenantId, mutate]);

  useEffect(() => {
    if (data?.requests) {
      if (page === 0) {
        setAllRequests(data.requests);
      } else {
        setAllRequests((prev) => [...prev, ...data.requests]);
      }
      setHasMore(data.requests.length === pageSize);
    }
  }, [data, page]);

  const requests = useMemo(() => {
    return allRequests.map((item: any) => {
      const requestedAt = new Date(item.requested_at);
      // const reviewedAt = item.reviewed_at ? new Date(item.reviewed_at) : null;

      return {
        id: item.id,
        title: getRequestTitle(item),
        status: item.status,
        requestDate: requestedAt.toLocaleDateString("en-GB"),
        requestTime: requestedAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        requestedBy: item?.requested_by?.name ?? "",
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
        target_module: ["item_master"],
        ...(alignment !== "all" ? { status: [alignment] } : {}),
      },
      page_size: pageSize,
      skip: nextPage * pageSize,
    });
  }, [isPending, hasMore, page, tenantId, alignment, mutate]);

  const lastElementRef = useInfiniteScroll({
    isLoading: isPending,
    hasMore,
    onLoadMore,
    rootMargin: "100px",
  });

  const handleClose = () => onClose(false);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          maxHeight: "75vh",
          minHeight: "75vh",
          maxWidth: "771px",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
            pb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Requests
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={(_, val) => val && setAlignment(val)}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: theme.palette.brand.tertiary,
                "& .MuiToggleButton-root": {
                  color: theme.palette.brand.tertiary,
                  fontWeight: 600,
                  "&.Mui-selected": {
                    bgcolor: theme.palette.brand.tertiary,
                    color: "white",
                  },
                },
              }}
            >
              {FILTER_OPTIONS.map((option) => (
                <ToggleButton key={option.value} value={option.value}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <IconButton onClick={handleClose}>
              <img src={CloseIcon} alt="close" width={18} />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ overflow: "auto" }}>
        {isPending && requests.length === 0 && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Typography color="error">Failed to load requests.</Typography>
        )}

        {!isPending && requests.length === 0 && (
          <Typography align="center" py={4}>
            No requests found.
          </Typography>
        )}

        {requests.map((request, index) => (
          <Box
            key={request.id}
            ref={index === requests.length - 1 ? lastElementRef : null}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 1,
              bgcolor: "#ecf6fc",
            }}
          >
            <Typography fontWeight={600} mb={1}>
              {request.title}
            </Typography>

            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <Chip label={request.status} size="small" />
              <Box display="flex" alignItems="center" gap={0.5}>
                <img src={UserIcon} width={16} />
                <Typography variant="body2">{request.requestedBy}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <img src={ClockIcon} width={16} />
                <Typography variant="body2">
                  {request.requestDate} {request.requestTime}
                </Typography>
              </Box>
            </Box>

            <Box mt={2}>
              <RequestContent
                requestInfo={request.requestInfo}
                requestAction={request.requestAction}
              />
            </Box>

            {request.comments && (
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                bgcolor="#3333330D"
                p={1}
                borderRadius={1}
                mt={2}
              >
                <img src={CommentIcon} width={16} />
                <Typography variant="body2">{request.comments}</Typography>
              </Box>
            )}
          </Box>
        ))}

        {isPending && requests.length > 0 && (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
