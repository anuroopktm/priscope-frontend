import EditIcon from "@/assets/actions/edit.svg?react";
import { Box, Button } from "@mui/material";

const FooterActions = ({ handleEdit }: { handleEdit: () => void }) => (
  <Box sx={{ mt: 3 }}>
    <Button
      variant="contained"
      type="submit"
      size="medium"
      startIcon={<EditIcon />}
      onClick={handleEdit}
    >
      Edit User
    </Button>
  </Box>
);

export default FooterActions;
