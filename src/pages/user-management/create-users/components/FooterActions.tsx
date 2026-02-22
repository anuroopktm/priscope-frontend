import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button } from "@mui/material";

const FooterActions = () => (
  <Box sx={{ mt: 3 }}>
    <Button
      type="submit"
      variant="contained"
      size="medium"
      startIcon={<MailOutlineIcon />}
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
