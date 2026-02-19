"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import MenuContent from "./menu-content";
import LogoSection from "./logo-section";
import OptionsMenu from "./options-menu";
import { useSession } from "next-auth/react";

const DRAWER_WIDTH = 219;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  [`& .${drawerClasses.paper}`]: {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
    backgroundColor: theme.palette.sidebar.bg,
    color: theme.palette.sidebar.text,
    borderRight: "none",
  },
}));

export default function Sidebar() {
  const { data: session } = useSession();

  const user = (session?.user ?? {}) as { name?: string };

  return (
    <Drawer variant="permanent">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          p: 1.5,
        }}
      >
        <LogoSection />
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2 }}>
          <MenuContent />
        </Box>
        <Divider />
        <Stack
          direction="row"
          sx={{
            p: 2,
            gap: 1,
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "sidebar.avatarBg",
              color: "sidebar.avatarText",
              width: 30,
              height: 30,
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "12px",
            }}
          >
            JS
          </Avatar>
          <Box sx={{ mr: "auto" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name ?? ""}
            </Typography>
          </Box>
          <OptionsMenu />
        </Stack>
      </Box>
    </Drawer>
  );
}
