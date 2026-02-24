import {
  KeyboardArrowDown,
  NotificationsOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { Avatar, IconButton, MenuItem, Select, Stack } from "@mui/material";
import { useState } from "react";

export const GlobalHeaderActions = () => {
  const [tenant, setTenant] = useState("tenant-name");

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {/* Tenant Selector */}
      <Select
        value={tenant}
        onChange={(e) => setTenant(e.target.value)}
        size="small"
        variant="filled"
        IconComponent={KeyboardArrowDown}
        sx={{
          minWidth: 200,
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
        <SettingsOutlined />
      </IconButton>

      <IconButton
        variant="action"
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "brand.tertiary",
        }}
      >
        <NotificationsOutlined />
      </IconButton>

      <Avatar
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
    </Stack>
  );
};
