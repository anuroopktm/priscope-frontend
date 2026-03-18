import { Box, Typography, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Company Info", path: "/global-settings" },
  { label: "System Fields", path: "/global-settings/system-fields" },
  { label: "Attributes", path: "/global-settings/attributes" },
  { label: "Operations Setting", path: "/global-settings/operations-setting" },
  { label: "Alerts", path: "/global-settings/alerts" },
  { label: "Users", path: "/global-settings/users" },
];

export const SettingsSidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#0f2a44",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 3,
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Settings
      </Typography>

      {/* Divider under Settings */}
      <Divider
        sx={{
          bgcolor: "rgba(255,255,255,0.2)",
          mb: 2,
        }}
      />

      {/* Menu */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: "none",
            })}
          >
            {({ isActive }) => (
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s ease",

                  // Active state
                  backgroundColor: isActive ? "#144E72" : "transparent",

                  // Hover effect
                  "&:hover": {
                    backgroundColor: "#144E72",
                    cursor: "pointer",
                  },
                }}
              >
                {item.label}
              </Box>
            )}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
};
