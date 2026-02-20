import brandLogo from "@/assets/login/brand.svg";
import { Box } from "@mui/material";

export const GlobalHeaderLogo = () => {
  return <Box component="img" src={brandLogo} alt="Priscope" sx={{ mr: 5 }} />;
};
