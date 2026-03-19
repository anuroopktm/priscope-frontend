import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "./components/Sidebar";

export const GlobalSettingsLayout = () => {
  return (
    <Box
      display="flex"
      sx={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <SettingsSidebar />
      <Box
        sx={{
          flex: 1,
          p: 3,
          bgcolor: "#f5f6f8",
          overflowY: "auto",
          height: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
