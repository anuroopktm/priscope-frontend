import { Box, Divider, Typography } from "@mui/material";

const StatsSummaryBar = ({
  totalProcessed,
  successfullyImported,
  skippedErrored,
}: {
  totalProcessed: number;
  successfullyImported: number;
  skippedErrored: number;
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        height: "57px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Total Processed */}
      <Box sx={{ px: 2, flex: 1 }}>
        <Typography fontSize={14} fontWeight={500} color="#1F2937">
          Total Processed
        </Typography>
        <Typography fontSize={14} fontWeight={600} color="#3B82F6">
          {totalProcessed}
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Successfully Imported */}
      <Box sx={{ px: 2, flex: 1 }}>
        <Typography fontSize={14} fontWeight={500} color="#1F2937">
          Successfully Imported
        </Typography>
        <Typography fontSize={14} fontWeight={600} color="#22C55E">
          {successfullyImported}
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Skipped / Errored */}
      <Box sx={{ px: 2, flex: 1 }}>
        <Typography fontSize={14} fontWeight={500} color="#1F2937">
          Skipped/Errored Rows
        </Typography>
        <Typography fontSize={14} fontWeight={600} color="#EF4444">
          {skippedErrored}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatsSummaryBar;