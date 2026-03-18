// layouts/SettingsLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "./components/Sidebar";
// import { SettingsSidebar } from "../components/SettingsSidebar";

export const GlobalSettingsLayout = () => {
  return (
    <Box display="flex">
      {/* Sidebar */}
      <SettingsSidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          bgcolor: "#f5f6f8",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};