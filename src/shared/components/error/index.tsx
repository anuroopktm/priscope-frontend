"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouter } from "@bprogress/next/app";
import useTranslation from "@/shared/hooks/useTranslation";
import Image from "next/image";
import Logo from "@/public/images/priscope.png";

const Error = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        gap={4}
      >
        <Box display="flex" justifyContent="center">
          <Image
            src={Logo}
            alt="Priscope Logo"
            width={0}
            height={0}
            priority
          />
        </Box>

        <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />

        <Typography variant="h4" fontWeight={600}>
          {t("error", "title")}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {t("error", "description")}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
          sx={{ mt: 2, px: 4 }}
        >
          {t("error", "backToHome")}
        </Button>
      </Box>
    </Container>
  );
};

export default Error;
