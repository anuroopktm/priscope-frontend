import brandLogo from "@/assets/login/brand.svg";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const GlobalHeaderLogo = () => {
  return (
    <Link to="/scenario-builder">
      <Box
        component="img"
        src={brandLogo}
        alt="Priscope"
        sx={{ mr: 5, width: "auto", height: 30, mt: 1 }}
      />
    </Link>
  );
};

export default GlobalHeaderLogo;
