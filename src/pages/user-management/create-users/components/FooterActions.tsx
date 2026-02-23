import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button } from "@mui/material";

interface FooterActionsProps {
  loading: boolean;
}

const FooterActions = ({ loading }: FooterActionsProps) => (
  <Box sx={{ mt: 3 }}>
    <Button
      type="submit"
      variant="outlined"
      size="medium"
      startIcon={<MailOutlineIcon />}
      disabled={loading}
      loading={loading}
    >
      Send Invitation
    </Button>
  </Box>
);

export default FooterActions;
