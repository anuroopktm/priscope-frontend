"use client";

import { PropsWithChildren } from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import UnprotectedTopbar from "./topbar";
import Background from "@/public/images/login_background.svg";
import theme from "@/shared/styles/theme";

export default function UnprotectedLayoutWrapper({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%", 
        background: `url(${Background.src}) no-repeat center center, ${theme.palette.sidebar.bg}`,
        backgroundSize: "cover",
        overflowX: "hidden", 
      }}
    >
      <CssBaseline />
      <UnprotectedTopbar />

      <Container
        component="main"
        maxWidth="sm"
        disableGutters
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: "calc(100vh - 64px)", sm: "calc(100vh - 100px)" },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}