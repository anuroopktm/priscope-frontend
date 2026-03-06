import ArrowBackIcon from "@/assets/actions/arrow-left.svg?react";
import DatabaseImportIcon from "@/assets/actions/database-import.svg?react";
import FileImportIcon from "@/assets/actions/file-import.svg?react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ActionHeaderProps {
  title?: string;
  onAddItems?: () => void;
  onSaveAsDraft?: () => void;
  onExport?: (format: string) => void;
  isSaving?: boolean;
}

const ActionHeader = ({
  title,
  onAddItems,
  onSaveAsDraft,
  onExport,
  isSaving,
}: ActionHeaderProps) => {
  const navigate = useNavigate();
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const handleBack = () => navigate("/scenario-builder");

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExportOption = (format: string) => {
    onExport?.(format);
    handleExportClose();
  };

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            border: "1px solid #3B9EDC1A",
            borderRadius: 1,
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {title && (
          <Typography variant="subtitle1" sx={{ color: "background.default" }}>
            {title}
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button variant="contained" onClick={onSaveAsDraft} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save as draft"}
        </Button>
        <Button
          variant="contained"
          startIcon={<DatabaseImportIcon />}
          onClick={handleExportClick}
        >
          Export
        </Button>
        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleExportClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => handleExportOption("csv")}>CSV</MenuItem>
          <MenuItem onClick={() => handleExportOption("excel")}>Excel</MenuItem>
        </Menu>
        <Button
          variant="contained"
          startIcon={<FileImportIcon />}
          onClick={onAddItems}
        >
          Add Items
        </Button>
        <Button
          variant="contained"
          // onClick={handleNavigate}
        >
          Publish
        </Button>
      </Stack>
    </Box>
  );
};

export default ActionHeader;
