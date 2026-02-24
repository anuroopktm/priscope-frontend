import ArrowBackIcon from "@/assets/actions/arrow-left.svg?react";
import { Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ActionHeader = ({ title }: { title: string }) => {
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
    </Box>
  );
};

export default ActionHeader;
