import type { ResourcePrivilege } from "@/services/user-management/user-management.types";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { CreateUserFormValues } from "..";
import PermissionItem from "./PermissionItem";

interface PermissionsListProps {
  privileges: ResourcePrivilege[] | undefined;
  isLoading: boolean;
}

const PermissionsList = ({ privileges, isLoading }: PermissionsListProps) => {
  const { watch, setValue } = useFormContext<CreateUserFormValues>();
  const selectedPermissions = watch("permissions") || [];

  if (isLoading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!privileges || privileges.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Select a role to see permissions
        </Typography>
      </Box>
    );
  }

  const midPoint = Math.ceil(privileges.length / 2);
  const columns = [privileges.slice(0, midPoint), privileges.slice(midPoint)];

  const handleChange = (p: ResourcePrivilege, id: string) => {
    const isSelected = selectedPermissions.some(
      (pr) => pr.resource_privilege_id === id,
    );
    if (isSelected) {
      setValue(
        "permissions",
        selectedPermissions.filter((pr) => pr.resource_privilege_id !== id),
      );
    } else {
      setValue("permissions", [...selectedPermissions, p]);
    }
  };

  const isAvailable = (id: string) =>
    selectedPermissions.some((pr) => pr.resource_privilege_id === id);

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
              label={p.display_name}
              desc={p.description}
              checked={isAvailable(p.resource_privilege_id) || false}
              handleChange={() => handleChange(p, p.resource_privilege_id)}
            />
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default PermissionsList;
