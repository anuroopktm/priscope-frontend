import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  isLoading?: boolean;
}

interface CommentForm {
  commentText: string;
}

const CommentModal = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: CommentModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CommentForm>({
    defaultValues: {
      commentText: "",
    },
  });

  const commentValue = watch("commentText");

  useEffect(() => {
    if (open) {
      reset({ commentText: "" });
    }
  }, [open, reset]);

  const handleConfirm = (data: CommentForm) => {
    onConfirm(data.commentText.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        Comments
      </Typography>

      <Divider sx={{ borderColor: "#E2E8F0" }} />

      <DialogContent sx={{ py: 3 }}>
        <TextField
          {...register("commentText", { required: true })}
          fullWidth
          multiline
          rows={6}
          placeholder="Type your Comments here"
          variant="outlined"
          error={!!errors.commentText}
          helperText={errors.commentText ? "Comment is required" : ""}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={!commentValue?.trim()}
          loading={isLoading}
          onClick={handleSubmit(handleConfirm)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;
