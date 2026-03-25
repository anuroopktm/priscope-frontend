"use client";
import CalendarIcon from "@/assets/common/calendar.svg";
import ClockIcon from "@/assets/common/clock.svg";
import DownloadIcon from "@/assets/common/download.svg";
import CloseIcon from "@/assets/common/multiplication-sign.svg";
import UserIcon from "@/assets/common/user-circle.svg";
import { mapExports } from "@/constants/file-modal-helpers";
import {
  useGetExportedFile,
  useGetModuleImportErrorFile,
  useListExport,
  useListModuleImports,
  useListModuleImportSummaryCount,
} from "@/services/queries/common/common.queries";
import formatDate from "@/utils/formatDate";
import getListExportPayload from "@/utils/getListExportPayload";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import StatsSummaryBar from "../status-summary-bar";

const TOGGLE_BUTTON = ["uploaded", "downloaded"];
const FILE_UPLOAD_STATUS = {
  UPLOADED: "uploaded",
  PROCESSING: "processing",
  PROCESSED: "processed",
  FAILED: "failed",
  SUCCESS: "success",
};

export interface FileDetailsModalProps {
  open?: boolean;
  onClose: any;
  showToast: (message: string, severity: "success" | "error") => void;
  showLoader: any;
  module: string;
  filterOptions: { value: string; label: string }[];
  defaultTab?: "uploaded" | "downloaded";
}

