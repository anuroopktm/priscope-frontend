"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import Logo from "@/public/images/priscope_white_logo.svg";

export default function LogoSection() {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "16px 8px",
        alignItems: "center",
        gap: "10px",
        alignSelf: "stretch",
        borderBottom: (theme) => `1px solid ${theme.palette.sidebar.divider}`,
      }}
    >
      <Image
        src={Logo}
        alt="Priscope Logo"
        width={0}
        height={0}
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </Box>
  );
}
