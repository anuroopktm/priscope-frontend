import { theme } from "@/theme/theme";

export const cardBoxStyles = {
  background: theme.palette.brand.gradientBg,
  borderRadius: 12,
  width: "100%",
  maxWidth: { xs: "100%", sm: "220px", lg: "220px" },
  minWidth: { xs: "220px", sm: "220px" },
  height: { xs: 180, sm: 200 },
  p: { xs: 2.5, sm: 3 },
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": { transform: "translateY(-2px)" },
} as const;

export const buttonStyles = {
  bgcolor: theme.palette.brand.tertiary,
  "&:hover": { bgcolor: theme.palette.primary.dark },
  color: "#fff",
  textTransform: "none",
  fontSize: { xs: "13px", sm: "14px" },
  fontWeight: 600,
  px: { xs: 2, sm: 2.5 },
  py: { xs: 0.75, sm: 1 },
  borderRadius: 8,
  minHeight: { xs: "36px", sm: "40px" },
} as const;

export const titleStyles = {
  color: theme.palette.brand.primary,
  fontWeight: 500,
  fontSize: { xs: "15px", sm: "16px" },
  lineHeight: 1.4,
  mb: { xs: 2, sm: 2.5 },
} as const;

export const imageBoxStyles = {
  position: "absolute",
  top: 0,
  right: 0,
  opacity: 25,
  zIndex: 1,
} as const;
