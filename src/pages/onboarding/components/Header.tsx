import { Avatar, Box } from "@mui/material";
import Logo from "@/assets/onboarding/Priscope.svg";
const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        py: "10px",
        px: "24px",
      }}
    >
      <img src={Logo} alt="" />
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "#89C5EA",
          color: "brand.primary",
          fontSize: "0.875rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        JS
      </Avatar>
    </Box>
  );
};

export default Header;
