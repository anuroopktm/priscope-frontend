import brandLogo from "@/assets/login/brand.svg";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export const GlobalHeaderLogo = () => {
  return (
    <Link to="/scenario-builder">
      <Box component="img" src={brandLogo} alt="Priscope" sx={{ mr: 5 }} />
    </Link>
  );
};
