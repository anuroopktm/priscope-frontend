"use client";

import React from "react";
import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import ItemDetailCard from "@/shared/components/item-detail";
import TimelineDetail from "@/shared/components/timeline";
import { GridCloseIcon } from "@mui/x-data-grid";
import ExpandIcon from "@/public/images/arrow-expand.svg";
import Image from "next/image";
import {
  useGetItemMasterById,
  useItemMasterHistory,
} from "../../services/itemMasterService";
import { mapItemApiToDetailView } from "../../utils/mapItemApiToDetailView";
import { mapHistoryToTimeline } from "../../utils/mapHistoryToTimeline";

interface DetailViewProps {
  item_id: string;
  timelineTitle: string;
  onExpandClick?: () => void;
  onClose?: () => void;
}

const SectionLoader = () => (
  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
    <CircularProgress size={28} />
  </Box>
);

const DetailView: React.FC<DetailViewProps> = ({
  item_id,
  timelineTitle,
  onExpandClick,
  onClose,
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: 1,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          pb: 0,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Details
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onExpandClick}
            size="small"
            sx={{ border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <Image src={ExpandIcon} alt="Expand" width={18} height={18} />
          </IconButton>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{ border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <GridCloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr" }}
        gap={1}
        sx={{ height: "92%", width: "100%", p: 1 }}
      >
        {/* Item Details */}
        <Box
          sx={{
            overflowY: "auto",
            height: "100%",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            bgcolor: "white",
          }}
        >
          {itemLoading && <SectionLoader />}

          {itemError && !itemData && (
            <Typography color="error" p={2} variant="body2">
              Failed to load item details
            </Typography>
          )}

          {!itemLoading && itemData && (
            <ItemDetailCard
              title={detailData.title}
              fields={detailData.items}
            />
          )}
        </Box>

        {/* Timeline */}
        <Box
          sx={{
            overflowY: "auto",
            height: "100%",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            bgcolor: "white",
          }}
        >
          {historyLoading && <SectionLoader />}

          {historyError && !historyData && (
            <Typography color="error" p={2} variant="body2">
              Failed to load history
            </Typography>
          )}

          {!historyLoading && historyData && (
            <TimelineDetail title={timelineTitle} data={formattedHistoryData} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetailView;
