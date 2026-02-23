import { useInviteUser } from "@/services/user-management/user-management.queries";
import type {
  PrivilegeTemplate,
  ResourcePrivilege,
} from "@/services/user-management/user-management.types";
import { useToastStore } from "@/store/useToastStore";
import { Box, Paper, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import BasicInfoSection from "./components/BasicInfoSection";
import FooterActions from "./components/FooterActions";
import PermissionsManager from "./components/PermissionsManager";

export interface CreateUserFormValues {
  name: string;
  email: string;
  role: PrivilegeTemplate[];
  permissions: ResourcePrivilege[];
  currentRole: string;
}

const UserManagementCreateUserPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const { mutate: inviteUser, isPending: isInviting } = useInviteUser();

  const methods = useForm<CreateUserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      role: [],
      permissions: [],
      currentRole: "custom",
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    inviteUser(
      {
        email: data.email,
        name: data.name,
        job_designation: data.currentRole,
        tenant_id: import.meta.env.VITE_TENANT_ID,
        resource_privilege_ids: data.permissions.map(
          (p) => p.resource_privilege_id,
        ),
      },
      {
        onSuccess: () => {
          showToast("User invited successfully", "success");
          navigate("/user-management/list-users");
        },
        onError: (error) => {
          showToast(
            error.response?.data?.detail || "Failed to invite user",
            "error",
          );
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: theme.palette.brand.background,
        }}
      >
        <ActionHeader />

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
              <BasicInfoSection />

              <PermissionsManager />

              <FooterActions loading={isInviting} />
            </Paper>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default UserManagementCreateUserPage;
