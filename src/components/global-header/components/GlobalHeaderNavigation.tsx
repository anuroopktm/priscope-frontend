import { Box, Button, MenuItem, Select, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { HEADER_NAV } from "../constants/header.nav";

const GlobalHeaderNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {HEADER_NAV.map((item) => {
        const Icon = item.icon;

        if (item.type === "button") {
          return (
            <Button
              key={item.label}
              variant="contained"
              startIcon={<Icon />}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          );
        }

        // 🔑 find active child
        const activeItem = item.items.find(
          (sub) => sub.path === location.pathname,
        );

        return (
          <Select
            key={item.label}
            value={activeItem?.path ?? ""}
            variant="filled"
            disableUnderline
            displayEmpty
            // onChange={(e) => navigate(e.target.value)}
            renderValue={() => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Icon />
                {item.label}
              </Box>
            )}
          >
            {item.items.map((sub) => (
              <MenuItem key={sub.path} value={sub.path}>
                {sub.label}
              </MenuItem>
            ))}
          </Select>
        );
      })}
    </Stack>
  );
};

export default GlobalHeaderNavigation;
