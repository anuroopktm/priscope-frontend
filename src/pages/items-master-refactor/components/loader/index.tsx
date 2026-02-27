// components/common/LoaderOverlay.tsx
import { Box, CircularProgress } from "@mui/material";
import { useLoaderStore } from "../../store/useLoaderStore";

const LoaderOverlay = () => {
  const isLoading = useLoaderStore((state) => state.loading);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default LoaderOverlay;
