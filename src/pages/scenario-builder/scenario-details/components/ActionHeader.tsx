import ArrowBackIcon from "@/assets/actions/arrow-left.svg?react";
import DatabaseImportIcon from "@/assets/actions/database-import.svg?react";
import FileImportIcon from "@/assets/actions/file-import.svg?react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ActionHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  const handleBack = () => navigate("/scenario-builder");

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

        <Typography variant="subtitle1" sx={{ color: "background.default" }}>
          {title}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="contained"
          // onClick={handleNavigate}
        >
          Save as draft
        </Button>
        <Button
          variant="contained"
          startIcon={<DatabaseImportIcon />}
          // onClick={handleNavigate}
        >
          Export
        </Button>
        <Button
          variant="contained"
          startIcon={<FileImportIcon />}
          // onClick={handleNavigate}
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
