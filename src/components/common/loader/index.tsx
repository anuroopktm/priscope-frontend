import { Backdrop, CircularProgress, Typography } from "@mui/material";

interface LoaderOverlayProps {
  message?: string;
  open?: boolean;
}

export default function LoaderOverlay({
  message,
  open = true,
}: Readonly<LoaderOverlayProps>) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "primary.main",
        zIndex: (theme) => theme.zIndex.modal + 1,
        flexDirection: "column",
      }}
    >
      <CircularProgress color="inherit" size="4rem" thickness={4} />
      {message && (
        <Typography variant="body1" sx={{ mt: 2, color: "text.primary" }}>
          {message}
        </Typography>
      )}
    </Backdrop>
  );
}
