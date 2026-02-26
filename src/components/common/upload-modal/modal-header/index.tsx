import CloseButton from "@/public/images/upload_modal/closeButton.svg";
import DownloadImage from "@/public/images/upload_modal/download.svg";
import { useGetTemplateFile } from "@/services/queries/common/common.queries";
import { theme } from "@/theme/theme";
import { Box, DialogTitle, Typography } from "@mui/material";
import React, { useEffect } from "react";

interface ModalHeaderProps {
  onClose: () => void;
  showTemplate: boolean;
  templateDownloadUrl?: string;
  templateName: string;
  feature: string;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  showTemplate,
  templateName,
  feature,
  setShowLoader,
}) => {
  const { mutate: getTemplateFile, isPending: isDownloadPending } =
    useGetTemplateFile();

  useEffect(() => {
    if (isDownloadPending) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [isDownloadPending]);

  const handleTemplateDownload = () => {
    getTemplateFile(feature);
  };

  return (
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 1,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ color: theme.palette.text.primary }}
      >
        Upload File
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {showTemplate && (
          <Typography
            component="span"
            onClick={handleTemplateDownload}
            sx={{
              color: theme.palette.divider,
              fontSize: 14,
              textDecoration: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={DownloadImage}
              alt="Download Template"
              width={20}
              height={20}
              style={{ marginRight: 4, padding: 2 }}
            />
            Download {templateName}
          </Typography>
        )}
        <img
          src={CloseButton}
          alt="close button"
          width={32}
          height={32}
          onClick={onClose}
          style={{ cursor: "pointer" }}
        />
      </Box>
    </DialogTitle>
  );
};

export default ModalHeader;
