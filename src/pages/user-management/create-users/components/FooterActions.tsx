import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button } from "@mui/material";

interface FooterActionsProps {
  loading: boolean;
}

const FooterActions = ({ loading }: FooterActionsProps) => (
  <Box sx={{ mt: 3 }}>
    <Button
      type="submit"
      variant="contained"
      size="medium"
      startIcon={<MailOutlineIcon />}
      disabled={loading}
      loading={loading}
      sx={{
        bgcolor: "#17222B",
        textTransform: "none",
        px: 3,
        py: 1,
        "&:hover": { bgcolor: "#000" },
      }}
    >
      Send Invitation
    </Button>
  </Box>
);

export default FooterActions;
