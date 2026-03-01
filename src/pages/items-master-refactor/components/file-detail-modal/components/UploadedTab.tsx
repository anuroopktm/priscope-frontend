import { Box, Typography } from "@mui/material";
import CenteredLoader from "./Loader";
import UploadCard from "./UploadCard";
import type { UploadedFile } from "@/pages/items-master-refactor/types/types";

export interface UploadedTabProps {
  data: UploadedFile[];
  loading: boolean;
  error: boolean;
  module: string;
  onDownloadError: (payload: any, options?: any) => void;
}
const UploadedTab = ({
  data,
  loading,
  error,
  module,
  onDownloadError,
}: UploadedTabProps) => {
  if (loading) return <CenteredLoader />;

  if (error)
    return <Typography color="error">Failed to load files.</Typography>;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, padding: "24px" }}
    >
      {data.map((file) => (
        <UploadCard
          key={file.id}
          file={file}
          module={module}
          onDownloadError={onDownloadError}
        />
      ))}
    </Box>
  );
};
export default UploadedTab;
