import { Box, Stack, Typography } from "@mui/material";
import StatusChip from "./StatusChip";
import FileStatsLoader from "./FileStatsLoader";
import { theme } from "@/theme/theme";
import CalendarIcon from "@/assets/common/calendar.svg";
import ClockIcon from "@/assets/common/clock.svg";
import DownloadIcon from "@/assets/common/download.svg";
import UserIcon from "@/assets/common/user-circle.svg";
import type { UploadedFile } from "@/pages/items-master-refactor/types/types";

interface UploadedCardProps {
  key: string;
  file: UploadedFile;
  module: string;
  onDownloadError: any;
}
const UploadCard = ({ file, module, onDownloadError }: UploadedCardProps) => {
  return (
    <Box
      key={file.id}
      sx={{
        backgroundColor: "#3B9EDC1A",
        borderRadius: "5px",
        px: 3,
        py: 2,
        mb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            color: "#000000",
          }}
        >
          {file.title}
        </Typography>

        {file.errorFile && (
          <Typography
            onClick={onDownloadError}
            sx={{
              color: theme.palette.brand.tertiary,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            <img src={DownloadIcon} alt="Download" width={20} height={20} />
            Error File
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <StatusChip status={file.status} />

        <Stack direction="row" spacing={1} alignItems="center">
          <img src={UserIcon} alt="User" width={20} height={20} />
          <Typography variant="body2">{file.uploadedBy}</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <img src={ClockIcon} alt="Clock" width={20} height={20} />
          <Typography variant="body2">
            {file.uploadDate} {file.uploadTime}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <img src={CalendarIcon} alt="Calendar" width={20} height={20} />
          <Typography variant="body2">{file.updatedDate}</Typography>
        </Stack>
      </Stack>

      {file.hasUploadData && (
        <Box sx={{ mt: 2 }}>
          <FileStatsLoader fileId={file.id} module={module} />
        </Box>
      )}
    </Box>
  );
};
export default UploadCard;
