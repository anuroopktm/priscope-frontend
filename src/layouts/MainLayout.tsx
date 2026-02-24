import GlobalHeader from "@/components/global-header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "brand.background",
        pt: "56px",
      }}
    >
      <GlobalHeader />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
