import type { ResourcePrivilege } from "@/services/user-management/user-management.types";
import type { CreateUserFormValues } from "@/validations/user-management/create-user.validation";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import PermissionItem from "./PermissionItem";

interface PermissionsListProps {
  privileges: ResourcePrivilege[] | undefined;
  isLoading: boolean;
}

const PermissionsList = ({ privileges, isLoading }: PermissionsListProps) => {
  const { control, setValue } = useFormContext<CreateUserFormValues>();

  const defaultPrivileges =
    useWatch({
      control,
      name: "defaultPermissions",
    }) || [];

  const selectedPermissions =
    useWatch({
      control,
      name: "permissions",
    }) || [];

  const currentRole = useWatch({
    control,
    name: "currentRole",
  });

  const isEditable = currentRole === "custom";

  const displayPrivileges = useMemo(
    () => (defaultPrivileges.length > 0 ? defaultPrivileges : privileges),
    [defaultPrivileges, privileges],
  );

  const selectedIds = useMemo(
    () => new Set(selectedPermissions.map((p) => p.resource_privilege_id)),
    [selectedPermissions],
  );

  const handleToggle = useCallback(
    (p: ResourcePrivilege) => {
      const id = p.resource_privilege_id;
      const isSelected = selectedIds.has(id);

      if (isSelected) {
        setValue(
          "permissions",
          selectedPermissions.filter((pr) => pr.resource_privilege_id !== id),
          { shouldValidate: true },
        );
      } else {
        setValue("permissions", [...selectedPermissions, p], {
          shouldValidate: true,
        });
      }
    },
    [selectedIds, selectedPermissions, setValue],
  );

  const columns = useMemo(() => {
    if (!displayPrivileges || displayPrivileges.length === 0) return [];
    const mid = Math.ceil(displayPrivileges.length / 2);
    return [displayPrivileges.slice(0, mid), displayPrivileges.slice(mid)];
  }, [displayPrivileges]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (!displayPrivileges || displayPrivileges.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">
          Select a role to see permissions
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container>
      {columns.map((col, index) => (
        <Grid
          key={index}
          size={{ xs: 12, md: 6 }}
          sx={{
            p: 3,
            borderRight: index === 0 ? "1px solid #E4E7EC" : "none",
            "&>div:last-child": { mb: 0 },
          }}
        >
          {col.map((p: ResourcePrivilege) => (
            <PermissionItem
              key={p.resource_privilege_id}
              privilege={p}
              checked={selectedIds.has(p.resource_privilege_id)}
              disabled={!isEditable}
              onToggle={handleToggle}
            />
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default PermissionsList;
