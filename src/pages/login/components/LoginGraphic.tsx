import { Box, type BoxProps } from "@mui/material";
import geometryOverlay from "../../../assets/login/geometry.svg";

export const LoginGraphic = (props: BoxProps) => {
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
        ...props.sx,
      }}
      {...props}
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
