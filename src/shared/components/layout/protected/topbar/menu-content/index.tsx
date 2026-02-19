"use client";
import * as React from "react";
import { Box, ListItemText, Menu, MenuItem } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AttachMoney as ItemsMasterIcon,
  SettingsOutlined as SettingsIcon,
  ManageAccountsOutlined as UsermanagementIcon
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import useTranslation from "@/shared/hooks/useTranslation";
import MenuButton from "../menu-button";
import { PRIVILEGE_ACTIONS, PRIVILEGE_MODULES } from "@/shared/constants/privileges.constants";
import { useSession } from "next-auth/react";
import { hasPrivilege } from "@/shared/utils/hasPrivilege";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import BookIcon from "@/public/images/book.svg"
import Image from "next/image";

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
    icon: <ItemsMasterIcon />,
    path: "/item-master",
  },
  {
    key: "rate-libraries",
    label: "Rate libraries",
    icon: <Image src={BookIcon} alt="Calendar" width={20} height={20} style={{ padding: 2 }} />,
    children: [
      {
        key: "freight-rate",
        label: "Freight rate library",
        path: "/freight-rate-library",
        requiredPrivilege: {
          module: PRIVILEGE_MODULES.FREIGHT_RATE,
          action: PRIVILEGE_ACTIONS.VIEW,
        },
      },
      {
        key: "tariff-rate",
        label: "Tariff rate library",
        path: "/tariff-rate-library",
        requiredPrivilege: {
          module: PRIVILEGE_MODULES.TARIFF_RATE,
          action: PRIVILEGE_ACTIONS.VIEW,
        },
      },
      {
        key: "FX",
        label: "FX rate library",
        path: "/fx-rate-library",
        requiredPrivilege: {
          module: PRIVILEGE_MODULES.FX_RATE,
          action: PRIVILEGE_ACTIONS.VIEW,
        },
      },
    ],
  },
  {
    key: "user-management",
    label: "User management",
    icon: <UsermanagementIcon />,
    path: "/manage-user",
    requiredPrivilege: {
      module: PRIVILEGE_MODULES.USER_MANAGEMENT,
      action: PRIVILEGE_ACTIONS.VIEW,
    },
  },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
];

export default function MenuContent() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang } = useTranslation();
  const { data } = useSession();
  const privileges = data?.user?.privileges || {}
  const [selectedRateLibrary, setSelectedRateLibrary] = React.useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  const handleNavigation = (target: string) => {
    const fullPath = `/${lang}${target}`;
    if (pathname !== fullPath) {
      router.push(fullPath);
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>, key: string) => {
    setAnchorEl(event.currentTarget);
    setOpenKey(key);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenKey(null);
  };

  const renderMenuItems = (items: typeof menuItems) =>
    items
      .filter(({ requiredPrivilege, children }) => {
        if (children) {
          const hasAllowedChild = children.some(
            (child) =>
              !child.requiredPrivilege ||
              hasPrivilege(privileges, child.requiredPrivilege.module, child.requiredPrivilege.action)
          );
          return hasAllowedChild;
        }

        if (!requiredPrivilege) return true;
        return hasPrivilege(privileges, requiredPrivilege.module, requiredPrivilege.action);
      })
      .map((item) => {
        if (item.children) {
          const visibleChildren = item.children.filter(
            (child) =>
              !child.requiredPrivilege ||
              hasPrivilege(privileges, child.requiredPrivilege.module, child.requiredPrivilege.action)
          );

          const active = visibleChildren.some((child) =>
            pathname.startsWith(`/${lang}${child.path}`)
          );
          const parentLabel = selectedRateLibrary || item.label;

          return (
            <React.Fragment key={item.key}>
              <MenuButton
                endIcon={<ExpandMoreOutlinedIcon />}
                startIcon={React.cloneElement(item.icon, {
                  sx: {
                    width: "16px",
                    height: "16px",
                    fill: active
                      ? theme.palette.sidebar.active
                      : theme.palette.sidebar.text,
                  },
                })}
                onClick={(e) => handleOpen(e, item.key)}
                isActive={active}
              >
                {t("sidebar", parentLabel)}
              </MenuButton>

              <Menu
                anchorEl={anchorEl}
                open={openKey === item.key}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              >
                {visibleChildren.map((child) => {
                  const fullPath = `/${lang}${child.path}`;
                  return (
                    <MenuItem
                      key={child.key}
                      onClick={() => {
                        handleNavigation(child.path);
                        setSelectedRateLibrary(child.label);
                        handleClose();
                      }}
                      selected={pathname.startsWith(fullPath)}
                    >
                      <ListItemText>{t("sidebar", child.label)}</ListItemText>
                    </MenuItem>
                  );
                })}
              </Menu>
            </React.Fragment>
          );
        }

        const fullPath = `/${lang}${item.path}`;
        const active = pathname.startsWith(fullPath);

        return (
          <MenuButton
            key={item.key}
            startIcon={React.cloneElement(item.icon, {
              sx: {
                width: "16px",
                height: "16px",
                fill: active
                  ? theme.palette.sidebar.active
                  : theme.palette.sidebar.text,
              },
            })}
            onClick={() => handleNavigation(item.path!)}
            isActive={active}
          >
            {t("sidebar", item.label)}
          </MenuButton>
        );
      });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
      {renderMenuItems(menuItems)}
    </Box>
  );
}