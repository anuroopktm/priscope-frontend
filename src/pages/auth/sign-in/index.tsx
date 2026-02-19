import brandLogo from "@/assets/login/brand.svg";
import { OtpModal } from "@/components/common/OtpModal";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AuthGraphic from "../common/AuthGraphic";
import SignInForm from "./components/SignInForm";

const SignInPage = () => {
  const [openOtp, setOpenOtp] = useState<boolean>(false);

  const handleLoginSuccess = () => setOpenOtp(true);

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
      {/* Background Graphic - Fixed Full Screen */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <AuthGraphic />
      </Box>

      {/* Brand Logo - Top Left */}
      <Box
        sx={{ position: "fixed", top: 30, left: 30, zIndex: 2 }}
        component="img"
        src={brandLogo}
        alt="Priscope"
      />

      {/* Centered Login Card */}
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
        <SignInForm onSuccess={handleLoginSuccess} />
      </Container>

      {/* OTP Modal */}
      <OtpModal
        open={openOtp}
        onClose={() => setOpenOtp(false)}
        title="Verification"
      >
        <Stack spacing={3}>
          <Typography variant="body1" color="text.secondary">
            Enter the code sent to your email.
          </Typography>
          <TextField
            fullWidth
            placeholder="• • • • • •"
            sx={{ textAlign: "center" }}
          />
          <Button fullWidth variant="contained" size="large">
            Verify
          </Button>
        </Stack>
      </OtpModal>
    </Box>
  );
};

export default SignInPage;
