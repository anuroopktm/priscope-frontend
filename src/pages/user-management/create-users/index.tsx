import type {
  PrivilegeTemplate,
  ResourcePrivilege,
} from "@/services/user-management/user-management.types";
import { Box, Paper, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
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
    console.log("Form Data:", data);
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
          <Paper
            elevation={0}
            sx={{ p: 2, height: "calc(100vh - 144px)", overflowY: "auto" }}
          >
            <BasicInfoSection />

            <PermissionsManager />

            <FooterActions />
          </Paper>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default UserManagementCreateUserPage;
