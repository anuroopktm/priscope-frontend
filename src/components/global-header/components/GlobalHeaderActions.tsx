import NotificationIcon from "@/assets/global-header/notification.svg?react";
import SettingsIcon from "@/assets/global-header/settings.svg?react";
import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useState } from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useLogout } from "@/services/queries/auth/log-out/log-out.queries";
import { useNavigate } from "react-router-dom";

const GlobalHeaderActions = () => {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState("tenant-name");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { mutate } = useLogout();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    mutate(undefined, {
      onSuccess: () => {
        navigate("/auth/sign-in");
      },
    });
  };
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Select
        value={tenant}
        onChange={(e) => setTenant(e.target.value)}
        size="small"
        variant="filled"
        disableUnderline
        sx={{
          // minWidth: 200,
          textAlign: "center",
          borderRadius: 20,
          border: 1,
          borderStyle: "solid",
          borderColor: "brand.tertiary",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "brand.tertiary",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "brand.tertiary",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "brand.tertiary",
            borderWidth: 1,
          },
        }}
      >
        <MenuItem value="tenant-name">Tenant Name</MenuItem>
        <MenuItem value="tenant-1">Tenant 1</MenuItem>
      </Select>

      <IconButton
        variant="action"
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "brand.tertiary",
        }}
      >
        <SettingsIcon />
      </IconButton>

      <IconButton
        variant="action"
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "brand.tertiary",
        }}
      >
        <NotificationIcon />
      </IconButton>

      <Avatar
        onClick={handleAvatarClick}
        sx={{
          width: 36,
          height: 36,
          bgcolor: "#89C5EA",
          color: "brand.primary",
          fontSize: "0.875rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        JS
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
            },
          },
        }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            width: "100%",
          }}
        >
          <ListItemText primary="Logout" />
          <ListItemIcon sx={{ minWidth: 0 }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default GlobalHeaderActions;
