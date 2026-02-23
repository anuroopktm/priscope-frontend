import { useToastStore } from "@/store/useToastStore";
import {
  manageUserSchema,
  type ManageUserFormValues,
} from "@/validations/user-management/manage-user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import { alpha, Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfoSection from "../components/BasicInfoSection";
import PermissionsManager from "../components/PermissionsManager";

const EditUserPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const showToast = useToastStore((state) => state.showToast);

  // In a real app, you would fetch user data here and use it in defaultValues
  const methods = useForm<ManageUserFormValues>({
    resolver: zodResolver(manageUserSchema),
    defaultValues: {
      name: "John Smith",
      email: "john.smith@example.com",
      job_designation: "Senior Developer",
      currentRole: "custom",
      permissions: [
        { resource_privilege_id: "1", display_name: "View Dashboard" },
        { resource_privilege_id: "2", display_name: "Edit Users" },
      ],
    },
  });

  const onUpdate = (data: ManageUserFormValues) => {
    console.log("Updating user:", id, data);
    showToast("User updated successfully", "success");
    navigate(`/user-management/user-details/${id}`);
  };

  const onDelete = () => {
    // Show confirmation dialog logic here
    console.log("Deleting user:", id);
    showToast("User deleted successfully", "success");
    navigate("/user-management/list-users");
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onUpdate)}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: theme.palette.brand.background,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            bgcolor: "white",
            borderBottom: "1px solid #E4E7EC",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/user-management/user-details/${id}`)}
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              Back to details
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Edit User
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2, flex: 1 }}>
          <Box
            sx={{
              height: "calc(100vh - 144px)",
              overflowY: "hidden",
              borderRadius: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{ p: 2, width: "100%", height: "100%", overflowY: "auto" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>
              <BasicInfoSection />

              <Box sx={{ mt: 4 }}>
                <PermissionsManager />
              </Box>

              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #E4E7EC",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={onDelete}
                  sx={{
                    px: 3,
                    borderColor: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.error.main, 0.04),
                    },
                  }}
                >
                  Delete User
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{ px: 4 }}
                >
                  Update User
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default EditUserPage;
