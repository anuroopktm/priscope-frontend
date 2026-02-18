export default function Paper() {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#FFFFFF", // Default background
        },
        rounded: {
          borderRadius: 24, // Standard card radius
        },
      },
    },
  };
}
