"use client";

import { Box, AppBar, Toolbar } from "@mui/material";
import Image from "next/image";
import Logo from "@/public/images/priscope_white_logo.svg"

export default function UnprotectedTopbar() {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent", boxShadow: "none", p: 2 }}>
      <Toolbar disableGutters>
        <Box sx={{ ml: 2 }}>
          <Image
            src={Logo}
            alt="Priscope Logo"
            width={105}
            height={25}
            priority
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
