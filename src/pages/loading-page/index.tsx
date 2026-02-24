import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.paper",
        gap: 2,
      }}
    >
      <CircularProgress size={30} thickness={4} />
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
