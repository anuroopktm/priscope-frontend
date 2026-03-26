import {
  useCheckPrivilegeTemplate,
  useCreateRole,
  useInviteUser,
} from "@/services/user-management/user-management.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import {
  manageUserSchema,
  type ManageUserFormValues,
} from "@/validations/user-management/manage-user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Paper } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ActionHeader from "../common/ActionHeader";
import BasicInfoSection from "../common/BasicInfoSection";
import CreateInvitationModal from "./components/CreateInvitationModal";
import FooterActions from "./components/FooterActions";
import PermissionsManager from "./components/PermissionsManager";

const GlobalSettingsCreateUserPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: inviteUser, isPending: isInviting } = useInviteUser();
  const {
    mutate: checkTemplate,
    isPending: isCheckingTemplate,
    data: checkTemplateData,
  } = useCheckPrivilegeTemplate();
  const { mutate: createRole, isPending: isCreatingRole } = useCreateRole();

  const methods = useForm<ManageUserFormValues>({
    resolver: zodResolver(manageUserSchema),
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
          setShowModal(true);
        },
        onError: (error) => {
          showToast(getErrorMessage(error, "Failed to invite user"), "error");
        },
      },
    );
  };

  const handleCreateTemplate = (templateName?: string) => {
    if (!templateName) return;

    const data = methods.getValues();
    createRole(
      {
        description: `Template for ${templateName}`,
        resource_privilege_id: data.permissions.map(
          (p) => p.resource_privilege_id,
        ),
        role_name: templateName,
        role_type: "tenant",
      },
      {
        onSuccess: () => {
          showToast("Template created successfully", "success");
          setShowModal(false);
          navigate("/global-settings/users");
        },
        onError: (error) => {
          showToast(
            getErrorMessage(error, "Failed to create template"),
            "error",
          );
        },
      },
    );
  };

  const handleSkipTemplate = () => {
    setShowModal(false);
    navigate("/global-settings/users");
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
        onSuccess: () => {
          handleCreateInvitation();
        },
        onError: (error) => {
          showToast(
            getErrorMessage(error, "Failed to check template"),
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
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          if (errors.permissions?.message)
            showToast(errors.permissions.message as string, "error");
        })}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "brand.background",
          height: "100%",
        }}
      >
        <ActionHeader title="Add new user" />
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
      </Box>
      <CreateInvitationModal
        open={showModal}
        jobDesignation={methods.getValues("job_designation")}
        onSkip={handleSkipTemplate}
        onCreate={handleCreateTemplate}
        isLoading={isCreatingRole}
        isTemplateExists={!!checkTemplateData?.exists}
      />
    </FormProvider>
  );
};

export default GlobalSettingsCreateUserPage;
