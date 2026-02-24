"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

import ItemDetailCard from "@/shared/components/item-detail";
import TimelineDetail from "@/shared/components/timeline";

import {
  useGetItemMasterById,
  useItemMasterHistory,
} from "../../services/itemMasterService";
import { mapItemApiToDetailView } from "../../utils/mapItemApiToDetailView";
import { mapHistoryToTimeline } from "../../utils/mapHistoryToTimeline";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item_id: string;
  timelineTitle: string;
}

const SectionLoader = () => (
  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
    <CircularProgress size={28} />
  </Box>
);

export const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  item_id,
  timelineTitle,
}) => {
  const {
    data: itemData,
    isLoading: itemLoading,
    error: itemError,
  } = useGetItemMasterById(item_id);

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useItemMasterHistory({
    item_id,
    search: "",
  });

  const detailData = React.useMemo(
    () => mapItemApiToDetailView(itemData),
    [itemData],
  );

  const formattedHistoryData = React.useMemo(
    () => mapHistoryToTimeline(historyData),
    [historyData],
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "100vw",
          height: "70vh",
          alignSelf: "start",
          mt: 17,
          borderRadius: 8,
          gap: "8px",
          p: "24px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Details
        </Typography>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{ border: "1px solid #ccc", borderRadius: "8px" }}
        >
          <GridCloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={2}
          sx={{ height: "100%", width: "100%" }}
        >
          <Box
            sx={{
              overflowY: "auto",
              height: "100%",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              p: 2,
              pt: 0,
              bgcolor: "white",
            }}
          >
            {itemLoading && !itemData && <SectionLoader />}

            {itemError && !itemData && (
              <Typography color="error" p={2} variant="body2">
                Failed to load item details
              </Typography>
            )}

            {itemData && (
              <ItemDetailCard
                title={detailData.title}
                fields={detailData.items}
              />
            )}
          </Box>

          <Box
            sx={{
              overflowY: "auto",
              height: "100%",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              p: 2,
              pt: 0,
              bgcolor: "white",
            }}
          >
            {historyLoading && !historyData && <SectionLoader />}

            {historyError && !historyData && (
              <Typography color="error" p={2} variant="body2">
                Failed to load history
              </Typography>
            )}

            {historyData && (
              <TimelineDetail
                title={timelineTitle}
                data={formattedHistoryData}
              />
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
