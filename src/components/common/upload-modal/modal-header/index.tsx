import React, { useEffect } from "react";
import { DialogTitle, Typography, Box, IconButton } from "@mui/material";
import Image from "next/image";
import DownloadImage from "@/public/images/upload_modal/download.svg";
import CloseButton from "@/public/images/upload_modal/closeButton.svg";
import theme from "@/shared/styles/theme";
import { useGetTemplateFile } from "@/shared/services/commonService";

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
        sx={{ color: theme.custom.textColor }}
      >
        Upload File
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {showTemplate && (
          <Typography
            component="span"
            onClick={handleTemplateDownload}
            sx={{
              color: theme.palette.sidebar.highlight,
              fontSize: 14,
              textDecoration: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src={DownloadImage}
              alt="Download Template"
              width={20}
              height={20}
              style={{ marginRight: 4, padding: 2 }}
            />
            Download {templateName}
          </Typography>
        )}
        <Image
          src={CloseButton}
          alt="close button"
          width={32}
          height={32}
          onClick={onClose}
        />
      </Box>
    </DialogTitle>
  );
};

export default ModalHeader;
