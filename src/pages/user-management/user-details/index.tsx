import {
  useGetResourcePrivileges,
  useListUserDetails,
  useListUserPrivileges,
} from "@/services/user-management/user-management.queries";
import type { ManageUserFormValues } from "@/validations/user-management/manage-user.validation";
import { Box, CircularProgress, Paper } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ActionHeader from "../user-actions/common/ActionHeader";
import BasicInfoSection from "../user-actions/common/BasicInfoSection";
import FooterActions from "./components/FooterActions";
import PermissionsList from "./components/PermissionsList";

const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const { data: userDetails, isLoading: isDetailsLoading } = useListUserDetails(
    { user_id: userId },
  );
  const { data: userPrivileges, isLoading: isPrivilegesLoading } =
    useListUserPrivileges({ user_id: userId });
  const { data: allPrivileges, isLoading: isAllPrivilegesLoading } =
    useGetResourcePrivileges({
      tenant_id: import.meta.env.VITE_TENANT_ID,
    });

  const methods = useForm<ManageUserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      job_designation: "",
      currentRole: "custom",
      permissions: [],
      defaultPermissions: [],
    },
    disabled: true,
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

  const handleEdit = () => {
    navigate(`/user-management/edit-user/${userId}`);
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
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "brand.background",
        }}
      >
        <ActionHeader title="User Details" />

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
              <FooterActions handleEdit={handleEdit} />
            </Paper>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default UserDetailsPage;
