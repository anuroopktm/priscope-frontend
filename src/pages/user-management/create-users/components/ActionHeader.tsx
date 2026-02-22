import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

const ActionHeader = () => {
  const theme = useTheme();

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
        <IconButton>
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
