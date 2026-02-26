import AddIcon from "@/assets/actions/add.svg?react";
import SearchTextField from "@/components/common/SearchTextField";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import UploadFileModal from "./upload-file/UploadFileModal";

interface ActionHeaderProps {
  onSearch: (value: string) => void;
  onImportComplete?: () => void;
}

const ActionHeader = ({ onSearch, onImportComplete }: ActionHeaderProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pt: 2,
        px: 2,
      }}
    >
      <SearchTextField onSearch={onSearch} />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsUploadModalOpen(true)}
      >
        Import Data
      </Button>

      <UploadFileModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportComplete={onImportComplete}
      />
    </Box>
  );
};

export default ActionHeader;
