"use client";
import * as React from "react";
import {
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSession } from "next-auth/react";
import useLogout from "@/shared/hooks/useLogout";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.sidebar.avatarBg,
  color: theme.palette.sidebar.avatarText,
  width: 32,
  height: 32,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 16,
  cursor: "pointer",
}));

// MenuItem without gray hover/focus background, ripple kept
const MenuItem = styled(MuiMenuItem)(() => ({
  margin: "2px 0",
  "&:hover, &:focus, &.Mui-focusVisible, &:active": {
    backgroundColor: "transparent",
  },
}));

export default function UserAvatar() {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout } = useLogout();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <>
      <StyledAvatar onClick={handleClick}>
        <AccountCircleIcon fontSize="small" />
      </StyledAvatar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: { padding: "4px" },
          [`& .${paperClasses.root}`]: {
            padding: 0,
            width: 200,
            borderRadius: "8px",
          },
          [`& .MuiDivider-root`]: { margin: "4px -4px" },
        }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </>
  );
}