export interface SimplifiedExport {
  id: string;
  name: string;
  created_user_name: string;
  created_time: string;
  created_date: string;
  status: string;
}

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  open = true,
  onClose,
  showLoader,
  showToast,
  module,
  filterOptions,
  defaultTab = "uploaded",
}) => {
  const [alignment, setAlignment] = useState(
    module === "fx_rate" ? filterOptions[0]?.value : defaultTab || "",
  );
  const theme = useTheme();
  const [selectedDownloadIndex, setSelectedDownloadIndex] = useState(0);
  const [exportedData, setExportedData] = useState<SimplifiedExport[]>([]);
  const [uploadData, setUploadData] = useState([]);

  const listExportPayload = getListExportPayload([module]);

  const {
    mutate: downloadErrorFile = () => {},
    isPending: errorFileDownloadPending = false,
  } = useGetModuleImportErrorFile() ?? {};

  const {
    mutate: listUploads = () => {},
    isPending = false,
    isError = false,
  } = useListModuleImports(module) ?? {};

  const {
    mutate: listExports = () => {},
    isPending: isExpostListPending = false,
    isError: isErrorListExport = false,
  } = useListExport() ?? {};

  const {
    mutate: DownloadExportFile = () => {},
    isPending: isDownloadExportPending = false,
  } = useGetExportedFile() ?? {};

  useEffect(() => {
    if (isDownloadExportPending || errorFileDownloadPending) {
      showLoader(true);
    } else {
      showLoader(false);
    }
  }, [errorFileDownloadPending, isDownloadExportPending]);

  useEffect(() => {
    if (filterOptions.find((opt) => opt.value === TOGGLE_BUTTON[0])?.value) {
      listUploads(undefined as any, {
        onSuccess: (res: any) => {
          let uploads;
          if (res?.uploads) {
            uploads = res.uploads
              .filter(
                (item: any) =>
                  item.status !== FILE_UPLOAD_STATUS.PROCESSING &&
                  item.status !== FILE_UPLOAD_STATUS.UPLOADED,
              )
              .map((item: any) => {
                const createdAt = new Date(item.created_at);
                return {
                  id: item.id,
                  title: item.file_name,
                  status:
                    item.status === FILE_UPLOAD_STATUS.SUCCESS ||
                    item.status === FILE_UPLOAD_STATUS.PROCESSED
                      ? "Success"
                      : item.status,
                  uploadDate: formatDate(item.created_at),
                  uploadTime: createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  uploadedBy: item?.created_by?.name ?? "",
                  updatedDate: formatDate(item.updated_at),
                  errorFile:
                    item.status === FILE_UPLOAD_STATUS.PROCESSED ||
                    item.status === FILE_UPLOAD_STATUS.FAILED,
                  hasUploadData:
                    item.status === FILE_UPLOAD_STATUS.SUCCESS ||
                    item.status === FILE_UPLOAD_STATUS.PROCESSED ||
                    item.status === FILE_UPLOAD_STATUS.FAILED,
                };
              });
          }
          setUploadData(uploads || []);
        },
        onError: (err: any) => {
          console.error("Error fetching uploads:", err);
        },
      });
    }

    if (filterOptions.find((opt) => opt.value === TOGGLE_BUTTON[1])?.value) {
      listExports(listExportPayload, {
        onSuccess: (res) => {
          const data = mapExports(res);
          setExportedData(data);
        },
        onError: (err: any) => {
          console.error("Error fetching exports:", err);
        },
      });
    }
  }, []);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  // const toggleFileExpansion = (fileId: string) => {
  //   setExpandedFiles((prev) => ({
  //     ...prev,
  //     [fileId]: !prev[fileId],
  //   }));
  // };

  const handleCloseFileModal = () => {
    onClose(false);
  };

  if (!open) return null;

  const handleDownloadErrorFile = (uploadId: string) => {
    downloadErrorFile(uploadId);
  };

  const handleDownload = (fileId: string) => {
    DownloadExportFile(fileId, {
      onSuccess: (res) => {
        if (res?.download_url) {
          const link = document.createElement("a");
          link.href = res.download_url;
          link.setAttribute("download", "export_file.csv");
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      },
      onError: () => {
        showToast("Failed to download file", "error");
      },
    });
  };

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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            Files
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
              {filterOptions.map((option) => (
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
                border: "1px solid #1A2B441A",
                borderRadius: "5px",
                padding: "7px",
                height: "32px",
                width: "32px",
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
          /* hide scrollbar for Webkit (Chrome, Safari, Edge) */
          "&::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },
          /* hide scrollbar for Firefox */
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {alignment === TOGGLE_BUTTON[0] && (
          <>
            {isPending && (
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
              <Typography color="error">Failed to load files.</Typography>
            )}

            {uploadData?.map((file: any, index: number) => (
              <Box
                key={file.id}
                sx={{
                  borderBottom: index < uploadData.length - 1 ? 1 : 0,
                  borderColor: "divider",
                  background: "#3B9EDC1A",
                  px: 3,
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
                    {file.title}
                  </Typography>

                  {file.errorFile && (
                    <Typography
                      component="span"
                      onClick={() => handleDownloadErrorFile(file.id)}
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
                      Error File
                    </Typography>
                  )}
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
                    label={file.status === "Success" ? "Success" : "Failed"}
                    size="small"
                    sx={{
                      backgroundColor:
                        file.status === "Success" ? "#1FC16B1A" : "#FB37481A",
                      color: file.status === "Success" ? "#1FC16B" : "#D00416",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <img
                      src={UserIcon}
                      alt="User"
                      width={20}
                      height={20}
                      style={{ padding: 2 }}
                    />
                    <Typography variant="body2" color="#1A2B44">
                      {file.uploadedBy}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <img
                      src={ClockIcon}
                      alt="Clock"
                      width={20}
                      height={20}
                      style={{ padding: 2 }}
                    />
                    <Typography variant="body2" color="#1A2B44">
                      {file.uploadDate} {file.uploadTime}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <img
                      src={CalendarIcon}
                      alt="Calendar"
                      width={20}
                      height={20}
                      style={{ padding: 2 }}
                    />
                    <Typography variant="body2" color="#1A2B44">
                      {file.updatedDate}
                    </Typography>
                  </Box>
                </Box>

                {file.hasUploadData && (
                  <Box sx={{ mt: 2 }}>
                    <FileStatsLoader fileId={file.id} module={module} />
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}
        {alignment === TOGGLE_BUTTON[1] && (
          <Box maxWidth="md">
            {isExpostListPending && (
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
            {isErrorListExport && (
              <Typography color="error">Failed to load files.</Typography>
            )}
            <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
              {exportedData.map((file, index) => (
                <React.Fragment key={file.id}>
                  <ListItem
                    onClick={() => {
                      setSelectedDownloadIndex(index);
                    }}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      p: 2,
                      gap: 2,
                      borderRadius: "5px",
                      backgroundColor:
                        selectedDownloadIndex === index ? "#3B9EDC1A" : "",
                    }}
                  >
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: theme.palette.primary.main,
                          fontSize: "16px",
                        }}
                      >
                        {file.name}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={
                            file.status === "Success" ? "Success" : "Failed"
                          }
                          size="small"
                          sx={{
                            backgroundColor:
                              file.status === "Success"
                                ? "#1FC16B1A"
                                : "#FB37481A",
                            color:
                              file.status === "Success" ? "#1FC16B" : "#D00416",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            height: 24,
                          }}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <img
                            src={UserIcon}
                            alt="User"
                            width={20}
                            height={20}
                            style={{ padding: 2 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              fontWeight: 400,
                              color: theme.palette.primary.main,
                            }}
                          >
                            {file.created_user_name}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <img
                            src={ClockIcon}
                            alt="Clock"
                            width={20}
                            height={20}
                            style={{ padding: 2 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              color: theme.palette.primary.main,
                            }}
                          >
                            {file.created_date} {file.created_time}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                    {file.status === "Success" && (
                      <Typography
                        component="span"
                        onClick={() => handleDownload(file?.id)}
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

                  {index < exportedData.length - 1 &&
                    !(
                      selectedDownloadIndex === index ||
                      selectedDownloadIndex === index + 1
                    ) && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

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

export default FileDetailsModal;
