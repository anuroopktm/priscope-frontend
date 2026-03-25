import React from "react";
import { IconButton, Typography, Box, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DetailsModalHeaderProps {
  onClose: () => void;
  origin: string;
  destination: string;
  containerType: string;
}

export const DetailsModalHeader: React.FC<DetailsModalHeaderProps> = ({
  onClose,
  origin,
  destination,
  containerType,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderColor="divider"
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "20px",
          color: "#1A2B44",
        }}
      >
        Details
      </Typography>

      <Stack direction="row" spacing={3} alignItems="center">
        <Box>
          <Typography variant="caption" color="text.secondary">
            Port of Origin:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#1A2B44">
            {origin}
          </Typography>
        </Box>

        <Box
          sx={{
            pl: 2,
            borderLeft: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Port of Destination:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#1A2B44">
            {destination}
          </Typography>
        </Box>

        <Box
          sx={{
            pl: 2,
            borderLeft: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Container Type:
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#1A2B44">
            {containerType}
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
