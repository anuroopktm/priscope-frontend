import { Box, CircularProgress } from "@mui/material";

const CenteredLoader = () => (
  <Box display="flex" justifyContent="center" py={4}>
    <CircularProgress />
  </Box>
);
export default CenteredLoader;
