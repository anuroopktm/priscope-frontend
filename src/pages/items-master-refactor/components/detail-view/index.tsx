import ExpandIcon from "@/assets/items-master/Button.svg";
import ItemDetailCard from "@/components/common/item-detail";
import TimelineDetail from "@/components/common/timeline";
import { mapHistoryToTimeline } from "@/pages/items-master/utils/mapHistoryToTimeline";
import { mapItemApiToDetailView } from "@/pages/items-master/utils/mapItemApiToDetailView";
import {
  useGetItemMasterById,
  useItemMasterHistory,
} from "@/services/queries/item-master/item-master.queries";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import React from "react";
import closeIcon from "@/assets/items-master/ButtonClose.svg";

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

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton onClick={onExpandClick} size="small">
            <img src={ExpandIcon} alt="Expand" />
          </IconButton>

          <IconButton onClick={onClose} size="small">
            <img src={closeIcon} alt="close" />
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
            borderRadius: "8px",
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
            borderRadius: "8px",
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
