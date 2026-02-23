import EmailInviteIcon from "@/assets/modal/email-invite.svg";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";

interface CreateInvitationModalProps {
  open: boolean;
  jobDesignation: string;
  loading: boolean;
  onSkip: () => void;
  onCreate: () => void;
}

const CreateInvitationModal = ({
  open,
  jobDesignation,
  loading,
  onSkip,
  onCreate,
}: CreateInvitationModalProps) => {
  const theme = useTheme();

  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick") {
      return;
    }
    onSkip();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={EmailInviteIcon}
            sx={{ width: 100, height: 100 }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: alpha(theme.palette.primary.main, 0.9),
          }}
        >
          Invitation email send successfully
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ color: alpha(theme.palette.primary.main, 0.9) }}
        >
          Would you like to save these permissions as a{" "}
          <strong>{jobDesignation}</strong> Template?
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
            mt: 3,
          }}
        >
          <Button
            size="large"
            variant="outlined"
            onClick={onSkip}
            disabled={loading}
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
            Skip
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={onCreate}
            loading={loading}
            disabled={loading}
          >
            Create Invitation
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvitationModal;
