import brandLogo from "@/assets/login/brand.svg";
import { Box, Container } from "@mui/material";
import AuthGraphic from "../common/AuthGraphic";
import SignUpForm from "./components/SignUpForm";
const SignUpPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        bgcolor: "#1A2B44",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <AuthGraphic />
      </Box>

      <Box
        sx={{ position: "fixed", top: 30, left: 30 }}
        component="img"
        src={brandLogo}
        alt="Priscope"
      />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          my: 2.5,
        }}
      >
        <SignUpForm />
      </Container>
    </Box>
  );
};

export default SignUpPage;
