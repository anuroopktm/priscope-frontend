import React from "react";
import { IconButton, Typography, Box, Stack } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface DetailsModalHeaderProps {
  onClose: () => void;
  origin: string;
  destination: string;
  hsCode: string;
}

export const DetailsModalHeader: React.FC<DetailsModalHeaderProps> = ({
  onClose,
  origin,
  destination,
  hsCode,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderColor="divider"
    >
      {/* Left side heading */}
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "20px",
          color: "#1A2B44",
        }}
      >
        Details
      </Typography>

      {/* Right side info */}
      <Stack direction="row" spacing={3} alignItems="center">
        {/* Port of Origin */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            Country of Origin:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#1A2B44">
            {origin}
          </Typography>
        </Box>

        {/* Port of Destination with left border */}
        <Box
          sx={{
            pl: 2,
            borderLeft: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Country of Destination:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#1A2B44">
            {destination}
          </Typography>
        </Box>

        {/* Container Type with left border */}
        <Box
          sx={{
            pl: 2,
            borderLeft: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            HS Code:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#1A2B44">
            {hsCode}
          </Typography>
        </Box>

        {/* Close button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ border: "1px solid #ccc", borderRadius: "8px" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};
