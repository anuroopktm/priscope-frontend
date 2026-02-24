import {
  useAssignUserPrivileges,
  useGetResourcePrivileges,
  useListUserDetails,
  useListUserPrivileges,
  useUpdateUser,
} from "@/services/user-management/user-management.queries";
import { useToastStore } from "@/store/useToastStore";
import {
  manageUserSchema,
  type ManageUserFormValues,
} from "@/validations/user-management/manage-user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircularProgress, Paper } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ActionHeader from "../common/ActionHeader";
import BasicInfoSection from "../common/BasicInfoSection";
import FooterActions from "./components/FooterActions";
import PermissionsList from "./components/PermissionsList";

const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const showToast = useToastStore((state) => state.showToast);

  const { data: userDetails, isLoading: isDetailsLoading } = useListUserDetails(
    { user_id: userId },
  );
  const { data: userPrivileges, isLoading: isPrivilegesLoading } =
    useListUserPrivileges({ user_id: userId });
  const { data: allPrivileges, isLoading: isAllPrivilegesLoading } =
    useGetResourcePrivileges({
      tenant_id: import.meta.env.VITE_TENANT_ID,
    });
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  const { mutateAsync: assignPrivileges, isPending: isAssigningPrivileges } =
    useAssignUserPrivileges();

  const methods = useForm<ManageUserFormValues>({
    resolver: zodResolver(manageUserSchema),
    defaultValues: {
      name: "",
      email: "",
      job_designation: "",
      currentRole: "custom",
      permissions: [],
      defaultPermissions: [],
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (userDetails && allPrivileges) {
      reset({
        name: userDetails.name,
        email: userDetails.email,
        job_designation: userDetails.job_designation,
        currentRole: "custom",
        defaultPermissions: allPrivileges,
        permissions:
          userPrivileges?.resource_privilege_ids.map((id) => ({
            display_name: id,
            resource_privilege_id: id,
            description: "",
          })) || [],
      });
    }
  }, [userDetails, userPrivileges, allPrivileges, reset]);

  const onUpdate = async (data: ManageUserFormValues) => {
    try {
      await updateUser({
        user_id: userId || "",
        name: data.name,
        job_designation: data.job_designation,
        status: userDetails?.tenant_user_status || "active",
      });

      await assignPrivileges({
        user_id: userId || "",
        tenant_id: import.meta.env.VITE_TENANT_ID,
        resource_privilege_ids: data.permissions.map(
          (p) => p.resource_privilege_id,
        ),
      });

      showToast("User updated successfully", "success");
      navigate(`/user-management/user-details/${userId}`);
    } catch (error: any) {
      showToast(
        error.response?.data?.detail || "Failed to update user",
        "error",
      );
    }
  };

  const onDelete = () => {
    console.log("Deleting user:", userId);
    showToast("User deleted successfully", "success");
    navigate("/user-management/list-users");
  };

  if (isDetailsLoading || isPrivilegesLoading || isAllPrivilegesLoading) {
    return (
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "brand.background",
        }}
      >
        <Box
          sx={{
            flex: 1,
            borderRadius: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onUpdate)}
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "brand.background",
        }}
      >
        <ActionHeader title="Edit User" />

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
              <PermissionsList />
              <FooterActions
                loading={isUpdatingUser || isAssigningPrivileges}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default EditUserPage;
