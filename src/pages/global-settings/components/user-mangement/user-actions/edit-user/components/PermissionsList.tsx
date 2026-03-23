import type { ResourcePrivilege } from "@/services/user-management/user-management.types";
import type { ManageUserFormValues } from "@/validations/user-management/manage-user.validation";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import PermissionItem from "../../common/PermissionItem";

const PermissionsList = () => {
  const { control, setValue } = useFormContext<ManageUserFormValues>();

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

  const selectedIds = useMemo(
    () => new Set(selectedPermissions.map((p) => p.resource_privilege_id)),
    [selectedPermissions],
  );

  const selectedNames = useMemo(
    () => new Set(selectedPermissions.map((p) => p.display_name)),
    [selectedPermissions],
  );

  const handleToggle = useCallback(
    (p: ResourcePrivilege) => {
      const id = p.resource_privilege_id;
      const isSelected =
        selectedIds.has(id) || selectedNames.has(p.display_name);

      if (isSelected) {
        setValue(
          "permissions",
          selectedPermissions.filter(
            (pr) =>
              pr.resource_privilege_id !== id &&
              pr.display_name !== p.display_name,
          ),
          { shouldValidate: true },
        );
      } else {
        setValue("permissions", [...selectedPermissions, p], {
          shouldValidate: true,
        });
      }
    },
    [selectedIds, selectedNames, selectedPermissions, setValue],
  );

  const columns = useMemo(() => {
    if (!defaultPrivileges || defaultPrivileges.length === 0) return [];
    const mid = Math.ceil(defaultPrivileges.length / 2);
    return [defaultPrivileges.slice(0, mid), defaultPrivileges.slice(mid)];
  }, [defaultPrivileges]);

  if (!defaultPrivileges || defaultPrivileges.length === 0) {
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
        <Typography color="text.secondary">No permissions found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" sx={{ color: "primary.main" }}>
        Permissions
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: "8px",
          border: "1px solid #E4E7EC",
        }}
      >
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
                  checked={
                    selectedIds.has(p.resource_privilege_id) ||
                    selectedNames.has(p.display_name)
                  }
                  onToggle={handleToggle}
                />
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default PermissionsList;
