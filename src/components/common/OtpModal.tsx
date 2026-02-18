import {
  Box,
  Dialog,
  DialogContent,
  type DialogProps,
  Fade,
  IconButton,
  styled,
} from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";
import React, { forwardRef } from "react";

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface OtpModalProps extends Omit<DialogProps, "title"> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /**
   * Optional accessible title for screen readers
   */
  title?: string;
}

// ----------------------------------------------------------------------
// Styled Components
// ----------------------------------------------------------------------

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4, 3), // Generous padding
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  position: "relative",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(6, 6),
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.grey[500],
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.grey[800],
  },
}));

// ----------------------------------------------------------------------
// Transition Component
// ----------------------------------------------------------------------

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});

// ----------------------------------------------------------------------
// Component Implementation
// ----------------------------------------------------------------------

export const OtpModal = forwardRef<HTMLDivElement, OtpModalProps>(
  ({ open, onClose, children, title = "Authentication", ...other }, ref) => {
    return (
      <Dialog
        ref={ref}
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted={false}
        scroll="body"
        maxWidth="xs"
        fullWidth
        aria-labelledby="otp-modal-title"
        {...other}
      >
        <CloseButton aria-label="close" onClick={onClose} size="large">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </CloseButton>

        <StyledDialogContent>
          {/* Helper for screen readers */}
          <Box
            id="otp-modal-title"
            sx={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            {title}
          </Box>

          {children}
        </StyledDialogContent>
      </Dialog>
    );
  },
);

OtpModal.displayName = "OtpModal";
