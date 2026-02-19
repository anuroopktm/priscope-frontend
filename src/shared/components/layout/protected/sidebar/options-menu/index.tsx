"use client";

import * as React from "react";
import {
  Menu,
  MenuItem as MuiMenuItem,
  Divider,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "../menu-button";
import useLogout from "@/shared/hooks/useLogout";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export default function OptionsMenu() {
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
    handleClose(); // Close the menu
    logout(); // Trigger logout
  };

  return (
    <>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: { padding: "4px" },
          [`& .${paperClasses.root}`]: { padding: 0 },
          [`& .MuiDivider-root`]: { margin: "4px -4px" },
        }}
      >
        <MenuItem>Profile</MenuItem>

        <Divider />
        <MenuItem>Switch Account</MenuItem>

        <Divider />
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
