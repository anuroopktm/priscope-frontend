import EmailInviteIcon from "@/assets/modal/email-invite.svg";
import { useCheckTemplateName } from "@/services/user-management/user-management.queries";
import {
  createInvitationSchema,
  type CreateInvitationForm,
} from "@/validations/user-management/create-invitation.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  alpha,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface CreateInvitationModalProps {
  open: boolean;
  jobDesignation: string;
  isLoading: boolean;
  isTemplateExists: boolean;
  onSkip: () => void;
  onCreate: (templateName?: string) => void;
}

const CreateInvitationModal = ({
  open,
  jobDesignation,
  isLoading,
  isTemplateExists,
  onSkip,
  onCreate,
}: CreateInvitationModalProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateInvitationForm>({
    resolver: zodResolver(createInvitationSchema(isTemplateExists)),
    defaultValues: {
      templateName: jobDesignation,
    },
  });

  const templateName = watch("templateName");
  const { mutate: checkTemplateName, isPending: isCheckingName } =
    useCheckTemplateName();

  const debouncedCheck = useMemo(
    () =>
      debounce((name: string) => {
        if (name && name.length >= 3) {
          checkTemplateName(
            { template_name: name },
            {
              onSuccess: (data) => {
                if (data.exists) {
                  setError("templateName", {
                    type: "manual",
                    message: "Template name is already taken",
                  });
                } else {
                  clearErrors("templateName");
                }
              },
            },
          );
        }
      }, 500),
    [checkTemplateName, setError, clearErrors],
  );

  useEffect(() => {
    if (!isTemplateExists) {
      debouncedCheck(templateName || "");
    }
    return () => debouncedCheck.cancel();
  }, [templateName, debouncedCheck, isTemplateExists]);

  const handleClose = (_e: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick") return;
    onSkip();
  };

  const handleBack = () => navigate("/user-management/list-users");

  const onSubmit = (data: CreateInvitationForm) => onCreate(data.templateName);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box sx={{ mt: 2, mb: 3 }}>
            <Box component="img" src={EmailInviteIcon} sx={{ width: 100 }} />
          </Box>

          <Typography
            variant="h6"
            sx={(theme) => ({ color: alpha(theme.palette.primary.main, 0.9) })}
          >
            Invitation email sent successfully
          </Typography>

          {!isTemplateExists ? (
            <>
              <Typography variant="body2" color="text.secondary">
                Save permissions as a template
              </Typography>

              <TextField
                // fullWidth
                size="small"
                label="Template name"
                {...register("templateName")}
                error={!!errors.templateName}
                helperText={errors.templateName?.message}
                sx={{ mt: 1 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {isCheckingName && (
                          <CircularProgress size={16} color="inherit" />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  size="large"
                  variant="outlined"
                  onClick={onSkip}
                  loading={isLoading}
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
                  Skip
                </Button>

                <Button
                  size="large"
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                >
                  Create Template
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Alert
                severity="warning"
                sx={(theme) => ({
                  width: "100%",
                  mt: 2,
                  backgroundColor: alpha(theme.palette.warning.main, 0.08),
                })}
              >
                A template with similar permissions already exists. The
                invitation was sent using these permissions.
              </Alert>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button size="large" variant="contained" onClick={handleBack}>
                  Go to users page
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CreateInvitationModal;
