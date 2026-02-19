"use client";
import { IconButton } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.sidebar.highlight,
  color: theme.palette.sidebar.text,
  '&:hover': {
    backgroundColor: theme.palette.sidebar.hover,
  },
}));

export default function NotificationsButton() {
  return (
    <StyledIconButton>
      <NotificationsIcon sx={{ width: 16, height: 16 }} />
    </StyledIconButton>
  );
}