import DeleteIcon from "@/assets/actions/delete.svg?react";
import RecycleIcon from "@/assets/actions/recycle.svg?react";
import { alpha, Box, Button } from "@mui/material";

interface FooterActionsProps {
  loading: boolean;
}

const FooterActions = ({ loading }: FooterActionsProps) => {
  return (
    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
      <Button
        size="medium"
        variant="outlined"
        sx={{
          borderWidth: 2,
          backgroundColor: "background.paper",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "background.default",
            color: "primary.main",
          },
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        type="submit"
        size="medium"
        startIcon={<RecycleIcon />}
        loading={loading}
      >
        Update
      </Button>
      <Button
        variant="contained"
        size="medium"
        startIcon={<DeleteIcon />}
        loading={loading}
        sx={(theme) => ({
          backgroundColor: "error.main",
          "&:hover": {
            backgroundColor: alpha(theme.palette.error.main, 0.8),
          },
        })}
      >
        Delete User
      </Button>
    </Box>
  );
};

export default FooterActions;
