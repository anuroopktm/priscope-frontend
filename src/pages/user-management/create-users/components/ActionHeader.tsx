import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ActionHeader = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBack = () => navigate("/user-management/list-users");

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={handleBack}>
          <ArrowBack sx={{ color: theme.palette.background.default }} />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ color: theme.palette.background.default }}
        >
          Add new user
        </Typography>
      </Box>
    </Box>
  );
};

export default ActionHeader;
