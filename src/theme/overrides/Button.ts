export default function Button() {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          fontWeight: 600,
          borderRadius: 8, // Default radius, can be overridden
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeLarge: {
          height: 48,
          fontSize: "1rem",
          padding: "0 24px",
        },
        contained: {
          backgroundColor: "#144E72", // Primary brand color
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#0F3D5B", // Darker shade
          },
        },
      },
    },
  };
}
