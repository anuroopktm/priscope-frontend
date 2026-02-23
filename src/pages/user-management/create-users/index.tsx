import {
  useCheckPrivilegeTemplate,
  useInviteUser,
} from "@/services/user-management/user-management.queries";
import { useToastStore } from "@/store/useToastStore";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/validations/user-management/create-user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Paper, useTheme } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ActionHeader from "./components/ActionHeader";
import BasicInfoSection from "./components/BasicInfoSection";
import CreateInvitationModal from "./components/CreateInvitationModal";
import FooterActions from "./components/FooterActions";
import PermissionsManager from "./components/PermissionsManager";

const UserManagementCreateUserPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: inviteUser, isPending: isInviting } = useInviteUser();
  const { mutate: checkTemplate, isPending: isCheckingTemplate } =
    useCheckPrivilegeTemplate();

  const methods = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      job_designation: "",
      role: [],
      permissions: [],
      defaultPermissions: [],
      currentRole: "custom",
    },
  });

  const handleCreateInvitation = () => {
    const data = methods.getValues();
    inviteUser(
      {
        email: data.email,
        name: data.name,
        job_designation: data.job_designation,
        tenant_id: import.meta.env.VITE_TENANT_ID,
        resource_privilege_ids: data.permissions.map(
          (p) => p.resource_privilege_id,
        ),
      },
      {
        onSuccess: () => {
          showToast("User invited successfully", "success");
          setShowModal(false);
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

  const onSubmit = () => {
    const data = methods.getValues();
    checkTemplate(
      {
        resource_privilege_ids: data.permissions.map(
          (p) => p.resource_privilege_id,
        ),
      },
      {
        onSuccess: (data) => {
          handleCreateInvitation();
          if (!data.exists) {
            setShowModal(true);
          }
        },
        onError: () => {
          setShowModal(true);
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          if (errors.permissions?.message)
            showToast(errors.permissions.message, "error");
        })}
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
              <FooterActions loading={isInviting || isCheckingTemplate} />
            </Paper>
          </Box>
        </Box>
        <CreateInvitationModal
          open={showModal}
          jobDesignation={methods.getValues("job_designation")}
          onSkip={() => setShowModal(false)}
          onCreate={handleCreateInvitation}
          loading={isInviting}
        />
      </Box>
    </FormProvider>
  );
};

export default UserManagementCreateUserPage;
