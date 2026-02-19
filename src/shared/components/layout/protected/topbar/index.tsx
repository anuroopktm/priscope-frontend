"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Box } from "@mui/material";
import LogoSection from "./logo-section";
import MenuContent from "./menu-content";
import TenantSelector from "./tenant-selector";
import NotificationsButton from "./notification-button";
import UserAvatar from "./user-avatar";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.topbar.bg,
  color: theme.palette.sidebar.text,
  boxShadow: "none",
}));

export default function Topbar() {
  return (
    <StyledAppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 1, sm: 1.5 }, // 8px on xs, 12px on sm and up
        }}
      >
        <LogoSection />
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          <MenuContent />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <TenantSelector />
          <NotificationsButton />
          <UserAvatar />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
