import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";

interface DrawerHeaderProps {
  onClose: () => void;
  title: string;
}

const DrawerHeader = ({ title, onClose }: DrawerHeaderProps) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: "brand.primary",
        }}
      >
        {title}
      </Typography>
      <IconButton
        onClick={onClose}
        sx={{
          color: "text.secondary",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default DrawerHeader;
