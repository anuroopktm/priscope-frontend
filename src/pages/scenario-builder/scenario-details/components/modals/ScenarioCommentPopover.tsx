import { useCreateScenarioComment } from "@/services/queries/scenario-builder/scenario-builder.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useScenarioStore } from "../../store/useScenarioStore";

const ScenarioCommentPopover = () => {
  const { id: scenarioId } = useParams<{ id: string }>();
  const showToast = useToastStore((state) => state.showToast);

  const { isOpen, setIsOpen, commentCell, setCommentCell } = useScenarioStore(
    useShallow((state) => ({
      isOpen: state.isCommentPopoverOpen,
      setIsOpen: state.setIsCommentPopoverOpen,
      commentCell: state.commentCell,
      setCommentCell: state.setCommentCell,
    })),
  );

  const [commentText, setCommentText] = useState("");
  const { mutate: addComment, isPending } = useCreateScenarioComment();

  useEffect(() => {
    if (isOpen) {
      setCommentText("");
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setCommentCell(null);
  };

  const handleConfirm = () => {
    if (!scenarioId || !commentCell || !commentText.trim()) return;

    addComment(
      {
        scenario_id: scenarioId,
        payload: {
          cell_ref: `${commentCell.rowId}:${commentCell.col}`,
          comment: commentText.trim(),
        },
      },
      {
        onSuccess: () => {
          showToast("Comment added successfully", "success");
          handleClose();
        },
        onError: (error) => {
          showToast(getErrorMessage(error, "Failed to add comment"), "error");
        },
      },
    );
  };

  if (!commentCell) return null;

  return (
    <Popover
      open={isOpen}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        commentCell.rect
          ? {
              top:
                commentCell.rect.top + commentCell.rect.height + 15 + 220 >
                window.innerHeight
                  ? commentCell.rect.top - 200 // Show above if not enough space below
                  : commentCell.rect.top + commentCell.rect.height + 15,
              left: Math.min(commentCell.rect.left, window.innerWidth - 350),
            }
          : { top: 100, left: 100 }
      }
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          overflow: "visible",
          width: 320,
          p: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            top:
              commentCell.rect &&
              commentCell.rect.top + commentCell.rect.height + 15 + 220 >
                window.innerHeight
                ? "auto"
                : -8,
            bottom:
              commentCell.rect &&
              commentCell.rect.top + commentCell.rect.height + 15 + 220 >
                window.innerHeight
                ? -8
                : "auto",
            left: 20,
            width: 16,
            height: 16,
            bgcolor: "background.paper",
            transform: "rotate(45deg)",
            zIndex: -1,
          },
        },
      }}
    >
      <Box sx={{ p: 2, position: "relative" }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, color: "text.primary", fontWeight: 500 }}
        >
          Comments*
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type your comment here..."
          variant="standard"
          // autoFocus
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: "13px",
              py: 1,
              borderTop: "1px solid #E5E7EB",
            },
          }}
        />
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            position: "absolute",
            right: -88,
            top: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleConfirm}
            disabled={isPending || !commentText.trim()}
            sx={{
              bgcolor: "white",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              color: "#3B82F6",
              "&:hover": { bgcolor: "#F3F4F6" },
              "&.Mui-disabled": {
                bgcolor: "#F3F4F6",
                color: "#9CA3AF",
                opacity: 0.5,
              },
              width: 36,
              height: 36,
              border: "1px solid #E5E7EB",
            }}
          >
            <CheckIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: "white",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              color: "#EF4444",
              "&:hover": { bgcolor: "#F3F4F6" },
              width: 36,
              height: 36,
              border: "1px solid #E5E7EB",
              ml: "0px !important",
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>
    </Popover>
  );
};

export default ScenarioCommentPopover;
