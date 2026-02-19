import geometryOverlay from "@/assets/login/geometry.svg";
import { Box } from "@mui/material";

const AuthGraphic = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        bgcolor: "#1A2B44",
        overflow: "hidden",
      }}
    >
      {/* Top Right Decoration */}
      <Box
        component="img"
        src={geometryOverlay}
        alt="Background Geometry"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          transform: "rotate(180deg)",
        }}
      />

      {/* Bottom Left Decoration - Rotated */}
      <Box
        component="img"
        src={geometryOverlay}
        alt="Background Geometry"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      />
    </Box>
  );
};

export default AuthGraphic;
