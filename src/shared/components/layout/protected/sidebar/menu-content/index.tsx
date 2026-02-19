"use client";

import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AttachMoney as ItemMasterIcon,
  Settings as ManagementIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useRouter } from "@bprogress/next/app";

import useTranslation from "@/shared/hooks/useTranslation";

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    key: "item-master",
    label: "Item master",
    icon: <ItemMasterIcon />,
    path: "/item-master",
  },
  {
    key: "user-management",
    label: "Manage user",
    icon: <ManagementIcon />,
    path: "/manage-user",
  },
];

export default function MenuContent() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang } = useTranslation();

  const handleNavigation = (target: string) => {
    const fullPath = `/${lang}${target}`;
    if (pathname !== fullPath) {
      router.push(fullPath);
    }
  };

  const renderList = (items: typeof menuItems) =>
    items.map(({ key, icon, path, label }) => {
      const fullPath = `/${lang}${path}`;
      const active = pathname.startsWith(fullPath);

      return (
        <ListItem key={key} disablePadding sx={{ display: "block", mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleNavigation(path)}
            sx={{
              borderRadius: "12px",
              py: 1,
              px: 1.25,
              backgroundColor: active
                ? theme.palette.sidebar.active
                : "transparent",
              "&:hover": {
                backgroundColor: active
                  ? theme.palette.sidebar.active
                  : theme.palette.sidebar.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.sidebar.text,
                minWidth: 26,
              }}
            >
              {React.cloneElement(icon, {
                sx: {
                  width: "16px",
                  height: "16px",
                  aspectRatio: "1/1",
                  fill: active
                    ? theme.palette.sidebar.avatarText
                    : theme.palette.sidebar.text,
                },
              })}
            </ListItemIcon>
            <ListItemText
              primary={t("sidebar", label)}
              slotProps={{
                primary: {
                  sx: {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.body2.fontSize,
                    fontWeight: 400,
                    color: active
                      ? theme.palette.sidebar.avatarText
                      : theme.palette.sidebar.text,
                  },
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List disablePadding>{renderList(menuItems)}</List>
    </Stack>
  );
}
