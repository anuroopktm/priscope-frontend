import {
  useGetPrivilegeTemplates,
  useGetResourcePrivileges,
} from "@/services/user-management/user-management.queries";
import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CreateUserFormValues } from "..";
import PermissionsList from "./PermissionsList";
import RoleSelector from "./RoleSelector";

const PermissionsManager = () => {
  const { watch, setValue } = useFormContext<CreateUserFormValues>();

  const currentRole = watch("currentRole");

  const { data: templates, isLoading: isLoadingTemplates } =
    useGetPrivilegeTemplates(import.meta.env.VITE_TENANT_ID);
  const { data: privileges, isLoading: isLoadingPrivileges } =
    useGetResourcePrivileges({
      role_id: currentRole === "custom" ? undefined : currentRole,
      tenant_id: import.meta.env.VITE_TENANT_ID,
    });

  const roleOptions = useMemo(() => {
    const fetchedRoles =
      templates?.map((t) => ({
        id: t.role_id,
        name: t.role_name,
      })) || [];

    return [{ id: "custom", name: "Custom" }, ...fetchedRoles];
  }, [templates]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <RoleSelector
        value={currentRole}
        onChange={(newId) => setValue("currentRole", newId)}
        roles={roleOptions}
        loading={isLoadingTemplates}
      />

      <Paper
        variant="outlined"
        sx={{ borderRadius: "8px", borderColor: "#E4E7EC", minHeight: "100px" }}
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
