"use client";

import type { PropsWithChildren } from "react";
import { Box, CssBaseline, Stack, useTheme } from "@mui/material";
import Topbar from "./topbar";

export default function ProtectedLayoutWrapper({
  children,
}: PropsWithChildren) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: theme.custom.bgColor,
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <Topbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Stack spacing={4}>{children}</Stack>
        </Box>
      </Box>
    </Box>
  );
}
