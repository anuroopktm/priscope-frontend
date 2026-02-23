import {
  useGetPrivilegeTemplates,
  useGetResourcePrivileges,
} from "@/services/user-management/user-management.queries";
import type { CreateUserFormValues } from "@/validations/user-management/create-user.validation";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import PermissionsList from "./PermissionsList";
import RoleSelector from "./RoleSelector";

const PermissionsManager = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateUserFormValues>();

  const currentRole = useWatch({
    control,
    name: "currentRole",
  });
  const permissionsError = errors.permissions;

  const { data: templates, isLoading: isLoadingTemplates } =
    useGetPrivilegeTemplates(import.meta.env.VITE_TENANT_ID);
  const { data: privileges, isLoading: isLoadingPrivileges } =
    useGetResourcePrivileges({
      role_id: currentRole === "custom" ? undefined : currentRole,
      tenant_id: import.meta.env.VITE_TENANT_ID,
    });

  useEffect(() => {
    if (privileges) {
      if (currentRole === "custom") {
        setValue("defaultPermissions", privileges);
      } else {
        setValue("permissions", privileges);
      }
    }
  }, [privileges, currentRole, setValue]);

  const roleOptions = useMemo(() => {
    const fetchedRoles =
      templates?.map((t) => ({
        id: t.role_id,
        name: t.role_name,
      })) || [];

    return [{ id: "custom", name: "Custom" }, ...fetchedRoles];
  }, [templates]);

  const onRoleChange = (newId: string) => {
    if (newId !== currentRole) {
      setValue("permissions", []);
      setValue("currentRole", newId);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <RoleSelector
        value={currentRole}
        onChange={onRoleChange}
        roles={roleOptions}
        loading={isLoadingTemplates}
      />

      {permissionsError && (
        <Box
          sx={{
            p: 1.5,
            bgcolor: "#FEF3F2",
            borderRadius: "6px",
            border: "1px solid #FDA29B",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography color="red" variant="body2" sx={{ fontWeight: 500 }}>
            {permissionsError.message as string}
          </Typography>
        </Box>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: "8px",
          borderColor: permissionsError ? "#F04438" : "#E4E7EC",
          minHeight: "100px",
          borderWidth: permissionsError ? "1px" : "1px",
        }}
      >
        <PermissionsList
          privileges={privileges}
          isLoading={isLoadingPrivileges}
        />
      </Paper>
    </Box>
  );
};

export default PermissionsManager;
