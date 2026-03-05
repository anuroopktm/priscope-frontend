import { Box, Button, Modal, Typography } from "@mui/material";

export interface AdminRequestConfirmationModalAction {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "error" | "secondary";
}

interface AdminRequestConfirmationModalProps {
  open: boolean;
  title: string;
  description?: string;
  actions?: AdminRequestConfirmationModalAction[];
  onClose: () => void;
  width?: number;
}

const AdminRequestConfirmationModal = ({
  open,
  title,
  description,
  actions = [],
  onClose,
  width = 480,
}: AdminRequestConfirmationModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          bgcolor: "#fff",
          borderRadius: "16px",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          {title}
        </Typography>

        {description && (
          <Typography variant="body1" color="text.secondary" mb={4}>
            {description}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "contained"}
              color={action.color || "primary"}
              onClick={action.onClick}
              sx={{
                borderRadius: "10px",
                px: 3,
                textTransform: "none",
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default AdminRequestConfirmationModal;
