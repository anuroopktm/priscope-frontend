import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button } from "@mui/material";

const FooterActions = ({ handleEdit }: { handleEdit: () => void }) => (
  <Box sx={{ mt: 3 }}>
    <Button
      variant="contained"
      type="submit"
      size="medium"
      startIcon={<MailOutlineIcon />}
      onClick={handleEdit}
    >
      Edit User
    </Button>
  </Box>
);

export default FooterActions;
