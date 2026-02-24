import {
  KeyboardArrowDown,
  NotificationsOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { Avatar, IconButton, MenuItem, Select, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

export const GlobalHeaderActions = () => {
  const theme = useTheme();
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
          border: `1px solid ${theme.palette.brand.tertiary}`,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.brand.tertiary,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.brand.tertiary,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.brand.tertiary,
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
          border: `1px solid ${theme.palette.brand.tertiary}`,
        }}
      >
        <SettingsOutlined />
      </IconButton>

      <IconButton
        variant="action"
        sx={{
          border: `1px solid ${theme.palette.brand.tertiary}`,
        }}
      >
        <NotificationsOutlined />
      </IconButton>

      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "#89C5EA",
          color: "#1A2B44",
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
