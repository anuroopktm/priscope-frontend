import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { alpha, Box, Button, useTheme } from "@mui/material";

interface FooterActionsProps {
  loading: boolean;
}

const FooterActions = ({ loading }: FooterActionsProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
      <Button
        size="medium"
        variant="outlined"
        sx={{
          borderWidth: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.main,
          },
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        type="submit"
        size="medium"
        startIcon={<MailOutlineIcon />}
        loading={loading}
      >
        Update
      </Button>
      <Button
        variant="contained"
        size="medium"
        startIcon={<MailOutlineIcon />}
        loading={loading}
        sx={{
          backgroundColor: theme.palette.error.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.error.main, 0.8),
          },
        }}
      >
        Delete User
      </Button>
    </Box>
  );
};

export default FooterActions;
