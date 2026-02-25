import { Divider, Paper, Typography } from "@mui/material";
import { type ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

const AuthCard = ({ title, children }: AuthCardProps) => {
  return (
    <Paper sx={{ width: "100%", maxWidth: 450, p: 5, mx: "auto" }}>
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        color="primary.main"
      >
        {title}
      </Typography>
      <Divider sx={{ mt: 1.5, mb: 3 }} />
      {children}
    </Paper>
  );
};

export default AuthCard;
