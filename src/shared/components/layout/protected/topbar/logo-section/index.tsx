"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import Logo from "@/public/images/priscope_white_logo.svg";

export default function LogoSection() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Image
        src={Logo}
        alt="Priscope Logo"
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </Box>
  );
}