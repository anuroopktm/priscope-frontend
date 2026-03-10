import { useListModuleImportSummaryCount } from "@/services/queries/common/common.queries";
import { Box, CircularProgress, Typography } from "@mui/material";
import StatsSummaryBar from "../../status-summary-bar";

const FileStatsLoader = ({
  fileId,
  module,
}: {
  fileId: string;
  module: any;
}) => {
  const { data, isLoading, isError } = useListModuleImportSummaryCount(
    fileId,
    module,
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Typography color="error" variant="body2">
        Failed to load file stats.
      </Typography>
    );
  }

  return (
    <StatsSummaryBar
      totalProcessed={data.total_count ?? 0}
      successfullyImported={data.success_count ?? 0}
      skippedErrored={data.error_count ?? 0}
    />
  );
};
export default FileStatsLoader;
