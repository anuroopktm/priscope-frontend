import type { ManageUserFormValues } from "@/validations/user-management/manage-user.validation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfoSection from "../user-actions/components/BasicInfoSection";
import PermissionsManager from "../user-actions/components/PermissionsManager";

const UserDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  // In a real app, you would fetch user data here using the id
  const methods = useForm<ManageUserFormValues>({
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

  const handleEdit = () => {
    navigate(`/user-management/edit-user/${id}`);
  };

  return (
    <FormProvider {...methods}>
      <Box
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
              onClick={() => navigate("/user-management/list-users")}
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              Back to list
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              User Details
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
              <BasicInfoSection readOnly />

              <Box sx={{ mt: 4 }}>
                <PermissionsManager readOnly />
              </Box>

              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #E4E7EC",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ px: 4 }}
                >
                  Edit User
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default UserDetailsPage;
