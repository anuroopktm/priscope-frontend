import { Box, Divider, List, ListItem, Stack, Typography } from "@mui/material";
import CenteredLoader from "./Loader";
import { useState } from "react";
import StatusChip from "./StatusChip";
import ClockIcon from "@/assets/common/clock.svg";
import DownloadIcon from "@/assets/common/download.svg";
import UserIcon from "@/assets/common/user-circle.svg";
import { theme } from "@/theme/theme";
import type { ExportedFile } from "@/pages/items-master-refactor/types/types";
interface DownloadedTabProps {
  data: ExportedFile[];
  loading: boolean;
  error: boolean;
  onDownload: (id: string) => void;
}
const DownloadedTab = ({
  data,
  loading,
  error,
  onDownload,
}: DownloadedTabProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (loading) return <CenteredLoader />;
  if (error)
    return <Typography color="error">Failed to load files.</Typography>;

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        bgcolor: "background.paper",
        p: "24px",
        gap: 2,
      }}
    >
      {data.map((file, index) => (
        <Box key={file.id}>
          <ListItem
            onClick={() => setSelectedIndex(index)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              p: 2,
              gap: 2,
              borderRadius: "5px",
              backgroundColor:
                selectedIndex === index ? "#3B9EDC1A" : "transparent",
              "&:hover": {
                backgroundColor: "#E8F4FD",
              },
            }}
          >
            <Box flex={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#000000",
                }}
              >
                {file.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <StatusChip status={file.status} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <img src={UserIcon} alt="User" width={20} height={20} />
                  <Typography
                    variant="body2"
                    color={theme.palette.primary.main}
                  >
                    {file.created_user_name}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <img src={ClockIcon} alt="Clock" width={20} height={20} />
                  <Typography
                    variant="body2"
                    color={theme.palette.primary.main}
                  >
                    {file.created_date} {file.created_time}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {file.status === "Success" && (
              <Typography
                component="span"
                onClick={() => onDownload(file.id)}
                sx={{
                  color: theme.palette.brand.tertiary,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <img
                  src={DownloadIcon}
                  alt="Download"
                  width={20}
                  height={20}
                  style={{ marginRight: 4, padding: 2 }}
                />
                Download File
              </Typography>
            )}
          </ListItem>

          {index < data.length - 1 && selectedIndex !== index && (
            <Divider component="li" />
          )}
        </Box>
      ))}
    </List>
  );
};
export default DownloadedTab;
